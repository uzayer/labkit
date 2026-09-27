# DIAL extraction benchmark

`cases.json` is a frozen, small diagnostic sample of claims in the September 12 raw captures. `source` points to the raw file and line range. These labels describe what the **excerpt alone** supports; `review` is not a negative judgment about the eventual Lab record. Do not use these examples as approved seed data.

Run Laya's local server (`laya-server status`) and then `python3 labs/dial/benchmark/run-laya.py`. The output is `laya-results.json`, which is local benchmark output, not a source of facts. Laya only answers the two typed triage questions. The run does not test schema extraction.

For an LLM comparison, run `python3 labs/dial/benchmark/run-terra.py`. It invokes Codex CLI in a temporary directory with only the excerpts and label definitions, so the gold labels and repo files are unavailable to the model. It writes `terra-results.json` using the available `gpt-5.6-terra` model. A separate extraction test should ask for Payload-shaped fields and verbatim evidence references; Laya has no generated text output for that test. The model name requested as “GPT-6 Terra” is not currently among the available model IDs in this Codex task; do not relabel GPT-5.6 Terra results as GPT-6 Terra.

The sample is intentionally too small to justify automating publication or identity decisions. Its use is to detect whether Laya can cheaply route claims to a review queue, and whether a generative model can extract fields without inventing them. Run `python3 labs/dial/benchmark/run-extraction.py` for the separate eight-excerpt extraction check; its gold fields are in `extraction-cases.json` and its output is `extraction-results.json`.

## September 24 diagnostic (Jev rows added September 27)

| Model                                      | Claim type | DIAL scope |
| ------------------------------------------ | ---------: | ---------: |
| Local Laya English checkpoint              |      11/12 |       3/12 |
| `gpt-5.6-terra` through Codex CLI          |      12/12 |      11/12 |
| Jev (`jev-1.13.0`), three-way scope Choice |      12/12 |       3/12 |
| Jev (`jev-1.13.0`), decomposed scope       |      12/12 |      12/12 |

The one Terra scope error treated the Winter School excerpt as explicitly DIAL-owned; its wording says DIAL colleagues attended an event under the broader NSUHCI/BanglaCHI section, so the conservative label is `review`. Laya usually mapped `review` to `outside`, making it unsuitable for publication or Lab-scope decisions without task-specific training. This diagnostic compares classification only. It does **not** measure field extraction or prove general accuracy from 12 examples. The Laya server used its English checkpoint on all cases. CLI and local-server latency were not measured comparably.

On the eight-excerpt field task, `gpt-5.6-terra` produced **6/8 exact field maps** and copied the supplied source reference for all eight. Its two misses were News Item fields: it added a `year` field (not in that collection's schema) to two events, and expanded one title with a location. This is a useful warning that even a strong extraction result needs schema validation and an evidence review before seeding. Laya cannot run this field-generation task.

## Jev (September 27)

`TYPESAFE_API_KEY=… python3 labs/dial/benchmark/run-jev.py` sends each excerpt alone to TypeSafe's Jev, a System One model that answers typed Choice/Score/Noul questions and never generates text. It writes `jev-results.json`. Asked scope as the same three-way label, Jev failed exactly like Laya: it read `review` literally and answered `outside` (confidence 0.71–0.86) whenever the excerpt did not name DIAL. Following Jev's own guidance to split judgments into atomic questions, scope became one Noul, "the excerpt explicitly states DIAL owns, ran, or is the affiliation of this", combined in code with the kind answer: kind `none` → `outside`, probability ≥ 0.5 → `dial`, else `review`. That scored 12/12, with a wide margin (DIAL-owned cases at 0.68–0.73, everything else at or below 0.18). The whole run cost about 5.8k input tokens (≈ $0.0002).

The rule was designed after seeing the three-way failure on these same 12 cases, so the 12/12 is a fit, not a held-out result. It still justifies Jev only as a routing aid, which is how `scripts/ingestion/triage-dial-manifest.ts` uses it. Jev cannot do the extraction task.
