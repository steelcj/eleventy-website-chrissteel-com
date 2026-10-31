---
title: "Decision: Build the Website chrissteel.com"
dc:title: "Decision: Build the Website chrissteel.com"
dc:creator: "Christopher Steel"
dc:contributor: "Claude Opus 5.5 (Anthropic), AI assistance"
dc:subject: "founding decision, website, chrissteel.com, Eleventy, Katagami, languages, content structure, licensing"
dc:description: "This repository builds chrissteel.com, Christopher Steel's personal writer's site, with Eleventy and a copy of the Katagami theme, in en-CA and fr-CA with an Arabic right-to-left fixture, a five-item menu, and MIT for code, CC BY 4.0 for documentation and content, and each font and vendored library under its own licence."
dc:date: "2026-10-31"
dc:type: "Text"
dc:format: "text/markdown"
dc:identifier: "urn:uuid:697989b7-922a-4c70-9b3e-2d45c5d00a17"
dc:language: "en-CA"
dc:rights: "CC-BY-4.0"
sat:version: "0.1.0"
sat:status: "Accepted"
---

# Decision: Build the Website chrissteel.com

Version: 0.1.0
Status: Accepted

## Context

Christopher Steel needs a personal website: a writer's site in the spirit of jamesclear.com, plain and text-first. This repository, eleventy-website-chrissteel-com, holds it. It started empty and replaces steelcj/chrissteel.com, a Hugo profile site from May 2026. Nothing carries over from that repository, which stays as a record.

