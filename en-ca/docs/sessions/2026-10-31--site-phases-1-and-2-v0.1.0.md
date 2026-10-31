---
title: "Session: Site Phases 1 and 2"
dc:title: "Session: Site Phases 1 and 2"
dc:creator: "Christopher Steel"
dc:contributor: "Claude Opus 5.5 (Anthropic), AI assistance"
dc:subject: "session, chrissteel.com, Katagami 0.6.0, uc-automa, eleventy-site, theme carry-back"
dc:description: "The session that built chrissteel.com on a copy of Katagami, set the repository up with uc-automa, made the theme self-contained as Katagami 0.6.0, and moved the site onto it, listing the theme commits to carry back to the theme's repository."
dc:date: "2026-10-31"
dc:type: "Text"
dc:format: "text/markdown"
dc:identifier: "urn:uuid:3890fa41-0b7c-4a71-8437-f5f4ae3ee7ed"
dc:language: "en-CA"
dc:rights: "CC-BY-4.0"
sat:version: "0.1.0"
sat:status: "Accepted"
---

# Session: Site Phases 1 and 2

Version: 0.1.0
Status: Accepted

## Summary

Phase 1 built the site from a copy of Katagami at commit 39d93326a4c46830af8f42c4ff5d7b6f9106c8a2 (release 0.5.1), with placeholder content in en-ca, fr-ca and the ar fixture, and adapted the theme's checks to it. It was committed and pushed as `62d8d8d`.

Phase 2 rewrote that history locally, keeping `62d8d8d` under `refs/backup/phase-1-62d8d8d`, so that the repository starts from its sidecar and founding decision. It then set the repository up with uc-automa 0.2.0, made `themes/katagami/` self-contained as Katagami 0.6.0, and moved the site onto it.

## Inputs

- Process: Creating a New Repository with uc-automa, version 0.1.0, urn:uuid:b92a8070-7b6a-4bb6-8f23-28d6c6dda3d5.
- Process: Licensing a Repository with REUSE, version 0.1.0, urn:uuid:31436ab2-84b7-49a8-911d-beb8d205d886.
- Process: Creating an Eleventy Theme, version 0.1.0, urn:uuid:1138506f-56ae-4485-80db-f6b55b92b3dd.
- The kickoffs for phases 1 and 2, kept untracked in `en/docs/dev/kickoffs/`.

## Decisions

The founding decision is [0001](../decisions/0001--build-website-chrissteel-com-v0.1.0.md). The rule for names under `vendor/` is uc-automa 0040, drafted on the branch `vendor-names` in uc-automa at `a0dcef0`, not released.

Decisions made during phase 2:

- The checks' data file is `checks.yaml` in the site's data directory, with `pages`, and the optional `untranslated` and `fixtureChecks`. The name `katagami` would collide with the theme's global.
- Infusion's loader requires the names of the theme's preference messages, so they moved to `i18n/vendor/infusion-messages/`, apart from the folder `npm run vendor-infusion` replaces, and outside `assets/`, so that nothing has to be filtered out of the published copy.
- Five message files derive from Infusion's and are annotated under its terms: `contrast`, `contrast_fr`, `contrast_ar`, `textSize_ar` and `lineSpace_ar`. The `fontSet` and `prefsEditor` files reuse only key names.
- The folder `hyperlegible-next/` was not enough to bring every font path under 100 characters, so font files dropped the family name that their folder already gives.
- Site text moved to `site-text/` and is ignored by Eleventy, so it needs no data file. Raw HTML in it is still reported, and edits to it still rebuild in watch mode.
- The site passes no `overrides` until it has one, so `themes/chrissteel/` does not exist.
- The theme's belowcontent region is now a labelled `<section>`, which is a landmark whatever the region holds, with the interface string `additionalContent` in English, French and Arabic. The demo's tables page is back in the full audit.

## What was made

This repository, on `main`, not pushed: `41bdddc` the sidecar and founding decision, `ed76e09` Katagami 0.5.1 unchanged, `3f4fff2` the site on 0.5.1 with uc-automa's offerings, `87366b4` Katagami 0.6.0, and the commit holding this record, which moves the site onto it.

Theme commits to carry back to github.com/steelcj/eleventy-theme-katagami:

- Base: `ed76e09`, identical to the theme's `39d9332`.
- `87366b4`, Katagami 0.6.0. It touches only `themes/katagami/`.
- Export with `git format-patch ed76e09..HEAD -- themes/katagami`.

The theme's repository also needs what lives outside the folder, which cannot travel in these commits:

- `themes/katagami/scripts/demo-checks.yaml` becomes its `src/_data/checks.yaml`.
- `site/` moves to `themes/demo/`, passed as `overrides`.
- `package.json`'s version, scripts and `stylelint` key, `.gitignore`'s `/_site/`, its root documentation, and removing `.nvmrc`, `.stylelintrc.json`, `.stylelintignore` and the root `scripts/`.
- `src/{lang}/_site/` becomes `src/{lang}/site-text/`, with its footers and colophons committed for the first time.

## Left open

- uc-automa 0040 and its change wait for review and a release; until then `uc-automa check` at 0.2.0 reports the names under `vendor/`.
- The theme's abovecontent region is still a plain `<div>`. Breadcrumbs carry their own landmark, but another part placed there would sit outside one.
- The process Creating an Eleventy Theme shows an `eleventy.config.js` without `setIncludesDirectory` and `setLayoutsDirectory`, which the theme still needs, and names the theme's licence file `LICENSE.md`.
- A new decision record for the move to Katagami 0.6.0, once it is tagged.
- The force-push replacing `62d8d8d` waits for authorization.

## Changelog

| Version | Date | Status | Notes |
| --- | --- | --- | --- |
| 0.1.0 | 2026-10-31 | Accepted | Initial version |

## License

This document, *Session: Site Phases 1 and 2*, by **Christopher Steel**, with AI assistance from **Claude Opus 5.5 (Anthropic)**, is licensed under the [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/).
