---
title: "Creating and Editing Content on a Katagami Site"
dc:title: "Creating and Editing Content on a Katagami Site"
dc:creator: "Christopher Steel"
dc:contributor: "Claude Opus 5.5 (Anthropic), AI assistance"
dc:subject: "Katagami, content, editing, Markdown, front matter, folders, blocks, views, translations, site text, images, regions, search"
dc:description: "How to write and edit the content of a site built on Katagami: pages and folders, front matter, blocks and views, images, translations, site text, regions, search, and checking the result."
dc:date: "2026-11-03"
dc:type: "Text"
dc:format: "text/markdown"
dc:identifier: "urn:uuid:d842bb4d-3ff9-4597-a5aa-04d87ef242cc"
dc:language: "en-CA"
dc:rights: "CC-BY-4.0"
sat:version: "0.1.0"
sat:status: "Accepted"
---

# Creating and Editing Content on a Katagami Site

Version: 0.1.0
Status: Accepted

## Summary

This guide is for anyone who writes or edits the content of a site built on Katagami. It shows how to add and change pages, folders, images and translations, how to fill the header and footer with the site's own words, and how to check the result before publishing. Everything here is done in plain text files under `src/`; nothing needs HTML, CSS or the theme's templates. Each site may add its own conventions, such as which languages it publishes or how its menu is curated, in a guide of its own.

The examples use `en` and `fr` as language codes. A site's codes are whatever its `src/_data/locales.yaml` lists, such as `en-ca` and `fr-ca`.

## Where content lives

```text
src/
├── _data/
│   ├── site.yaml          the site's name, author, default language, font set and search
│   ├── locales.yaml       the languages, their direction, and which are fixtures
│   ├── navigation/
│   │   └── en.yaml        the main menu, one file per language
│   ├── regions.yaml       optional: which parts appear in each region
│   └── checks.yaml        the pages the checks test
├── en/
│   ├── index.md           the language's home page
│   ├── articles/
│   │   ├── index.md       the folder's own page
│   │   └── a-first-article.md
│   └── site-text/         the header's and footer's words, never published as pages
├── fr/                    the same folders, translated
└── media/                 images and other files
```

A page publishes at its path: `src/en/articles/a-first-article.md` becomes `/en/articles/a-first-article/`. File and folder names are ASCII and kebab-case, lower case with hyphens, in every language.

## Writing a page

A page is a Markdown file with front matter, the fields between the two `---` lines, followed by its text.

```markdown
---
title: A first article
description: One sentence that says what the article is about.
date: 2026-11-03
---

The first paragraph.

## A section

More text, with a [link to another page](/en/about/).
```

- **Title.** The theme prints the title as the page's only H1, so headings in the text start at `##`.
- **Description.** One sentence, shown in listings and to search engines.
- **Plain text only.** Write Markdown. Raw HTML, class names and inline styles are shown as text, not rendered, and the build warns about them with the file and line. Template code in a page is never run.
- **Quotes and spaces.** Type straight quotes and plain spaces. The theme sets the quotation marks of the page's language and, in French, the spaces before `:` `;` `!` `?` and inside « ».
- **Titles stay plain.** Titles and descriptions get the same punctuation, but Markdown in them is shown as typed. A title with a colon in it goes in quotes: `title: "Notes: a beginning"`.

### Front matter fields

| Field | What it does |
| --- | --- |
| `title` | The page's title and H1. Required. |
| `description` | A one-sentence summary for listings and search engines. |
| `date` | The publication date, `YYYY-MM-DD`, shown in dated views and used for sorting by date. |
| `menuTitle` | A short title for breadcrumbs and section navigation. The main menu has its own labels. |
| `order` | The page's position among its folder's pages, when the folder sorts by order. |
| `excludeFromNav: true` | Leaves the page out of menus and section navigation; it still appears in its folder's listing. |
| `image` | The page's lead image, `src` and `alt`, also used by teasers, the summary view and the album view. |
| `blocks` | A list of blocks shown after the text. See Blocks. |
| `translationKey` | Pairs a page with its translations when its file name differs by language. See Translations. |
| `regionOverrides` | Changes what appears around the page. See Regions. |

## Folders

A folder is a directory with an `index.md`, which holds the folder's own title, description and introduction. Its pages are listed below the introduction in a view:

```markdown
---
title: Articles
description: Writing on publishing that lasts.
layout: section.njk
view: summary
sort: date
---

An introduction to the articles.
```

| `view` | Shows |
| --- | --- |
| `listing` | Titles and descriptions. The default. |
| `summary` | Titles, descriptions, dates and thumbnails. |
| `tabular` | A table of titles and descriptions, with dates when the pages have them. |
| `album` | Cards with images. |

`sort` is `order`, the default, `title`, `date`, newest first, or `date-asc`, soonest first, for upcoming events. A folder without an `index.md` makes its pages attach to the folder above, and the build warns about it.

## Blocks

Blocks build a page from parts, shown after its text, in the order listed. To put text between two blocks, use a text block rather than the page's text.

```yaml
blocks:
  - type: text
    heading: What I work on
    body: A short paragraph, in **Markdown**.
  - type: grid
    columns: 3
    blocks:
      - type: teaser
        link: /en/projects/a-project/
  - type: call-to-action
    heading: Working together
    body: How to start a project.
    label: Get in touch
    link: /en/collaboration/
```

