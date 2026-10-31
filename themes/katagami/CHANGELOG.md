# Changelog

## [Unreleased]

## [0.6.0] - 2026-10-31

The theme is now self-contained: everything a site needs lives in this folder, so a site built on it holds only what uc-automa's `eleventy-site` layout describes. This release breaks every site built on 0.5; see Upgrading from 0.5.

### Added

- The `overrides` plugin option, a path relative to the repository root. The Nunjucks loader, the layout stubs, the watch targets and the optional `index.js` follow it. Without it, the theme uses no overrides folder.
- `strings.js`: interface strings are found by a locale's code, then its tag, then its primary language subtag, and a locale with none warns in development.
- The checks' data file, `checks.yaml` in the site's data directory: `pages`, and the optional `untranslated` and `fixtureChecks`. `scripts/site.mjs` reads it, and `scripts/demo-checks.yaml` is the demo site's copy, with every fixture check.
- Checks on every site: every page has a translation in each other locale and the reverse, no two pages in a locale share a `translationKey`, the language switcher's links match the translations, every page has a footer and a colophon, and every page listed in `checks.yaml` was built.

### Changed

- The theme's tools moved to `scripts/` in this folder: vendoring, fixture images and both checks. The vendoring scripts find the theme from their own location, not the working directory.
- The checks name no page. They read the pages to test from `checks.yaml`, and the site's directories and locales from the site, and choose the locales they exercise by what each is for: the default, another left-to-right one and a right-to-left one. Expected interface text comes from the theme's own strings.
- Site text moved from `src/{lang}/_site/` to `src/{lang}/site-text/`. Eleventy no longer sees these files, so they need no data file, and raw HTML in them is still reported.
- Fonts moved from `assets/fonts/` to `assets/vendor/fonts/`, and the theme's messages for the preferences panel from `i18n/preferences/` to `i18n/vendor/infusion-messages/`, so that vendored names sit under `vendor/`. Their published URLs for messages are unchanged; fonts are now at `/assets/vendor/fonts/`.
- Font files are named `<subset>-<weight>-normal.woff2`, in a folder that already names the font, and Atkinson Hyperlegible Next's folder is `hyperlegible-next/`, set with `folder` in `theme.yaml`. Every path in the theme is under 100 characters.
- The stylelint configuration moved to `stylelint.json` in this folder, with the vendored files in its `ignoreFiles`.
- `LICENSE.md` is now `LICENSE`.

### Fixed

- A locale with a full language code, such as `fr-ca`, fell back to English interface strings, so French pages said "Skip to content".
- The hreflang check skipped locale codes with anything but lowercase letters, so links to `en-ca` and `fr-ca` were never checked. It now accepts any BCP 47 tag.
- The page title repeated the site name when a page's title equals it, as on a home page titled with the site's name. The title now appears alone.
- A locale listed without a folder is reported by the checks, rather than crashing them.
- The belowcontent region sat outside any landmark, which axe reports as `region`. It is now a labelled `<section>`, with the new interface string `additionalContent`.

### Advice for sites

- Anchor the build output in `.gitignore` as `/_site/`. Written as `_site/`, it also ignored `src/{lang}/_site/`, so no site's footer or colophon was ever committed. The move to `site-text/` removes the clash, and the anchored form is still the right one.

### Upgrading from 0.5

1. Replace `themes/katagami/` with this release.
2. Move `site/` to `themes/<site>/` and pass it as `overrides: "themes/<site>"`. A site with no overrides passes nothing. Remove the `addWatchTarget` lines for `site/` and the theme from `eleventy.config.js`; the theme adds them.
3. Point `package.json`'s scripts at `themes/katagami/scripts/`, remove the root `scripts/`, add the `stylelint` key that extends `./themes/katagami/stylelint.json`, take `site/**/*.css` out of the `lint` script, and remove `.stylelintrc.json`, `.stylelintignore` and `.nvmrc`.
4. Add `checks.yaml` to the site's data directory, and add `.cache/` to `.gitignore` if it is not there.
5. Rename `src/{lang}/_site/` to `src/{lang}/site-text/` and delete `_site.11tydata.yaml` from each.
6. Update any reference to `/assets/fonts/` or to font file names, such as a `preload` in an override.
7. Drop any workaround for the defects fixed here, such as a `t` filter wrapped in the overrides folder's `index.js`.
8. Rebuild and run `npm run check` and `npm run check:browser`.

## [0.5.1] - 2026-10-29

### Fixed

- Contrast choices' radio inputs sit under their own choices on right-to-left pages, with logical properties in place of Infusion's physical offsets and margins.

## [0.5.0] - 2026-10-29

### Added

- Reader preferences with Fluid Infusion UI Options, vendored and loaded on demand: text size, line spacing, fonts and contrast, mapped onto the theme's tokens, kept in local storage, applied before the page is drawn, with a fixed "Display preferences" button and a translated message if Infusion cannot load.
- High-contrast and dark schemes, chosen by the reader or by their system settings.
- A minimum Content Security Policy in `assets/csp.json`, with hashes for the head script and Infusion's one style.

### Changed

- The baseline is rounded to a whole pixel; the font select from 0.4.0 is replaced by the panel.

## [0.4.0] - 2026-10-28

### Added

- Plain-text titles with smart punctuation, through the `typeset` filter, in headings, the page title, meta descriptions and navigation.
- Image ratio classes and `assets/css/image-ratios.css`, generated at build time, so images in the text flow keep the baseline grid.
- The type system: modular scale, baseline rhythm, wrapping, tabular figures, and small caps only where fonts have them.
- `typography.js`: quotation marks by language and French spacing by locale tag, for Markdown and, through the `typeset` filter, for titles and other plain-text fields. Locales may set a `tag`, exposed as `langTag`.
- Font sets Hyperlegible, Mincho and Gothic, generated from `theme.yaml` with their Arabic companions, self-hosted WOFF2 subsets and OFL licences, one preloaded font per page, and a reader's choice through the `ui-options` part and `font-preference.js`.
- Stubs for site-only layouts in `site/layouts/`, and `site/index.js` added as a plugin after the theme when present.
- Base table styles and Markdown table alignment as `data-align`, styled with logical CSS.

### Changed

- `block-list`, `picture` and `lead-image` moved to `partials/`; `parts/` holds only region items.
- Section navigation does not render when every page in the section is hidden.

## [0.3.0] - 2026-10-28

### Added

- Blocks: text, image, teaser, listing, grid and call to action.
- Views: listing, summary, tabular and album.
- Build-time image processing with a cache, lead images, and required alt text.

### Changed

- Section navigation leaves the current folder closed.
- Empty regions are not rendered.

## [0.2.0] - 2026-10-28

### Added

- Navigation tree from folders, with `menuTitle`, `order` and `excludeFromNav`.
- Breadcrumbs, the `section-nav` part and a `sidebar` region.
- `regionOverrides` for folders and pages.
- Translation links in the language switcher, and a language chooser at the site root.

## [0.1.0] - 2026-10-28

### Added

- Plugin with site-first template loader, virtual layout stubs, Markdown setup, raw HTML linter and asset passthrough.
- Base, page and section layouts with data-driven regions.
- Parts: skip links, logo, main navigation, language switcher, breadcrumbs (placeholder), footer text, site actions and colophon.
- Default regions, interface strings in `en`, `fr` and `ar`, and CSS with logical properties only.
