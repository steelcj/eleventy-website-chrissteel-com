# Changelog

All notable changes are recorded here, in the form of [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). This repository follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- chrissteel.com on the Katagami theme, with placeholder content in en-ca, fr-ca and the ar right-to-left fixture: home, articles, projects, collaboration and about, a five-item menu, and a footer and colophon per locale.
- The sidecar and the founding decision, uc-automa's offerings, and `REUSE.toml` annotations with the licence texts for the fonts, Fluid Infusion and its bundled libraries.
- `src/_data/checks.yaml`, the pages and fixture checks the theme's checks read.
- `CONTRIBUTING.md`, `ROADMAP.md`, the documentation index and the session record for phases 1 and 2.

### Changed

- The copy of Katagami moved to 0.6.0, made here first and carried back to its repository later. The site passes no `overrides`, since it has none.
- `package.json`'s scripts run from `themes/katagami/scripts/`, and stylelint extends the theme's configuration from its `stylelint` key.
- Site text moved to `src/{code}/site-text/`, and each locale's data file is now `{code}.11tydata.json`.

### Removed

- `site/`, including the workaround for French interface strings, now fixed in the theme.
- The root `scripts/`, `.nvmrc`, `.stylelintrc.json`, `.stylelintignore` and `THEME_VERSION`. The founding decision records the theme's release and commit.
