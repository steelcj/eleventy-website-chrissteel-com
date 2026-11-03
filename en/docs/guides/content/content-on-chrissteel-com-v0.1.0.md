---
title: "Content on chrissteel.com"
dc:title: "Content on chrissteel.com"
dc:creator: "Christopher Steel"
dc:contributor: "Claude Opus 5.5 (Anthropic), AI assistance"
dc:subject: "chrissteel.com, content, editing, languages, translations, menu, placeholders, site text, search, checks"
dc:description: "The conventions for writing and editing chrissteel.com that go beyond the Katagami theme's guide: its languages, names, menu, placeholder text, site text, search and checks, with a walk-through for adding an article."
dc:date: "2026-11-03"
dc:type: "Text"
dc:format: "text/markdown"
dc:identifier: "urn:uuid:51a99fc7-1509-4c94-8e16-2351491842ba"
dc:language: "en-CA"
dc:rights: "CC-BY-4.0"
sat:version: "0.1.0"
sat:status: "Accepted"
---

# Content on chrissteel.com

Version: 0.1.0
Status: Accepted

## Summary

This guide is for whoever writes or edits chrissteel.com. How pages, folders, blocks, images, translations and site text work is the theme's, and is in Katagami's guide, Creating and Editing Content on a Katagami Site (<a id="cite-katagami-guide"></a>[Steel, 2026](#ref-katagami-guide)); read that first. This guide adds only what is particular to this site.

## Languages

The site is written in three languages, each with its own folder in `src/`:

| Folder | Language | Published |
| --- | --- | --- |
| `en-ca/` | Canadian English | Yes |
| `fr-ca/` | Canadian French | Yes |
| `ar/` | Arabic, right to left | No: a fixture, built everywhere but left out of the Language list and the language chooser in production |

- Every page exists in all three folders, the Arabic one included, and the folders match. `npm run check` fails on a page without its translations.
- Folder names stay English in every language. A page's file name may differ by language, in ASCII kebab-case, when it sets `translationKey` to the English page's path without `/en-ca`, such as `/articles/plain-text-lasts/`.
- French is Canadian French. Type plain spaces and straight quotes; the theme sets the spacing and quotation marks, following Quebec's conventions.
- The Arabic text is fixture text, not written by a native speaker. It stays a fixture until an Arabic reader has reviewed it.

## Names

The site is called Chris Steel: `name: Chris Steel` in `src/_data/site.yaml`, shown in the header and every browser tab. The person is Christopher Steel, `author` in the same file. Where text is about the person rather than the site, as on the About page and in the footer's copyright line, write Christopher Steel.

## The main menu

The main menu has five items, Home, Articles, Projects, Collaboration and About, in `src/_data/navigation/en-ca.yaml`, `fr-ca.yaml` and `ar.yaml`, and no call-to-action button. A page's `menuTitle` sets its short title in breadcrumbs and section navigation, not in the main menu.

## Placeholder text

All content is placeholder text until the real content is written.

- Each page's first paragraph starts with **Placeholder text.**, in French **Texte provisoire.** and in Arabic **نص مؤقت.**, and site text starts with the same word, such as "Placeholder headline:". Remove the mark when a page's real text replaces it.
- The French articles hold examples of French spacing and quotation marks that the checks read, listed in `src/_data/checks.yaml` under `fixtureChecks`. When those articles are replaced, keep the examples or point the checks at text that has them.

## Site text

Each language's header and footer text is in `src/{code}/site-text/`: `headline.md` and `description.md` under the site name, and `footer.md` and `colophon.md` in the footer. All three languages have all four files.

## Search

Search is off: `search: false` in `src/_data/site.yaml`. Setting it to `true` shows the Search button at the end of the site name's row and its bar, but the bar finds nothing until searching itself is built, so it stays off on the published site. Turn it on locally to see where it sits, and back off before committing.

## Adding an article

1. Write the English article in `src/en-ca/articles/`, as `a-new-article.md`, with `title`, `description` and `date`, and an `image` with `alt` if it has one.
2. Write the French translation in `src/fr-ca/articles/`. If its file name is French, such as `un-nouvel-article.md`, add `translationKey: /articles/a-new-article/`. Use the same `date` and image.
3. Write the Arabic fixture in `src/ar/articles/`, with the English file name, or another name and the same `translationKey`.
4. If the article starts a new folder, add a page from that folder, in each language, to `pages` in `src/_data/checks.yaml`.
5. Preview it, then run the checks.

## Checking before committing

- Preview with `npm start`, at `http://localhost:8080`.
- A change is done when `npm run build` has no warnings, and `npm run lint`, `npm run check`, `npm run check:browser` and `uc-automa check` pass, as `CLAUDE.md` sets out.
- Stop `npm start`, or run `npm run build` again, before `npm run check:browser`: the development server serves images in a form only it can, and the browser checks report them as errors.

## Later

SAT is meant to generate `src/` from a SAT collection, with this hand-built site as the target its output must match. When it does, content will be edited in that collection rather than in `src/`, and this guide will change; Katagami's guide stays valid, since it describes what the theme accepts.

## References

<a id="ref-katagami-guide"></a>Steel, C. (2026). *Creating and editing content on a Katagami site* (Version 0.1.0). Katagami. [../../../../themes/katagami/en/docs/guides/content/creating-and-editing-content-v0.1.0.md](../../../../themes/katagami/en/docs/guides/content/creating-and-editing-content-v0.1.0.md)
[Return to citation](#cite-katagami-guide)

## Changelog

| Version | Date | Status | Notes |
| --- | --- | --- | --- |
| 0.1.0 | 2026-11-03 | Accepted | Initial version |

## License

This document, *Content on chrissteel.com*, by **Christopher Steel**, with AI assistance from **Claude Opus 5.5 (Anthropic)**, is licensed under the [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/).