| Type | Fields |
| --- | --- |
| `text` | `heading`, `body` in Markdown |
| `image` | `src`, `alt` or `decorative: true`, `caption` |
| `teaser` | `link`; `title`, `description` and `image` default to the linked page's own |
| `listing` | `folder`, the page's own by default, `view`, `sort`, `limit`, `heading` |
| `grid` | `blocks`, `columns` of 2, 3 or 4, `heading` |
| `call-to-action` | `heading`, `body` in Markdown, `label`, `link` |

An unknown block type shows a placeholder and a warning while editing, and stops a production build, so a broken page is never published.

## Images

Put images in `src/media/` and refer to them from the site root, as `/media/a-pattern.jpg`. The build makes every size and format a page needs, so add the original, as large as you have it.

- Every image needs `alt` text that says what it shows, for readers who cannot see it. An image that adds nothing to the text, such as a texture, is marked `decorative: true` instead. A missing alt text or image file warns while editing and stops a production build.
- A page's lead image is its `image` field. An image inside the text is ordinary Markdown, `![A seigaiha wave pattern](/media/seigaiha.jpg)`, or an image block with a caption.
- Translations of a page use the same images.

## Translations

Every language has the same folders, with English folder names in every language. A page in one language is the translation of the page at the same path in another, so `src/en/about/index.md` and `src/fr/about/index.md` pair without any setting.

A page whose file name differs by language says which page it translates with `translationKey`, the other page's path without the language prefix:

```yaml
# src/fr/articles/le-texte-brut-dure.md
translationKey: /articles/plain-text-lasts/
```

Translations share the same `date` and images. The Language button in the header links each language's version of the page, or that language's home page when there is none. `npm run check` reports a page that is missing a translation.

Moving or renaming the English page breaks the pairing until each `translationKey` that names it is updated.

## The main menu

The main menu is curated in `src/_data/navigation/{lang}.yaml`, one file per language, so it changes only when someone edits it:

```yaml
- label: Home
  url: /en/
- label: Articles
  url: /en/articles/
```

The item for the section a page is in is marked as current. Breadcrumbs and the section navigation in the sidebar follow the folders on their own.

## Site text: the header and the footer

Each language's words for the header and footer are short Markdown files in `src/{lang}/site-text/`. They are placed into the page, never published as pages, and each is optional.

| File | Where it appears |
| --- | --- |
| `headline.md` | The header, under the site name |
| `description.md` | The header, under the headline |
| `footer.md` | The footer; links listed as `actions` in its front matter become the site actions |
| `colophon.md` | The footer's last line, for credits and licence |

```markdown
---
actions:
  - label: Contact
    url: mailto:hello@example.org
---

A line of footer text.
```

The site's name comes from `name` in `src/_data/site.yaml`, and appears in the header and in every browser tab.

## Regions

Regions are the areas around a page's content: the header, above the content, the sidebar, below the content and the footer. Which parts fill them is set for the whole site, and a folder or a page can change that with `regionOverrides`, in front matter or in the folder's data file, such as `articles/articles.11tydata.yaml`:

```yaml
regionOverrides:
  sidebar: none
  belowcontent: [colophon]
```

| Value | Effect |
| --- | --- |
| A list of parts | Adds them to what the folder above provides |
| One part name | Replaces the region with that part |
| `none` | Empties the region |

A folder's setting applies to everything beneath it.

## Search

Search is off unless the site turns it on. Set it in `src/_data/site.yaml`:

```yaml
search: true
```

The header then shows a Search button at the end of the site name's row, which opens a search bar across the top of the screen, as the header placement specification sets out (<a id="cite-header-placement"></a>[Steel, 2026](#ref-header-placement)). The theme does not search yet: the bar opens and closes, and its results stay empty, until search is built. Turn it on to test the header's layout, not for readers.

## Checking your work

- `npm start` serves the site at `http://localhost:8080` and rebuilds it as you save.
- `npm run build` builds every language; any warning in its output is worth reading.
- `npm run check` checks the built pages: every page has its translations, every image has alt text and dimensions, no block is unknown, and the header's controls are where they belong. `npm run check:browser` checks the site in a real browser, including accessibility and the header; it takes a few minutes.
- Add at least one page from each new folder, in each language, to `src/_data/checks.yaml`, so the checks test it.

Stop `npm start` before running the checks, or build again first: the development server serves images in a form only it can, and the checks report them as errors.

## References

<a id="ref-header-placement"></a>Steel, C. (2026). *Specification: Header placement* (Version 0.1.3) [Draft]. Katagami. [../../parts/header-placement-v0.1.3.md](../../parts/header-placement-v0.1.3.md)
[Return to citation](#cite-header-placement)

## Changelog

| Version | Date | Status | Notes |
| --- | --- | --- | --- |
| 0.1.0 | 2026-11-03 | Accepted | Initial version |

## License

This document, *Creating and Editing Content on a Katagami Site*, by **Christopher Steel**, with AI assistance from **Claude Opus 5.5 (Anthropic)**, is licensed under the [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/).
