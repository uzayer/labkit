// @retorquere/bibtex-parser's package.json points `types` at a
// dist/types/index.d.ts that isn't actually published in the npm tarball
// (verified: only dist/cjs, dist/esm, dist/data ship). Minimal ambient
// declaration covering only what this repo's ingestion scripts use.
declare module '@retorquere/bibtex-parser' {
  export interface BibtexCreator {
    firstName?: string
    lastName?: string
    name?: string
  }

  export interface BibtexEntry {
    type: string
    key: string
    fields: Record<string, string | BibtexCreator[] | string[] | undefined>
  }

  export interface BibtexError {
    error: string
    input: string
  }

  export interface ParsedBibtex {
    entries: BibtexEntry[]
    errors: BibtexError[]
  }

  export function parse(input: string, options?: Record<string, unknown>): ParsedBibtex
  export function parseAsync(
    input: string,
    options?: Record<string, unknown>,
  ): Promise<ParsedBibtex>
}
