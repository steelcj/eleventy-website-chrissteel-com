---
title: "Session: Header Targets and Name"
dc:title: "Session: Header Targets and Name"
dc:creator: "Christopher Steel"
dc:contributor: "Claude Opus 5.5 (Anthropic), AI assistance"
dc:subject: "session, chrissteel.com, Katagami, header, seal, target size, WCAG 2.2, site name, theme carry-back"
dc:description: "The session that renamed the site Chris Steel, gave the home page a placeholder headline, made the header's seal a second link home, and gave every header control a target of at least 44 CSS pixels, listing the theme commit to carry back."
dc:date: "2026-11-03"
dc:type: "Text"
dc:format: "text/markdown"
dc:identifier: "urn:uuid:272c0334-4d24-4de1-be48-7874595c34bd"
dc:language: "en-CA"
dc:rights: "CC-BY-4.0"
sat:version: "0.1.0"
sat:status: "Accepted"
---

# Session: Header Targets and Name

Version: 0.1.0
Status: Accepted

## Summary

chrissteel.com is now named Chris Steel, and its home page's title is a placeholder headline about what the site is for. In the theme, the header's seal became a second link to the home page, out of the Tab order and hidden from screen readers, and every header control became a target at least 44 CSS pixels, with at least 8 between neighbours, as the specification Header Placement, version 0.1.3, sets out. The checks cover both on the site and on the theme's demo, at phone, tablet and desktop widths, and each new check was proven with a deliberate fault.

## Inputs

- Specification: Header Placement, version 0.1.3, urn:uuid:d47fba74-6d2d-4243-8644-baa7612549e7, in `themes/katagami/en/docs/parts/`.
- The kickoff for the header targets and name, kept untracked in `en/docs/dev/kickoffs/`.
- [Session: Header Placement](2026-11-03--header-placement-v0.1.0.md).

## Decisions

Decided with Christopher Steel at the start of the session:

- Katagami 0.6.0 is not tagged yet, so `themes/katagami/` could not be compared with a tagged copy. It differs from the theme repository's branch `katagami-0.6.0` in three known places: where the demo's checks file lives, one README line, and one changelog line with the 0.6.0 date. Work went ahead on the current copy; replacing the folder with the tagged release waits for the tag and decision 0002.
- The specification's version 0.1.3 arrived in `themes/katagami/parts/`, which holds templates, and moved to `themes/katagami/en/docs/parts/` beside versions 0.1.0 and 0.1.1. No file for version 0.1.2 exists; its changes are in 0.1.3, whose changelog lists it. The specification's wording was left as written.
- "The home page is reached once by Tab through the header" applies outside the main menu: the seal adds no Tab stop, so the site name is the only way there besides the main menu's Home item, which stays.
- The site name keeps its size; it is held to the 8-pixel spacing from its neighbours but is not one of the specification's 44-pixel targets.
- The footer's copyright, "© 2026 Christopher Steel", names the person and keeps the full name, as do the About and Collaboration pages and the headline in the site text, "what Christopher Steel writes about".

Decided in the work, which the kickoff did not cover:

