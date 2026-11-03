# Changelog

All notable changes are recorded here, in the form of [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). This repository follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- chrissteel.com on the Katagami theme, with placeholder content in en-ca, fr-ca and the ar right-to-left fixture: home, articles, projects, collaboration and about, a five-item menu, and a footer and colophon per locale.
- The sidecar and the founding decision, uc-automa's offerings, and `REUSE.toml` annotations with the licence texts for the fonts, Fluid Infusion and its bundled libraries.
- `src/_data/checks.yaml`, the pages and fixture checks the theme's checks read.
- `CONTRIBUTING.md`, `ROADMAP.md`, the documentation index and the session record for phases 1 and 2.
- A guide for editors, `en/docs/guides/content/content-on-chrissteel-com-v0.1.0.md`, with the site's own conventions: its languages, names, menu, placeholder text, site text, search and checks, and how to add an article. It builds on the theme's guide, and the README links to both.
- A placeholder headline and description in each locale, `headline.md` and `description.md` in its site text, for the header's brand block, and the session record for the header placement.

### Changed

- The copy of Katagami moved to 0.6.0, made here first and carried back to its repository later. The site passes no `overrides`, since it has none.
- `package.json`'s scripts run from `themes/katagami/scripts/`, and stylelint extends the theme's configuration from its `stylelint` key.
- Site text moved to `src/{code}/site-text/`, and each locale's data file is now `{code}.11tydata.json`.
- The documentation moved from `en-ca/docs/` to `en/docs/`, for a global audience. Only `en/docs/dev/kickoffs/` is left out, in each clone's `.git/info/exclude`.
- The header follows Katagami's header placement: the brand block, Language and Settings, with search left off (`search: false`) until searching is built.
- The site is named Chris Steel, in the header and the browser tab; text about the person, such as the About page and the footer's copyright, keeps Christopher Steel. The home page's title is a placeholder headline about what the site is for, in each locale.
- The header's seal is a second link home, and every header control is a larger target, from the theme's header placement 0.1.3.

### Removed

- `site/`, including the workaround for French interface strings, now fixed in the theme.
- The root `scripts/`, `.nvmrc`, `.stylelintrc.json`, `.stylelintignore` and `THEME_VERSION`. The founding decision records the theme's release and commit.