A first build was made before this record existed, with placeholder content on Katagami 0.5.1, so that the theme, the menu, the languages and the checks could be reviewed before real content is written. That history was then removed, so that the repository starts from this record as Process: Creating a New Repository with uc-automa requires <a id="cite-steel-2026a"></a>[(Steel, 2026a)](#ref-steel-2026a). Building the site also found defects in the theme, and showed that Katagami 0.5.1 keeps site overrides, scripts and tool configuration at the root of its repository, where the `eleventy-site` layout does not describe them <a id="cite-steel-2026b"></a>[(Steel, 2026b)](#ref-steel-2026b).

## Decision

**Purpose.** The site is Christopher Steel's personal writer's site, in the spirit of jamesclear.com: plain, text-first and built for reading.

**Stack.** The site is built with Eleventy, on the Katagami theme, and the repository follows the `eleventy-site` layout. The theme is copied into `themes/katagami/`, never forked and never added as a remote <a id="cite-steel-2026c"></a>[(Steel, 2026c)](#ref-steel-2026c). The copy is Katagami release 0.5.1 from github.com/steelcj/eleventy-theme-katagami, at commit 39d93326a4c46830af8f42c4ff5d7b6f9106c8a2. That commit is three commits after the `v0.5.1` tag: `theme.yaml` still reads 0.5.1, and the only change to `themes/katagami/` removes the passthrough copy of a site's `admin/` folder and its line in the theme's README.

During phase 2, theme changes are made here first and carried back to the theme's repository later, as Katagami 0.6.0. Every such change is committed separately from site changes and touches only `themes/katagami/`, so that `git format-patch -- themes/katagami` can export it. Once they are carried back, `themes/katagami/` is again never edited here, and the theme is updated by replacing the folder with a newer release and recording that in a new decision record.

**Languages.** The site is in Canadian English and Canadian French, with the locale codes `en-ca` and `fr-ca` and the language tags `en-CA` and `fr-CA`. The locale `ar` is kept as a right-to-left fixture, so that right-to-left pages keep working. Its text is fixture text only until an Arabic reader has reviewed it; it builds everywhere and stays out of the production language switcher and language chooser. Every page has a translation in each locale. Folder names stay English in every locale until the theme supports localized folder names; page names may differ, paired with `translationKey`.

**Content structure.** The main menu has five items, in this order, and no call-to-action button:

| Item | en-ca | fr-ca | ar | Folder |
| --- | --- | --- | --- | --- |
| 1 | Home | Accueil | الرئيسية | the locale's home page |
| 2 | Articles | Articles | مقالات | `articles/`, dated articles in the summary view, newest first |
| 3 | Projects | Projets | مشاريع | `projects/`, project pages in the listing view |
| 4 | Collaboration | Collaboration | تعاون | `collaboration/`, one page |
| 5 | About | À propos | نبذة | `about/`, one page |

**Licensing.** This carries out uc-automa's licensing decision <a id="cite-steel-2026d"></a>[(Steel, 2026d)](#ref-steel-2026d), and `REUSE.toml` records it path by path.

- Code is under the MIT License: configuration, scripts, templates, styles and data files.
- Documentation and content are under Creative Commons Attribution 4.0 International: everything under `en-ca/`, the root documentation, and the Markdown pages under `src/`.
- Katagami, in `themes/katagami/`, stays under the MIT License with its own copyright holder, Vishpala.
- The three stencil-pattern images in `src/media/` are content, under Creative Commons Attribution 4.0 International, copyright Vishpala.
- Each font and vendored library keeps its own licence. The five font families are under the SIL Open Font License 1.1. Fluid Infusion is available under the BSD 3-Clause License or the Educational Community License 2.0, and the code bundled with it keeps its own licences: jQuery, jQuery UI and a promise implementation by John Hann under the MIT License, and fastXmlPull under the zlib License. Each licence text is in `LICENSES/`, and each copyright line comes from the item's own licence file.
- The repository holds no logos or wordmarks, so nothing is excluded from these licences.

## Alternatives considered

**Forking Katagami, or adding it as a remote.** Rejected. The theme's demo site and fixtures would conflict with this site on every merge.

**Making the theme changes in the theme's repository first.** Not done for this phase. This site is where the defects were found and is the first test of their fixes, so the changes are made here and carried back, under the separate-commit condition above.

**Leaving out `ar`.** Rejected. Without a right-to-left locale, nothing in this repository would show that right-to-left pages still work.

## Consequences

- The repository conforms to uc-automa, with the root closed to anything the `eleventy-site` layout does not describe. Files at the root that the layout does not describe, such as `site/`, `scripts/` and the tool configuration, have to move or go.
- For phase 2 only, the rule never to edit `themes/katagami/` is suspended, and `themes/katagami/` differs from any release of the theme until the changes are carried back.
- Rewriting the first history means replacing `62d8d8d` on `origin/main` with a force-push, once that is authorized.
- steelcj/chrissteel.com stays as a record of the Hugo profile site. Nothing from it carries over, so this site's content is written new.
- All content is placeholder text until real content is written. Arabic text waits for an Arabic reader's review.
- This record names the theme's release and commit, so `THEME_VERSION` is no longer needed.

## References

<a id="ref-steel-2026a"></a>Steel, C. (2026a). *Process: Creating a new repository with uc-automa* (Version 0.1.0) [Draft]. uc-processes. https://github.com/steelcj/uc-processes/blob/main/en-ca/docs/processes/creating-a-new-repository-with-uc-automa-v0.1.0.md
[Return to citation](#cite-steel-2026a)

<a id="ref-steel-2026b"></a>Steel, C. (2026b). *Decision: An eleventy-site layout* (Version 0.1.0). uc-automa. https://github.com/steelcj/uc-automa/blob/main/en-ca/docs/decisions/0037--eleventy-site-layout-v0.1.0.md
[Return to citation](#cite-steel-2026b)

<a id="ref-steel-2026c"></a>Steel, C. (2026c). *Process: Creating an Eleventy theme* (Version 0.1.0) [Draft]. uc-processes. https://github.com/steelcj/uc-processes/blob/main/en-ca/docs/processes/creating-an-eleventy-theme-v0.1.0.md
[Return to citation](#cite-steel-2026c)

<a id="ref-steel-2026d"></a>Steel, C. (2026d). *Decision: MIT for code, CC BY 4.0 for documentation* (Version 0.1.0). uc-automa. https://github.com/steelcj/uc-automa/blob/main/en-ca/docs/decisions/0025--mit-for-code-cc-by-for-documentation-v0.1.0.md
[Return to citation](#cite-steel-2026d)

## Changelog

| Version | Date | Status | Notes |
| --- | --- | --- | --- |
| 0.1.0 | 2026-10-31 | Accepted | Initial version |

## License

This document, *Decision: Build the Website chrissteel.com*, by **Christopher Steel**, with AI assistance from **Claude Opus 5.5 (Anthropic)**, is licensed under the [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/).