- Target sizes come from two new tokens, `--target-size: max(2.75rem, 44px)` and `--target-spacing: max(0.5rem, 8px)`, so they grow when a reader chooses larger text in Settings and never fall below 44 and 8 pixels when a reader chooses smaller text.
- The seal is a link with the mark drawn inside it, in a new `.brand__mark`, so the whole square is a target whatever the mask leaves visible. It is at least 44 pixels square, or eight baselines when that is larger. The forced-colours rules moved from the seal to the mark.
- The main menu's and the Language list's items are flex boxes at least 44 pixels tall with their text centred; their underlines are unchanged. Rows of the main menu and the Language list are 8 pixels apart; items in a row keep the existing 16.
- The specification asks for the main menu's and the Language list's items to be 44 pixels tall, not wide, so short items stay narrower: "Home" is 43 pixels wide in English and "نبذة" 26 in Arabic.
- Reset, inside the Settings bar, is a tool, so it is 44 pixels square like the others. The theme also sets the space between the contrast choices, which grew from 4 to 8 pixels. Infusion sets the size of everything else in the bar, and the theme leaves it: the text size and line spacing steppers' buttons are 39 by 39 pixels and their fields 80 by 32, the font menu is 120 by 27, and the contrast choices are 40 by 40.
- The target checks measure the seal, the site name, every tool, the main menu's items and, when open, the Language list's items, with half a pixel allowed for rounding. Spacing is the distance between two targets' boxes, so two targets side by side or one above the other each count.
- The check that Tab reaches the home page once ignores links to the same page, such as the skip link to `#content`.
- The home page titles are placeholders in the form the site text uses, a label then the line: "Placeholder headline: notes on writing and publishing that last", "Titre provisoire : notes sur l'écriture et la publication qui durent" and "عنوان مؤقت: ملاحظات عن كتابة ونشر يدومان". They are quoted in the front matter, since they contain a colon.
- Content editing has two guides, written at Christopher Steel's request during the session: the theme's, for anything Katagami defines, which travels with the theme to every site, and the site's, for chrissteel.com's own conventions, which builds on it. Both describe turning search on with `search: true`, and that the bar finds nothing until search is built.
- The site's `npm start` was running during the session and rebuilds `_site` with development-server image URLs, which the browser check reports as errors. Builds and checks ran in a scratch copy of the repository instead.

## What was made

Commits on `main`, made after review and pushed:

1. `5e02dc8`, theme, touching only `themes/katagami/`: the seal link, the target sizes, the specification's version 0.1.3, the checks and the theme's changelog under Unreleased.
2. `dcb6b13`, theme, touching only `themes/katagami/`: the guide Creating and Editing Content on a Katagami Site, in `en/docs/guides/content/`, and a link to it from the theme's README.
3. Site: the name, the home headline, the guide Content on chrissteel.com in `en/docs/guides/content/`, the README's link to both guides, the changelog and this record.

Theme commits to carry back to github.com/steelcj/eleventy-theme-katagami: `5e02dc8` and `dcb6b13`, after those the header placement session lists. Their release number is chosen when they are carried back.

Checks, on the site and on a scratch copy of the demo, each in a development and a production build: `npm run build` with no warnings, `npm run lint`, `npm run check` and `npm run check:browser` pass. Each new check failed on a deliberate fault: tools at 40 pixels, Language items at 30 and the contrast choices 2 pixels apart; the seal in the Tab order, linking to another language and not hidden; and the header's rows and the main menu's items 2 pixels apart.

At 390 pixels the main menu fits on one row in English and Arabic; in French, "À propos" wraps to a second row, 8 pixels below the first.

Screenshots of the header at 390, 820 and 1280 pixels, in en-ca and ar on the site and in en and ar on the demo, closed and with the Language dropdown, the Settings bar and, on the demo, the search bar open, are in `.cache/review/header-targets/`.

## Left open

- The kickoff asked to remove a known issue about 44-pixel targets; no tracked file records one, so nothing was removed.
- The specification's Scope still lists spacing as out of scope, while its Target sizes section sets the spacing between targets.
- Infusion's controls in the Settings bar are smaller than 44 pixels; making them larger means overriding Infusion's own styles.
- Katagami 0.6.0's tag, and decision 0002 replacing `themes/katagami/` with the tagged copy. An annotated tag `v0.6.0`, "Katagami 0.6.0: a self-contained theme, and the header placement", sits in this repository on `c8def56` and on its remote, while the theme's repository has none; `uc-automa check` reports it, since this repository's version is 0.1.0.

## Changelog

| Version | Date | Status | Notes |
| --- | --- | --- | --- |
| 0.1.0 | 2026-11-03 | Accepted | Initial version |

## License

This document, *Session: Header Targets and Name*, by **Christopher Steel**, with AI assistance from **Claude Opus 5.5 (Anthropic)**, is licensed under the [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/).
