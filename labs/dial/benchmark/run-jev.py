"""Run TypeSafe's Jev on the same claim-triage excerpts, with no gold leakage.

Requires TYPESAFE_API_KEY. Each excerpt is its own request (state = excerpt text
only), because Jev's accuracy drops when the state carries unrelated content.
"""

import json
import os
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CASES = json.loads((ROOT / "cases.json").read_text())
MODEL = "jev-latest"
URL = os.environ.get("TYPESAFE_BASE_URL", "https://api.typesafe.ai").rstrip("/") + "/v1/systemone"

# Same label definitions as run-terra.py, split into Choice criteria.
QUESTIONS = {
    "kind": {
        "type": "choice",
        "instructions": "What is the primary LabKit record this excerpt claims?",
        "criteria": {
            "team": "A named researcher",
            "publication": "A scholarly citation",
            "project": "A named body of research work",
            "grant": "Funding",
            "award": "A recognition",
            "news": "An event or dated announcement",
            "none": "No record",
        },
    },
    # Scope is decomposed into one atomic fact; scope_of() combines it with kind.
    # A three-way scope Choice scored 3/12: Jev read "review" literally and
    # answered "outside" whenever DIAL was not named.
    "dial_owned": {
        "type": "noul",
        "instructions": (
            "The excerpt explicitly states that DIAL (the Design Inclusion and Access Lab) "
            "itself owns, ran, or is the affiliation of this person or work. DIAL members "
            "merely attending or appearing somewhere does not count."
        ),
    },
}


def scope_of(kind, dial_owned):
    if kind == "none":
        return "outside"
    return "dial" if dial_owned >= 0.5 else "review"


def ask(text):
    body = json.dumps({"model": MODEL, "state": text, "questions": QUESTIONS}).encode()
    request = urllib.request.Request(
        URL,
        data=body,
        headers={
            "Authorization": f"Bearer {os.environ['TYPESAFE_API_KEY']}",
            "Content-Type": "application/json",
        },
    )
    started = time.perf_counter()
    with urllib.request.urlopen(request, timeout=30) as response:
        payload = json.loads(response.read())
    return payload, time.perf_counter() - started


def main():
    rows, tokens, served_model = [], 0, None
    for case in CASES:
        payload, seconds = ask(case["text"])
        served_model = payload.get("model", served_model)
        tokens += payload.get("usage", {}).get("input_tokens", 0)
        answers = payload["answers"]
        kind = answers["kind"]["choice"]
        dial_owned = answers["dial_owned"]["noul"]
        predicted = {"kind": kind, "scope": scope_of(kind, dial_owned)}
        rows.append({
            "id": case["id"],
            "expected": {key: case[key] for key in ("kind", "scope")},
            "predicted": predicted,
            "kindConfidence": answers["kind"].get("confidence"),
            "dialOwned": dial_owned,
            "correct": {key: predicted[key] == case[key] for key in ("kind", "scope")},
            "seconds": round(seconds, 3),
        })
    for key in ("kind", "scope"):
        print(f"{key}: {sum(row['correct'][key] for row in rows)}/{len(rows)}")
    print(f"model: {served_model}; input tokens: {tokens}")
    output = ROOT / "jev-results.json"
    output.write_text(json.dumps({"model": served_model, "inputTokens": tokens, "results": rows}, indent=2) + "\n")
    print(output)


if __name__ == "__main__":
    main()
