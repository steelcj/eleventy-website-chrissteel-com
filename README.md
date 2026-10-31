# chrissteel.com

The personal website of Christopher Steel: a plain, text-first writer's site in Canadian English and French, built with Eleventy on the [Katagami](https://github.com/steelcj/eleventy-theme-katagami) theme. All content is placeholder text for now. An Arabic locale is kept as a right-to-left fixture: it builds everywhere and stays out of the production language switcher and chooser until an Arabic reader has reviewed it.

## Install, build, serve and check

The site needs Node.js 22 or later; `.nvmrc` selects Node 24 for nvm users.

```sh
npm install
npx playwright install chromium   # once, for npm run check:browser

npm start                  # serve at http://localhost:8080 and rebuild on change
npm run build              # build all locales into _site/
npm run build:production   # build with the fixture locale out of the switcher and chooser
npm run lint               # stylelint, including the logical-property rule
npm run check              # check the built pages, and that every page has its translations
npm run check:browser      # check the built site in a real browser
```

`CLAUDE.md` holds the content rules and the definition of done.

## Updating the theme

`themes/katagami/` is a copy of the theme and is never edited here; site changes go in `site/`, `src/` and `src/_data/`. To update the theme, replace `themes/katagami/` with a newer copy, update `THEME_VERSION` with its release and commit, then build and run every check.

## SAT

Source Archive Tools (SAT) will later generate `src/` from a SAT collection. This hand-built site is the target that generated output must match.
