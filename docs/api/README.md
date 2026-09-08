# API schema reference

`pennpromise-schema.json` is a snapshot of the backend's OpenAPI document,
pulled by `npm run sync:schema` (also runs automatically before `npm run dev`).

It is a **reference document to grep**, not codegen input. Diff your assumptions
against it before writing or changing a `src/services/*.ts` file.

TODO(api-contract): set `API_SCHEMA_URL` in `.env.local` to the real backend
schema endpoint. Until then this file will not be generated. Consider adding
`openapi-typescript` codegen once the contract stabilises — dgtool_fe's history
shows manual sync still lets drift bugs through.
