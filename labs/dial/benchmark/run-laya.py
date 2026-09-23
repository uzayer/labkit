"""Score the local Laya server on the frozen claim-triage sample; no DB writes."""

import json
import os
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CASES = json.loads((ROOT / "cases.json").read_text())
QUESTIONS = {
    "kind": {
        "type": "choice",
        "instructions": "What LabKit record does this excerpt primarily describe?",
        "criteria": {
            "team": "a named researcher or team member",
            "publication": "a scholarly publication or citation",
            "project": "a named body of research work",
            "grant": "money or funding awarded for work",
            "award": "recognition or a prize",
            "news": "an event or dated announcement",
            "none": "navigation, profile links, or no record claim",
        },
    },
    "scope": {
        "type": "choice",
        "instructions": "Does this excerpt alone establish that this belongs on DIAL's public website?",
        "criteria": {
            "dial": "explicitly states DIAL involvement",
            "review": "Lab membership or ownership needs confirmation",
            "outside": "not a DIAL content record",
        },
    },
}


def main():
    results = []
    for case in CASES:
        headers = {"Content-Type": "application/json"}
        if os.environ.get("LAYA_API_KEY"):
            headers["Authorization"] = f"Bearer {os.environ['LAYA_API_KEY']}"
        request = urllib.request.Request(
            "http://127.0.0.1:8000/v1/systemone",
            data=json.dumps({"state": {"body": case["text"]}, "questions": QUESTIONS}).encode(),
            headers=headers,
        )
        with urllib.request.urlopen(request, timeout=60) as response:
            result = json.load(response)
        answers = result.get("answers", {})
        predictions = {key: answers.get(key, {}).get("choice") for key in QUESTIONS}
        results.append(
            {
                "id": case["id"],
                "expected": {key: case[key] for key in QUESTIONS},
                "predicted": predictions,
                "correct": {key: predictions[key] == case[key] for key in QUESTIONS},
                "latency_ms": result.get("latency_ms"),
                "routing": result.get("routing"),
            }
        )
    for key in QUESTIONS:
        correct = sum(row["correct"][key] for row in results)
        print(f"{key}: {correct}/{len(results)}")
    output = ROOT / "laya-results.json"
    output.write_text(json.dumps(results, indent=2) + "\n")
    print(output)


if __name__ == "__main__":
    main()
