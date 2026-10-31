# Katagami theme

A Plone-inspired Eleventy theme with a vintage Japanese, minimalist style. See the repository README and `en/docs/dev/katagami-theme-goals.md` for the specification.

## Using the theme

A site adopts the theme by copying this folder, `themes/katagami/`, from a tagged release. Everything a site needs from the theme is in it, and a site connects to it through `eleventy.config.js` alone. That file sets the directories, since plugins cannot, then adds this plugin and re-exports its `config` object, which disables template syntax in Markdown. This is the complete file:

```js
import katagami from "./themes/katagami/index.js";

export { config } from "./themes/katagami/index.js";

export default function (eleventyConfig) {
  eleventyConfig.setInputDirectory("src");
  eleventyConfig.setIncludesDirectory("_includes"); // empty, inside src/
  eleventyConfig.setLayoutsDirectory("_layouts"); // virtual only, no folder on disk
  eleventyConfig.setDataDirectory("_data");
  eleventyConfig.setOutputDirectory("_site");
  eleventyConfig.addPlugin(katagami);
}
```

## Overriding the theme

A site customizes the theme by shadowing its files: a file at the same path in the site's overrides folder replaces the theme's file. Give the folder, relative to the repository root, as the `overrides` option:

```js
eleventyConfig.addPlugin(katagami, { overrides: "themes/<site>" });
```

Without the option the theme uses no overrides folder. The folder may hold `layouts/`, `parts/`, `blocks/` and `views/`, and an `index.js`, an Eleventy plugin for site-only build code, which the theme adds after registering everything else. The templates, the layout stubs, the watch targets and `index.js` all follow the option. A site keeps the folder beside the theme, under `themes/`.

## Scripts and checks

The theme's tools are in `scripts/`, and a site runs them from there:

```json
{
  "scripts": {
    "build": "eleventy",
    "lint": "stylelint --allow-empty-input \"themes/**/*.css\"",
    "check": "node themes/katagami/scripts/check-pages.mjs",
    "check:browser": "node themes/katagami/scripts/check-browser.mjs",
    "fixture-images": "node themes/katagami/scripts/make-fixture-images.mjs src/media",
    "vendor-fonts": "node themes/katagami/scripts/vendor-fonts.mjs",
    "vendor-infusion": "node themes/katagami/scripts/vendor-infusion.mjs"
  },
  "stylelint": { "extends": "./themes/katagami/stylelint.json" }
}
```

The checks test rules that hold on every site, and never name a page. Run them after a build, from the site's root folder: the build records the site's directories in `.cache/katagami/directories.json`, so a site needs `.cache/` in its `.gitignore`, and they read its locales from `locales.yaml` and the pages to test from `checks.yaml`, both in its data directory:

```yaml
# The URLs for the accessibility audits and the vertical rhythm check.
pages:
  - /en-ca/
  - /en-ca/articles/
  - /fr-ca/
  - /ar/
# Optional: pages allowed to have no translation, by translation key, or by a key's start
# when it ends in a slash.
untranslated:
  - /fixtures/
# Optional: expectations for particular pages. A site without such pages lists none.
fixtureChecks:
  - page: /fr-ca/
    contains: ["Aller au contenu"]
    lacks: ["Skip to content"]
  - page: /en-ca/about/
    region: belowcontent
    parts: [footer-text, colophon]
```

List at least one page per folder in each locale. `scripts/demo-checks.yaml` is the demo site's file, with every fixture check.

## What the plugin provides

- Templates resolved from the `overrides` folder first, when there is one, then this folder, with caching off.
- A virtual stub in `_layouts/` for each file in `layouts/` and in the overrides folder's `layouts/`, so pages use `layout: page.njk` or `layout: section.njk`.
- `parts/` holds only the items placed in regions; `partials/` holds pieces shared by layouts, blocks and views: the block list, the image markup and the lead image.
- `index.js` in the overrides folder, when present, added as a plugin after the theme.
- YAML data files, a computed `dir` for every page from its `lang` and `_data/locales.yaml`, and a `katagami` global with the manifest, default regions, interface strings and per-language site text from `{lang}/site-text/*.md`, which Eleventy never builds as pages.
- A computed `eleventyNavigation` entry for every page in a language folder, with the Eleventy Navigation plugin registered.
- Interface strings in `i18n/`, found by a locale's code, then its tag, then its primary language subtag, so `fr-ca` and `fr-CA` find `fr`. A locale with none uses English ones, with a warning in development.
- Filters: `t` for interface strings, `regionParts` for the parts in a region, `translationUrl` for a page's translation, `localeFor` for a locale's settings, `folderItems` for the pages in a folder, `markdown` for Markdown fields, `typeset` for plain-text fields such as titles, and `formatDate` for dates. Pages get `langTag`, their locale's full language tag, for the `lang` attribute, dates and typography.
- `typography.js`, a markdown-it plugin for quotation marks by language and French spacing by locale tag: Quebec's for `fr-CA`, France's for other French tags.
- A language chooser at `/`, unless the site has its own root `index` page.
- A linter that warns about raw HTML in Markdown, in pages and in site text.
- Block and view partials looked up by name, with a placeholder and warning for unknown names in development and a failed build in production.
- Build-time image processing for every `<img>`, configured in `theme.yaml` under `images`, with processed files cached in `.cache/katagami/img/`.
- Font sets from `theme.yaml`: the site's set (`fontSet` in `site.yaml`) loads as `assets/css/fonts/<set>.css` with one preloaded font file, and readers can choose another in the preferences panel. The fonts in `assets/vendor/fonts/` and the set CSS are generated by `npm run vendor-fonts`; do not edit them by hand.
- Reader preferences: the `ui-options` part, `assets/js/preferences.js` and `assets/js/preferences-uio.js` set up Fluid Infusion UI Options, vendored in `assets/vendor/infusion/` by `npm run vendor-infusion`, with a local storage store, enactors that map text size, line spacing, fonts and contrast onto the theme's tokens, and the theme's own messages in `i18n/vendor/infusion-messages/`, under the file names Infusion's loader asks for. `partials/preferences-head.js` applies saved preferences before the page is drawn, and its hash is written to `assets/csp.json`.
- Passthrough copies of `assets/` to `/assets/` (without README files, and with the theme's messages published beside Infusion's), and of the site's `media/` except raster images, which are published only as processed files.

Nunjucks must be the same copy Eleventy uses, `@11ty/nunjucks`, or rendered Markdown is escaped twice. The repository's `package.json` aliases `nunjucks` to it.
