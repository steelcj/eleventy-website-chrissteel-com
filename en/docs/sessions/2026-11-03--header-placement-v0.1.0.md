---
title: "Session: Header Placement"
dc:title: "Session: Header Placement"
dc:creator: "Christopher Steel"
dc:contributor: "Claude Opus 5.5 (Anthropic), AI assistance"
dc:subject: "session, chrissteel.com, Katagami 0.6.0, header, brand block, search, language, settings, right-to-left, theme carry-back"
dc:description: "The session that rebuilt Katagami's header to follow its header placement specification, put chrissteel.com on it, and repaired the commit that moved the documentation to en/docs/, listing the theme commits to carry back."
dc:date: "2026-11-03"
dc:type: "Text"
dc:format: "text/markdown"
dc:identifier: "urn:uuid:77b640e7-c618-41a8-a11a-9448e0b14df6"
dc:language: "en-CA"
dc:rights: "CC-BY-4.0"
sat:version: "0.1.0"
sat:status: "Accepted"
---

# Session: Header Placement

Version: 0.1.0
Status: Accepted

## Summary

Katagami's header was rebuilt in `themes/katagami/` to follow the specification Header Placement: a brand block, a Search button and bar, a Language button and dropdown, Settings in place of Display preferences, and a layout that keeps every position on narrow screens and mirrors in right-to-left pages. It stays Katagami 0.6.0, not yet tagged. chrissteel.com moved onto it with a placeholder headline and description, and search left off. The checks cover the new header on the site and on the theme's demo, in development and production builds.

Before that, the session repaired what the commit `d6a345b`, which moved the documentation from `en-ca/docs/` to `en/docs/`, had left behind. The specification, version 0.1.0, landed in that commit, together with site changes, rather than in a commit of its own touching only `themes/katagami/`. `d6a345b` is pushed and was left as it is.

## Inputs

- Specification: Header Placement, version 0.1.1, urn:uuid:d47fba74-6d2d-4243-8644-baa7612549e7, in `themes/katagami/en/docs/parts/`. Version 0.1.1, written during the session, puts the announcement bar inside the header landmark, first after the skip link, where version 0.1.0 put it above the header.
- The kickoff for the header placement, kept untracked in `en/docs/dev/kickoffs/`.
- [Session: Site Phases 1 and 2](2026-10-31--site-phases-1-and-2-v0.1.0.md), for the rules that theme changes are made here first and committed apart from site changes.

## Decisions

Decided with Christopher Steel during the session:

- The repairs to `d6a345b` go in one site commit: `CLAUDE.md` gets back the rules that allow theme changes here, in commits touching only `themes/katagami/`; links to `en-ca/docs/` point to `en/docs/`; the roadmap's heading is fixed; and `@11ty/eleventy` returns to `^3.1.7`, with the lockfile from before `d6a345b`, which pins 3.1.7. `.git/info/exclude` now leaves out only `en/docs/dev/kickoffs/`, so the records are tracked. `REUSE.toml` licenses `en/**` and the theme's `en/docs/**` under CC BY 4.0.
- This session gets its own record.
- No announcement part is built. The layout keeps a first row for one, inside the header landmark, after the skip link.
- The theme's demo is checked from a scratch copy, outside both repositories, built from the theme's repository with this `themes/katagami/` and the carry-back steps applied. The theme's repository was not written to.
- Without JavaScript, the languages show as plain links, and the Language, Search and Settings buttons stay hidden.
- The `logo`, `language-switcher` and `ui-options` parts are removed, not aliased, and the change is part of 0.6.0, under Upgrading from 0.5.

Decided in the work, which the kickoff did not cover:

