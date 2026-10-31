# Contributing

This is Christopher Steel's personal website. Changes are reviewed by Christopher Steel before they reach `main`.

## Before committing

- Follow the content rules and the definition of done in `CLAUDE.md`: the build has no errors or warnings, and `npm run lint`, `npm run check`, `npm run check:browser` and `uc-automa check` pass.
- A page gets its translation in every locale, in the same commit.
- Regenerate the documentation index with `uc-automa docs index`; never edit it by hand.
- A choice that shapes the site is a decision record in `en-ca/docs/decisions/`.

## Licences

Contributions are accepted under the licences the repository uses, inbound equals outbound: MIT for code, and CC BY 4.0 for documentation and content. `REUSE.toml` records the licence of every path, including the fonts and vendored libraries that keep their own.

## License

This document, *Contributing*, by **Christopher Steel**, with AI assistance from **Claude Opus 5.5 (Anthropic)**, is licensed under the [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/).
