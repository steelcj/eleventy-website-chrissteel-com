# CLAUDE.md

Standing rules for Claude Code sessions in `eleventy-website-chrissteel-com`.

## Purpose

This repository holds chrissteel.com, Christopher Steel's personal website: a writer's site in the spirit of jamesclear.com, plain and text-first, built on the Katagami theme. The content is in Canadian English (`en-ca`), Canadian French (`fr-ca`) and an Arabic right-to-left fixture (`ar`). All content is placeholder text for now. SAT will later generate `src/` from a SAT collection, and this hand-built site is the target its output must match.

## Where changes go

- `themes/katagami/` is never edited here. It is a copy of the theme at the release and commit recorded in the decision records under `en/docs/decisions/`, replaced whole when the theme is updated.
- Until Katagami 0.6.0 is carried back and tagged, that rule is suspended: theme changes are made here first, as Katagami 0.6.0, and carried back to github.com/steelcj/eleventy-theme-katagami later. The condition is that every theme change is committed separately from site changes and touches only `themes/katagami/`, so that `git format-patch -- themes/katagami` can export it.
- Changes go in `src/` and `src/_data/`. The site has no overrides for now, so `eleventy.config.js` passes none. When it needs one, it goes in `themes/chrissteel/`, passed as the theme's `overrides` option: a file there shadows the theme file of the same path, and an `index.js` there holds site-only build code and never sets directories.
- `npm run vendor-fonts` and `npm run vendor-infusion` write into `themes/katagami/`, so they are not run here. They stay for parity with the theme.

## Content rules

- Content is Markdown only. No raw HTML, class names or inline styles in `src/`.
- No H1 in page bodies: the theme prints the title as the page's H1, so headings in a body start at `##`.
- Every page has a translation in each language folder, and the folders match. Folder names stay English in every language. A page name may differ by language, in ASCII kebab-case, when it sets `translationKey` to the path of the `en-ca` page without the language prefix, such as `/articles/plain-text-lasts/`. `npm run check` fails on a page without its translations.
- `date` values and images match across translations. Every image has `alt` text unless it is marked `decorative: true`.
- The main menu is curated in `src/_data/navigation/{code}.yaml`: five items, no call-to-action button. A page's `menuTitle` sets its short title in breadcrumbs and section navigation, not in the main menu.
- Site text is in `src/{code}/site-text/`: `headline.md` and `description.md`, placed into the header's brand block, and `footer.md` and `colophon.md`, placed into the footer. None is published as a page.
- French is Canadian French. Type plain spaces and straight quotes; the theme sets the spacing and quotation marks.
- The `ar` locale is fixture text only, until an Arabic reader has reviewed it. It builds everywhere and stays out of the production Language list and language chooser.
- Search stays off (`search: false` in `src/_data/site.yaml`) until searching itself is built.
- Until real content is written, each page's first paragraph is marked as placeholder text. The French spacing expectations in `src/_data/checks.yaml` read the placeholder articles, so re-point them when those articles are replaced.
- The pages the checks test are listed in `src/_data/checks.yaml`. Add at least one page for every new folder, in each locale.
- `en/docs/dev/kickoffs/` and the screenshots in `.cache/` stay untracked until uc-automa decides where they live. `en/docs/dev/kickoffs/` is left out with `.git/info/exclude`, so each clone adds it there.

## Definition of done

A change is done when:

- `npm run build` completes with no errors or warnings.
- `npm run lint` passes.
- `npm run check` and `npm run check:browser` pass.
- `uc-automa check` reports that the repository conforms.
- For any change to layouts, parts or CSS, screenshots at phone (390px) and desktop (1280px) widths, in `en-ca` and `ar`, are saved to `.cache/review/` and reviewed. The browser check confirms rhythm, fonts, contrast and accessibility, but not whether a layout looks right. Say where the screenshots are, so they can be reviewed too.

<!-- uc-portage:begin uc-automa-signpost -->
## uc-automa

This repository follows uc-automa at the version pinned in `.uc-automa.yaml`.

- The rules are uc-automa's directives, under `en-ca/docs/directives/` at that version. Each names the check that enforces it, if it has one.
- Run `uc-automa check` before committing, and `uc-automa offerings plan` to see whether shared files have drifted.
- Files the layout marks `from_offering` arrive from uc-automa; change them there, not here.
- If a rule is not written in a directive, ask. Never copy a convention from another repository.
<!-- uc-portage:end uc-automa-signpost -->
