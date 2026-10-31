// What the theme's check scripts know about the site they test: its directories, as the
// last build recorded them, its locales, and the pages and fixture checks in the data file
// checks.yaml in its data directory. The scripts themselves never name a page.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import { stringsFor } from "../strings.js";

const theme = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const directoriesFile = ".cache/katagami/directories.json";

if (!fs.existsSync(directoriesFile)) {
  throw new Error(`${directoriesFile} is missing: run the build first, from the site's root folder.`);
}
const directories = JSON.parse(fs.readFileSync(directoriesFile, "utf8"));

function readData(name) {
  const file = path.join(directories.data, `${name}.yaml`);
  if (!fs.existsSync(file)) throw new Error(`${file} is missing: the theme's checks read it.`);
  return yaml.load(fs.readFileSync(file, "utf8")) ?? {};
}

export const inputDir = directories.input;
export const outputDir = directories.output;
export const settings = readData("site");
export const locales = readData("locales");
export const { pages = [], fixtureChecks = [], untranslated = [] } = readData("checks");

// Each locale's full language tag, such as fr-CA, by its code.
export const tags = Object.fromEntries(locales.map((locale) => [locale.code, locale.tag ?? locale.code]));

// The locales the browser checks exercise, by what each is for rather than by name: the
// site's default, another left-to-right one if it has one, and a right-to-left one.
export const primary = locales.find((locale) => locale.code === settings.defaultLang) ?? locales[0];
export const second = locales.find((locale) => locale !== primary && locale.dir !== "rtl") ?? primary;
export const rtl = locales.find((locale) => locale.dir === "rtl");
export const home = (locale) => `/${locale.code}/`;
// A page in a locale other than its home page, from the site's list.
export const inner = (locale) => pages.find((url) => url.startsWith(home(locale)) && url !== home(locale)) ?? home(locale);

// The interface strings a locale's pages show, found as the theme finds them.
const strings = Object.fromEntries(
  fs
    .readdirSync(path.join(theme, "i18n"))
    .filter((file) => file.endsWith(".yaml"))
    .map((file) => [path.basename(file, ".yaml"), yaml.load(fs.readFileSync(path.join(theme, "i18n", file), "utf8"))]),
);
export const interfaceString = (locale, key) => stringsFor(strings, locale.code, locale.tag)?.[key] ?? strings.en[key];

// A message from the preferences panel in a locale's language, or in English without one.
export function panelMessage(locale, file, key) {
  const language = (locale.tag ?? locale.code).split("-")[0];
  const dir = path.join(theme, "i18n/vendor/infusion-messages");
  const localized = path.join(dir, `${file}_${language}.json`);
  return JSON.parse(fs.readFileSync(fs.existsSync(localized) ? localized : path.join(dir, `${file}.json`), "utf8"))[key];
}
