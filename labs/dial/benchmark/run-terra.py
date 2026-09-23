"""Run the available Terra model on the same claim-triage excerpts, with no gold leakage."""

import json
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CASES = json.loads((ROOT / "cases.json").read_text())
MODEL = "gpt-5.6-terra"


def main():
    with tempfile.TemporaryDirectory(prefix="dial-terra-benchmark-") as temp:
        temp_path = Path(temp)
        schema = {
            "type": "object",
            "properties": {
                "results": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "string"},
                            "kind": {
                                "type": "string",
                                "enum": ["team", "publication", "project", "grant", "award", "news", "none"],
                            },
                            "scope": {"type": "string", "enum": ["dial", "review", "outside"]},
                        },
                        "required": ["id", "kind", "scope"],
                        "additionalProperties": False,
                    },
                }
            },
            "required": ["results"],
            "additionalProperties": False,
        }
        schema_path = temp_path / "schema.json"
        output_path = temp_path / "output.json"
        schema_path.write_text(json.dumps(schema))
        prompt = (
            "Classify each excerpt using ONLY its supplied text. Return one result per id. "
            "kind is the primary LabKit record claim: team (named researcher), publication "
            "(scholarly citation), project (named body of research work), grant (funding), "
            "award (recognition), news (event or dated announcement), or none (no record). "
            "scope is dial only if the excerpt explicitly establishes DIAL involvement, "
            "review if Lab membership or ownership needs confirmation, and outside if there "
            "is no DIAL content record. A person or Publication appearing on a source site "
            "alone does not establish DIAL membership. Do not use files, tools, outside "
            "knowledge, or the source filenames.\n\n"
            + json.dumps([{"id": case["id"], "text": case["text"]} for case in CASES])
        )
        result = subprocess.run(
            [
                "codex", "exec", "--model", MODEL, "--sandbox", "read-only",
                "--skip-git-repo-check", "--ephemeral", "--cd", temp,
                "--output-schema", str(schema_path), "--output-last-message", str(output_path), "-",
            ],
            input=prompt,
            text=True,
            capture_output=True,
            timeout=180,
        )
        if result.returncode:
            raise RuntimeError(f"Codex failed ({result.returncode}): {result.stderr[-1200:]}")
        predictions = {row["id"]: row for row in json.loads(output_path.read_text())["results"]}

    rows = []
    for case in CASES:
        predicted = predictions[case["id"]]
        rows.append({
            "id": case["id"],
            "expected": {key: case[key] for key in ("kind", "scope")},
            "predicted": {key: predicted[key] for key in ("kind", "scope")},
            "correct": {key: predicted[key] == case[key] for key in ("kind", "scope")},
        })
    for key in ("kind", "scope"):
        print(f"{key}: {sum(row['correct'][key] for row in rows)}/{len(rows)}")
    output = ROOT / "terra-results.json"
    output.write_text(json.dumps({"model": MODEL, "results": rows}, indent=2) + "\n")
    print(output)


if __name__ == "__main__":
    main()
