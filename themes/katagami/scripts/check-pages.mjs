// Checks the built pages against the theme's markup rules and that every page has its
// translations, and runs the fixture checks the site lists in checks.yaml. Run after a
// build: npm run build && npm run check. The output folder may be given as an argument.

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { frenchSpacing } from "../typography.js";
import { fixtureChecks, inputDir, locales, outputDir as builtDir, pages, publicLocales, settings, tags, untranslated } from "./site.mjs";

const outputDir = process.argv[2] ?? builtDir;

const NBSP = "\u00A0";
const NNBSP = "\u202F";

// France's conventions, which no locale here uses, checked on the function itself.
const franceExpectations = [
  ["Vraiment ? Oui ! Bien sûr ; voilà.", `Vraiment${NNBSP}? Oui${NNBSP}! Bien sûr${NNBSP}; voilà.`],
  ["Note: texte", `Note${NBSP}: texte`],
  ["«mot»", `«${NBSP}mot${NBSP}»`],
  ["12:45 et a?b", "12:45 et a?b"],
];

// Hashes of the inline scripts allowed by a future Content Security Policy.
const cspFile = path.join(outputDir, "assets/csp.json");
const cspHashes = fs.existsSync(cspFile) ? JSON.parse(fs.readFileSync(cspFile, "utf8"))["script-src"] : [];

// The parts a fixture check on a region can name.
const partClasses = ["skip-link", "brand", "search", "language", "main-nav", "breadcrumbs", "section-nav", "footer-text", "site-actions", "colophon"];

// Pages only: assets/ holds HTML fragments, such as Infusion's panel templates.
function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return file === path.join(outputDir, "assets") ? [] : htmlFiles(file);
    return file.endsWith(".html") ? [file] : [];
  });
}

const problems = [];
const files = htmlFiles(outputDir);

