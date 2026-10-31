// Site-only build code, added by the theme plugin after everything else it registers.

export default function (eleventyConfig) {
  // The theme finds interface strings by locale code, and its files are named by language,
  // so the code fr-ca would miss i18n/fr.yaml and fall back to English. The panel and the
  // typography already use the language alone; this makes the interface strings match.
  const translate = eleventyConfig.getFilter("t");
  eleventyConfig.addFilter("t", (key, lang) => translate(key, lang.split("-")[0]));
}