- The brand block is one part, so the headline and description come before Search in the code, although Search shows on the site name's row. The focus order is the specification's, since the headline and description are not focusable.
- The Settings bar and the Language list follow their buttons in the code, as a disclosure's content does, so that the next Tab after opening one goes into it. The Settings bar shows below the main menu; with it closed, the code follows the order on screen.
- The Language button's name is a visually hidden "Language:" followed by the visible language name, so screen readers hear "Language: English" and the visible word is in the name. French typography spaces it as "Langue : Français".
- The Language dropdown also closes on a click elsewhere or when focus leaves it, besides Escape. Its current language carries `aria-current` and a ✓ drawn in CSS, which screen readers do not read.
- Search uses a native `<dialog>` opened with `showModal()`, which keeps focus inside it and closes it on Escape; focus returns to the Search button on every close. The button has no `aria-haspopup`, so it is heard as "Search, button", as the specification has it. The field has a hidden label, "Search this site", and the placeholder "Search…". The results area is an empty live region.
- Search is enabled with `search: true` in `site.yaml`. chrissteel.com sets `search: false`; the demo sets it to true.
- The icons ⌕, ⊕, ⚙, ▾ and ✕ are drawn as SVG masks in the text colour, like the breadcrumb chevron, rather than typed as characters, which some systems draw as emoji or in fallback fonts.
- Each tool is at least 24px square, the minimum target in WCAG 2.2, as icon-only buttons on phones were smaller.
- Narrow screens are those under 48rem, the width where the page grid changes.
- The seal is a placeholder in the theme, a square with a diamond in the accent colour, eight baselines high. The theme does not yet read a seal from site text; the specification leaves its content open.
- The headline and description are Markdown site text, `headline.md` and `description.md`, like the footer and colophon, so each is optional.
- New interface strings: `settings`, `search`, `searchField` and `closeSearch`. `preferences` is gone, and the panel's own messages now say "Settings", "Paramètres" and "الإعدادات".
- The `publicLocales` filter gives the languages readers are offered, and the build records in `.cache/katagami/directories.json` whether it was for production, so the checks can tell.
- The specification's status stays Draft. Nothing in it turned out wrong, but its order of the header's code needs the two readings above.

## What was made

Three commits on `main`, made after review and not yet pushed:

1. `a6b5eb7`, site: the repairs to `d6a345b`.
2. `cfd6f49`, theme: the header placement, touching only `themes/katagami/`, with the specification's version 0.1.1.
3. Site: chrissteel.com on the new header, its site text, checks and documentation, and this record.

Theme commits to carry back to github.com/steelcj/eleventy-theme-katagami, after those the earlier session lists:

- `d6a345b`, which holds the specification's version 0.1.0; `git format-patch -- themes/katagami` exports only that file from it.
- `cfd6f49`, the header placement.
- Export both with the earlier ones: `git format-patch ed76e09..HEAD -- themes/katagami`.

The demo needs these changes outside the folder, which cannot travel in the theme commit:

- `src/_data/regions.yaml`: `header: [skip-links, brand, search, language, settings, main-nav]`.
- `src/_data/site.yaml`: `search: true`, to test the placement.
- `src/en/fixtures/nested/regions.md`: `logo` becomes `brand` in its `regionOverrides` and its text.
- A headline and description in each locale's `site-text/`.

Checks, on the site and on the scratch demo, each in a development and a production build: `npm run build` with no warnings, `npm run lint`, `npm run check` and `npm run check:browser` pass. A production copy of the demo with one public language shows no Language button and passes too. Screenshots of the header at 390px and 1280px, in en-ca and ar on the site and in en and ar on the demo, closed and with the Language dropdown, the Settings bar and, on the demo, the search bar open, are in `.cache/review/header/`.

## Left open

- uc-automa 0.2.0 does not yet allow documentation in `en/docs/`. `uc-automa check` reports that `en-ca/` and its index are missing, and that records in `en/` should have `dc:language: en`, which its own schema rejects. `en/docs/README.md` cannot be regenerated until then.
- uc-automa 0040, as in the earlier session.
- The specification's own open questions: the seal's content and text alternative, and where Settings opens on a page with an announcement.
- Whether the specification should say that the brand block comes whole before Search in the code, and that open bars follow their buttons.
- Search itself, its index and results.
- An Arabic reader's review of the Arabic strings and site text.

## Changelog

| Version | Date | Status | Notes |
| --- | --- | --- | --- |
| 0.1.0 | 2026-11-03 | Accepted | Initial version |

## License

This document, *Session: Header Placement*, by **Christopher Steel**, with AI assistance from **Claude Opus 5.5 (Anthropic)**, is licensed under the [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/).