for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const report = (message) => problems.push(`${path.relative(outputDir, file)}: ${message}`);

  // Every page states its language and direction.
  if (!/<html lang="[a-z]{2,3}(-[A-Za-z0-9]+)*" dir="(ltr|rtl)">/.test(html)) report("<html> without lang and dir");

  // Pages in a language folder carry their locale's full tag, and links name languages by
  // their full tags too.
  const code = path.relative(outputDir, file).split(path.sep)[0];
  if (tags[code] && !html.includes(`<html lang="${tags[code]}"`)) report(`lang is not ${tags[code]}`);
  for (const [, hreflang] of html.matchAll(/hreflang="([^"]*)"/g)) {
    if (!Object.values(tags).includes(hreflang)) report(`hreflang="${hreflang}" is not a locale's full tag`);
  }
  for (const [, target, hreflang] of html.matchAll(/href="\/([^/"]+)\/[^"]*"[^>]*hreflang="([^"]*)"/g)) {
    if (tags[target] && hreflang !== tags[target]) report(`link to /${target}/ has hreflang="${hreflang}", expected ${tags[target]}`);
  }

  // Pages in a language folder carry that language's footer and colophon.
  if (tags[code] && !html.includes('class="footer-text"')) report("no footer text");
  if (tags[code] && !html.includes('class="colophon"')) report("no colophon");

  // The header: a Language button only when readers are offered more than one language,
  // listing each of them with the page's own marked current, as a disclosure rather than a
  // menu; a Search button only when the site enables search; and its controls in the
  // order they appear on screen.
  const header = html.match(/<header class="region region--header">[\s\S]*?<\/header>/)?.[0];
  if (tags[code] && header) {
    const language = header.match(/<nav class="language"[\s\S]*?<\/nav>/)?.[0];
    if (publicLocales.length > 1 !== Boolean(language)) report(`${language ? "a" : "no"} Language button, with ${publicLocales.length} public languages`);
    if (language) {
      const listed = [...language.matchAll(/<a href="[^"]*" lang="([^"]*)"/g)].map((match) => match[1]);
      const expected = publicLocales.map((locale) => tags[locale.code]);
      if (listed.join() !== expected.join()) report(`the Language list has [${listed.join(", ")}], expected [${expected.join(", ")}]`);
      const current = [...language.matchAll(/<a [^>]*lang="([^"]*)"[^>]*aria-current="true"/g)].map((match) => match[1]);
      const own = publicLocales.some((locale) => locale.code === code) ? [tags[code]] : [];
      if (current.join() !== own.join()) report(`the Language list marks [${current.join(", ")}] as current, expected [${own.join(", ")}]`);
      if (!language.includes('aria-expanded="false" aria-controls="language-list"') || language.includes("aria-haspopup")) {
        report("the Language button is not a disclosure with aria-expanded and aria-controls");
      }
    }
    if (Boolean(settings.search) !== header.includes("data-search-open")) report(`${settings.search ? "no" : "a"} Search button, with search ${settings.search ? "enabled" : "disabled"}`);
    const markers = ['class="skip-link"', 'class="announcement"', 'class="brand__name"', "data-search-open", "data-language-toggle", "settings__toggle", 'class="main-nav"'];
    const found = markers.map((marker) => [marker, header.indexOf(marker)]).filter(([, at]) => at >= 0);
    if (found.some(([, at], i) => i > 0 && at < found[i - 1][1])) report(`header controls out of order: ${found.sort((a, b) => a[1] - b[1]).map(([marker]) => marker).join(", ")}`);
  }

  // Every page loads one font set and preloads exactly one font file, which must exist.
  if (!/<link rel="stylesheet" href="\/assets\/css\/fonts\/[a-z-]+\.css" id="font-set"[^>]*>/.test(html)) report("no font set stylesheet");

  // The only inline script is the preferences script, whose hash is in assets/csp.json.
  const inline = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((match) => match[1]);
  if (inline.length !== 1) report(`${inline.length} inline scripts, expected 1`);
  for (const script of inline) {
    const hash = `'sha256-${crypto.createHash("sha256").update(script).digest("base64")}'`;
    if (!cspHashes.includes(hash)) report(`inline script ${hash} is not in assets/csp.json`);
  }
  const preloads = [...html.matchAll(/<link rel="preload" href="([^"]+)" as="font"/g)].map((match) => match[1]);
  if (preloads.length !== 1) report(`${preloads.length} font preloads, expected 1`);
  for (const href of preloads) {
    if (!fs.existsSync(path.join(outputDir, href))) report(`preloaded font ${href} does not exist`);
  }

  // Each <nav> has its own label.
  const labels = [...html.matchAll(/<nav\b([^>]*)>/g)].map((match) => match[1].match(/aria-label="([^"]*)"/)?.[1]);
  if (labels.some((label) => !label)) report("<nav> without aria-label");
  if (new Set(labels).size !== labels.length) report(`<nav> labels repeated: ${labels.join(", ")}`);

  // Breadcrumbs: an ordered list, the last item current, the separator in CSS only.
  const crumbs = html.match(/<nav class="breadcrumbs"[\s\S]*?<\/nav>/)?.[0];
  if (crumbs) {
    const items = crumbs.match(/<li>[\s\S]*?<\/li>/g) ?? [];
    if (!crumbs.includes("<ol>")) report("breadcrumbs are not an ordered list");
    if (!items.at(-1)?.includes('aria-current="page"') || items.slice(0, -1).some((item) => item.includes("aria-current"))) {
      report("breadcrumbs: only the last item should be current");
    }
    if (/<svg|[›»]/.test(crumbs)) report("breadcrumb separator in markup");
  }

  // Section navigation and main menu: at most one current item each.
  const sectionNav = html.match(/<nav class="section-nav"[\s\S]*?<\/nav>/)?.[0];
  if ((sectionNav?.match(/aria-current="page"/g) ?? []).length > 1) report("section navigation has more than one current page");
  const mainNav = html.match(/<nav class="main-nav"[\s\S]*?<\/nav>/)?.[0];
  if ((mainNav?.match(/aria-current/g) ?? []).length > 1) report("main menu has more than one current item");

  // Images: alt text and dimensions on every image, and at most one loaded eagerly.
  const images = html.match(/<img\b[^>]*>/g) ?? [];
  if (images.some((img) => !/ alt="/.test(img))) report("<img> without alt");
  if (images.some((img) => !/ width="/.test(img) || !/ height="/.test(img))) report("<img> without width and height");
  if (images.filter((img) => img.includes('loading="eager"')).length > 1) report("more than one eager image");

  // No inline styles: presentation comes from the theme's CSS, in logical terms.
  if (/\sstyle="/.test(html)) report("inline style attribute");

  // No empty regions.
  if (/<(aside|div|header|footer|section) class="region[^"]*"[^>]*>\s*<\/\1>/.test(html)) report("empty region");

  // No unknown blocks or views, and no raw HTML left unescaped from content.
  if (html.includes("block--unknown")) report("unknown block or view placeholder");
}

// Every page the site lists for testing was built.
const builtFile = (url) => path.join(outputDir, url, "index.html");
for (const url of pages) {
  if (!fs.existsSync(builtFile(url))) problems.push(`${url}: listed in checks.yaml but not built`);
}

// Fixture checks, from checks.yaml: strings a page must or must not contain, and the parts
// a region must hold, in order.
const show = (text) => JSON.stringify(text).replace(/\\u00a0/gi, "⍽").replace(/\\u202f/gi, "·");
for (const { page, region, parts = [], contains = [], lacks = [] } of fixtureChecks) {
  if (!fs.existsSync(builtFile(page))) {
    problems.push(`${page}: fixture page missing`);
    continue;
  }
  const html = fs.readFileSync(builtFile(page), "utf8");
  for (const text of contains) if (!html.includes(text)) problems.push(`${page}: missing ${show(text)}`);
  for (const text of lacks) if (html.includes(text)) problems.push(`${page}: should not contain ${show(text)}`);
  if (region) {
    // Regions are siblings, so a region runs from its own tag to the next region's.
    const start = html.indexOf(`class="region region--${region}"`);
    const next = html.indexOf('class="region region--', start + 1);
    const regionHtml = start < 0 ? "" : html.slice(start, next < 0 ? undefined : next);
    const found = [...regionHtml.matchAll(/class="([a-z-]+)"/g)].map((match) => match[1]).filter((name) => partClasses.includes(name));
    if (found.join(",") !== parts.join(",")) problems.push(`${page}: ${region} has [${found.join(", ")}], expected [${parts.join(", ")}]`);
  }
}

for (const [input, expected] of franceExpectations) {
  const output = frenchSpacing(input, "france");
  if (output !== expected) problems.push(`French spacing (France) of ${JSON.stringify(input)} gave ${JSON.stringify(output)}`);
}

// Every page has a translation in every language, in both directions. Pages are translations
// when they share a key: `translationKey` in front matter, or by default the URL without its
// language prefix, as in the theme. The built Language list must link to each one.
const translations = new Map();
for (const { code } of locales) {
  if (!fs.existsSync(path.join(inputDir, code))) {
    problems.push(`${code}: listed in locales.yaml but has no folder in ${inputDir}`);
    continue;
  }
  for (const file of fs.readdirSync(path.join(inputDir, code), { recursive: true })) {
    if (!file.endsWith(".md") || file.split(path.sep).includes("site-text")) continue;
    const slug = file.replace(/\.md$/, "/").replace(/(^|\/)index\/$/, "$1");
    const url = `/${code}/${slug}`;
    const key = matter(fs.readFileSync(path.join(inputDir, code, file), "utf8")).data.translationKey ?? `/${slug}`;
    if (!translations.has(key)) translations.set(key, {});
    if (translations.get(key)[code]) problems.push(`${url}: same translation key as ${translations.get(key)[code]}`);
    translations.get(key)[code] = url;
  }
}
// A site may list pages allowed to have no translation, in checks.yaml: by key, or by a
// key's start when it ends in a slash.
const allowed = (key) => untranslated.some((entry) => key === entry || (entry.endsWith("/") && key.startsWith(entry)));
for (const [key, urls] of translations) {
  for (const { code } of locales) {
    if (!urls[code] && !allowed(key)) problems.push(`${key}: no ${code} page, but it is in ${Object.keys(urls).join(", ")}`);
  }
  for (const url of Object.values(urls)) {
    if (!fs.existsSync(builtFile(url))) {
      problems.push(`${url}: page missing`);
      continue;
    }
    const languages = fs.readFileSync(builtFile(url), "utf8").match(/<nav class="language"[\s\S]*?<\/nav>/)?.[0] ?? "";
    // A production build leaves fixture locales out of the Language list.
    for (const [, href, tag] of languages.matchAll(/<a href="([^"]*)" lang="([^"]*)"/g)) {
      const code = locales.find((locale) => tags[locale.code] === tag)?.code;
      if (urls[code] && href !== urls[code]) problems.push(`${url}: the Language list links ${tag} to ${href}, expected ${urls[code]}`);
    }
  }
}

for (const problem of problems) console.log(problem);
console.log(`${files.length} pages checked, ${translations.size} pages translated, ${problems.length} problems`);
process.exitCode = problems.length ? 1 : 0;
