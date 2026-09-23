"""Evaluate source-grounded Payload field extraction on frozen excerpts."""

import json
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CASES = {case["id"]: case for case in json.loads((ROOT / "cases.json").read_text())}
EXTRACTION = json.loads((ROOT / "extraction-cases.json").read_text())
MODEL = "gpt-5.6-terra"


def main():
    with tempfile.TemporaryDirectory(prefix="dial-extraction-") as temp:
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
                            "fields": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "field": {"type": "string"},
                                        "value": {"type": "string"},
                                        "source": {"type": "string"},
                                    },
                                    "required": ["field", "value", "source"],
                                    "additionalProperties": False,
                                },
                            },
                        },
                        "required": ["id", "fields"],
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
        inputs = [
            {"id": row["id"], "source": CASES[row["id"]]["source"], "text": CASES[row["id"]]["text"]}
            for row in EXTRACTION
        ]
        prompt = (
            "Extract only source-supported fields into LabKit's schema. Allowed fields: "
            "title, year, doi, type, status, date, datePrecision. Use exact source wording "
            "for title, ISO YYYY-MM-DD for a fully stated date, year as a four-digit string, "
            "and 'conference' for a proceedings citation, 'journal' for a periodical, "
            "'event' for an event, "
            "'ongoing' only when work is explicitly active. Return an empty fields array "
            "for a non-record. For each field cite the supplied source string exactly. "
            "Do not infer Lab ownership, relationships, missing dates, or fields from "
            "other sources. Do not use files, tools, or outside knowledge.\n\n"
            + json.dumps(inputs)
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
    for case in EXTRACTION:
        fields = predictions[case["id"]]["fields"]
        actual = {field["field"]: field["value"] for field in fields}
        expected = case["expected"]
        source_ok = all(field["source"] == CASES[case["id"]]["source"] for field in fields)
        rows.append({
            "id": case["id"], "expected": expected, "predicted": actual,
            "exact": actual == expected, "source_ok": source_ok,
        })
    print(f"exact records: {sum(row['exact'] for row in rows)}/{len(rows)}")
    print(f"source citations: {sum(row['source_ok'] for row in rows)}/{len(rows)}")
    output = ROOT / "extraction-results.json"
    output.write_text(json.dumps({"model": MODEL, "results": rows}, indent=2) + "\n")
    print(output)


if __name__ == "__main__":
    main()
