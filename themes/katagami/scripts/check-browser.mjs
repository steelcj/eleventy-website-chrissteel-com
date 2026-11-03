// Checks the built site in a real browser: the reader preferences panel and the
// preferences it saves, the panel under the site's Content Security Policy and when
// Infusion fails to load, the reader's system settings, the header's controls, focus
// order and placement, accessibility audits with axe-core, which fonts each page
// downloads, the vertical rhythm, and the page without JavaScript. Its pages come from the site's checks.yaml and its locales from the site.
// Uses the Chromium that Playwright installs (npx playwright install chromium), not the
// system browser. Run after a build: npm run build && npm run check:browser. The output
// folder may be given as an argument.

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { chromium } from "playwright";
import { home, inner, interfaceString, locales, outputDir as builtDir, pages as sitePages, panelMessage, primary, publicLocales, rtl, second, settings } from "./site.mjs";

const outputDir = path.resolve(process.argv[2] ?? builtDir);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".avif": "image/avif",
  ".webp": "image/webp",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

// A static server for _site/, so the check needs nothing else running.
const server = http.createServer((request, response) => {
  let file = path.join(outputDir, decodeURIComponent(new URL(request.url, "http://localhost").pathname));
  if (!file.startsWith(outputDir)) file = outputDir;
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, { "content-type": types[path.extname(file)] ?? "application/octet-stream" });
  fs.createReadStream(file).pipe(response);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

const problems = [];
const expect = (condition, message) => {
  if (!condition) problems.push(message);
};

const browser = await chromium.launch();
const KEY = "katagami-preferences";


// Opens a page and returns it with the files it requested and the errors it raised.
async function open(context, url) {
  const page = await context.newPage();
  const requests = [];
  const errors = [];
  page.on("request", (request) => requests.push(new URL(request.url()).pathname));
  page.on("response", (response) => {
    if (response.status() >= 400) errors.push(`${response.status()} ${new URL(response.url()).pathname}`);
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto(origin + url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // Font files by their folder and name, such as ibm-plex-sans-arabic/arabic-400-normal.woff2.
  const fonts = () => requests.filter((request) => request.endsWith(".woff2")).map((request) => request.split("/").slice(-2).join("/"));
  return { page, requests, errors, fonts };
}

// Opens the preferences panel, which loads Infusion the first time.
async function openPanel(page) {
  await page.click(".flc-slidingPanel-toggleButton");
  await page.waitForSelector(".flc-prefsEditor-text-font option", { state: "attached", timeout: 15000 });
  // Wait for the panel's slide-open animation to finish, so positions are final.
  await page.waitForFunction(() => window.jQuery && window.jQuery(":animated").length === 0);
  await page.waitForTimeout(100);
}

// Chooses a contrast scheme by its label, as a reader does.
async function chooseContrast(page, value) {
  const id = await page.getAttribute(`.flc-prefsEditor-themeInput[value="${value}"]`, "id");
  await page.click(`label[for="${id}"]`);
}

const stored = (page) => page.evaluate((key) => JSON.parse(localStorage.getItem(key) || "null"), KEY);
const state = (page) =>
  page.evaluate(() => ({
    fontSet: document.getElementById("font-set").getAttribute("href").match(/([a-z-]+)\.css$/)[1],
    contrast: document.documentElement.getAttribute("data-contrast"),
    textSize: document.documentElement.style.getPropertyValue("--text-size"),
    lineSpace: document.documentElement.style.getPropertyValue("--line-space"),
    background: getComputedStyle(document.body).backgroundColor || getComputedStyle(document.documentElement).backgroundColor,
    heading: getComputedStyle(document.querySelector("h1")).fontFamily,
  }));
const background = (page) => page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor);
const WASHI = "rgb(245, 240, 230)";
const DARK = "rgb(28, 26, 23)";
const WHITE = "rgb(255, 255, 255)";

// The panel: Infusion loads only when a reader opens it, each preference applies at once
// and is saved, saved preferences apply on the next page before Infusion loads, and reset
// returns to the defaults.
{
  const context = await browser.newContext();
  let { page, requests, errors } = await open(context, inner(second));
  expect(await page.isVisible("[data-preferences]"), "the preferences part is not shown with JavaScript");
  expect(!requests.some((request) => request.includes("infusion")), "Infusion loaded before the panel was opened");

  await openPanel(page);
  expect(requests.some((request) => request.endsWith("infusion-uio.js")), "opening the panel did not load Infusion");
  expect(!requests.some((request) => request.includes("opensans")), "the panel requested Open Sans");
  expect((await page.textContent(".flc-prefsEditor-text-font-label")).includes(panelMessage(second, "fontSet", "textFontLabel")), `the panel is not in ${second.name}`);

  await page.selectOption(".flc-prefsEditor-text-font", "mincho");
  await chooseContrast(page, "dark");
  await page.fill(".flc-prefsEditor-fluid_prefs_textSize .flc-textfieldStepper-field", "1.3");
  await page.press(".flc-prefsEditor-fluid_prefs_textSize .flc-textfieldStepper-field", "Enter");
  await page.click(".flc-prefsEditor-fluid_prefs_lineSpace .flc-textfieldStepper-increase");
  await page.waitForTimeout(500);
  let now = await state(page);
  expect(now.fontSet === "mincho" && now.heading.startsWith('"Shippori Mincho"'), "choosing Mincho did not change the font set");
  expect(now.contrast === "dark" && (await background(page)) === DARK, "choosing dark did not change the colours");
  expect(now.textSize === "1.3", `text size did not apply: ${now.textSize}`);
  expect(now.lineSpace === "1.1", `line spacing did not apply: ${now.lineSpace}`);
  const saved = await stored(page);
  expect(
    JSON.stringify(saved) === JSON.stringify({ version: 1, textSize: 1.3, lineSpace: 1.1, fontSet: "mincho", contrast: "dark" }),
    `saved preferences are ${JSON.stringify(saved)}`,
  );
  expect(errors.length === 0, `errors while using the panel: ${errors.join("; ")}`);
  await page.close();

  ({ page, requests, errors } = await open(context, home(primary)));
  now = await state(page);
  expect(now.fontSet === "mincho" && now.contrast === "dark" && now.textSize === "1.3" && now.lineSpace === "1.1", `saved preferences did not apply on the next page: ${JSON.stringify(now)}`);
  expect(!requests.some((request) => request.includes("infusion")), "applying saved preferences loaded Infusion");
  expect(!(await page.isVisible("[data-preferences-reset]")), "Reset is shown while the Settings bar is closed");

  // Reset is in the Settings bar.
  await openPanel(page);
  await page.click("[data-preferences-reset]");
  await page.waitForTimeout(300);
  now = await state(page);
  expect((await stored(page)) === null, "reset did not clear the saved preferences");
  expect(now.fontSet === settings.fontSet && now.contrast === null && now.textSize === "" && now.lineSpace === "", `reset did not return to the defaults: ${JSON.stringify(now)}`);
  expect(errors.length === 0, `errors on the next page: ${errors.join("; ")}`);
  await context.close();
}

// The Settings button is a disclosure: its label stays the same and aria-expanded follows
// the bar, which shows with Reset in it when open and is gone when closed.
{
  const context = await browser.newContext();
  const { page } = await open(context, home(second));
  const button = () =>
    page.evaluate(() => {
      const toggle = document.querySelector(".flc-slidingPanel-toggleButton");
      const label = toggle.querySelector("[data-settings-label]");
      return {
        text: label.textContent,
        expanded: toggle.getAttribute("aria-expanded"),
        pressed: toggle.getAttribute("aria-pressed"),
        label: toggle.getAttribute("aria-label") ?? label.getAttribute("aria-label"),
        bar: !document.querySelector("[data-settings-bar]").hidden,
      };
    });
  const closed = await button();
  await openPanel(page);
  const opened = await button();
  await page.click(".flc-slidingPanel-toggleButton");
  await page.waitForTimeout(800);
  const closedAgain = await button();
  expect(!closed.bar && opened.bar && !closedAgain.bar, `the Settings bar does not follow the button: ${JSON.stringify([closed, opened, closedAgain])}`);
  expect(closed.text === interfaceString(second, "settings") && opened.text === closed.text && closedAgain.text === closed.text, `the button's label changed: ${JSON.stringify([closed, opened, closedAgain])}`);
  expect(closed.expanded === "false" && opened.expanded === "true" && closedAgain.expanded === "false", `aria-expanded does not follow the panel: ${JSON.stringify([closed, opened, closedAgain])}`);
  expect([closed, opened, closedAgain].every((state) => state.pressed === null && state.label === null), "the button has aria-pressed or aria-label");
  await context.close();
}

// Under the site's minimum Content Security Policy, from assets/csp.json, the panel loads
// and works with no violations.
{
  const policy = JSON.parse(fs.readFileSync(path.join(outputDir, "assets/csp.json"), "utf8")).policy;
  const context = await browser.newContext();
  await context.route("**/*", async (route) => {
    const response = await route.fetch();
    const headers = { ...response.headers() };
    if (route.request().resourceType() === "document") headers["content-security-policy"] = policy;
    await route.fulfill({ response, headers });
  });
  await context.addInitScript(() =>
    document.addEventListener("securitypolicyviolation", (event) => console.error(`CSP violation: ${event.violatedDirective} ${event.blockedURI || event.sample}`)),
  );
  for (const url of [inner(primary), ...(rtl ? [home(rtl)] : [])]) {
    const { page, errors } = await open(context, url);
    await openPanel(page);
    await page.selectOption(".flc-prefsEditor-text-font", "gothic");
    await chooseContrast(page, "dark");
    await page.waitForTimeout(300);
    const now = await state(page);
    expect(now.fontSet === "gothic" && now.contrast === "dark", `${url}: the panel did not work under the Content Security Policy`);
    expect(errors.length === 0, `${url}: errors under the Content Security Policy: ${errors.join("; ")}`);
    await page.evaluate((key) => localStorage.removeItem(key), KEY);
    await page.close();
  }
  await context.close();
}

// When Infusion cannot load, the button says so in the page's language, a status message
// announces it, and the rest of the page is unaffected.
{
  const context = await browser.newContext();
  await context.route("**/infusion-uio.js", (route) => route.abort());
  for (const locale of new Set([second, primary])) {
    const url = home(locale);
    const message = interfaceString(locale, "preferencesFailed");
    const page = await context.newPage();
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.goto(origin + url, { waitUntil: "networkidle" });
    await page.click(".flc-slidingPanel-toggleButton");
    await page.waitForTimeout(1000);
    const result = await page.evaluate(() => ({
      button: document.querySelector(".flc-slidingPanel-toggleButton [data-settings-label]").textContent,
      status: document.querySelector("[data-preferences-status]").textContent,
      expanded: document.querySelector(".flc-slidingPanel-toggleButton").getAttribute("aria-expanded"),
      heading: document.querySelector("main h1")?.textContent,
      links: document.querySelectorAll("main a").length,
    }));
    expect(result.button === message && result.status === message, `${url}: a failed load did not show the message: ${JSON.stringify(result)}`);
    expect(result.expanded === "false" && result.heading && result.links > 0, `${url}: a failed load affected the page: ${JSON.stringify(result)}`);
    expect(pageErrors.length === 0, `${url}: errors after a failed load: ${pageErrors.join("; ")}`);
    await page.close();
  }
  await context.close();
}

// Accessibility audits with axe-core: the site's pages in all three languages, under the
// site's colours, high contrast and dark, and with the panel open.
{
  const audit = async (page) => {
    await page.addScriptTag({ path: path.resolve("node_modules/axe-core/axe.min.js") });
    return page.evaluate(async () => {
      const result = await window.axe.run(document);
      return {
        passes: result.passes.length,
        violations: result.violations.map((violation) => `${violation.id} (${violation.impact}) at ${violation.nodes.map((node) => node.target.join(" ")).slice(0, 2).join(", ")}`),
      };
    });
  };
  for (const contrast of ["site", "high", "dark"]) {
    const context = await browser.newContext();
    await context.addInitScript(([key, value]) => localStorage.setItem(key, JSON.stringify({ version: 1, contrast: value })), [KEY, contrast]);
    for (const url of sitePages) {
      const { page } = await open(context, url);
      const result = await audit(page);
      expect(result.passes > 0, `axe did not run on ${url} (${contrast})`);
      expect(result.violations.length === 0, `axe, ${contrast}, ${url}: ${result.violations.join("; ")}`);
      await page.close();
    }
    await context.close();
  }
  const context = await browser.newContext();
  for (const url of [home(primary), ...(rtl ? [home(rtl)] : [])]) {
    const { page } = await open(context, url);
    await openPanel(page);
    const result = await audit(page);
    expect(result.violations.length === 0, `axe, panel open, ${url}: ${result.violations.join("; ")}`);
    await page.close();
  }
  await context.close();
}

// Each contrast choice's radio input sits under its own visible choice, in either
// direction: a click where the input is selects that choice, and on the Arabic page the
// keyboard moves through every choice. The stored value must match each time.
{
  const storedContrast = async (page) => (await stored(page))?.contrast ?? "default";
  for (const locale of [...(rtl ? [rtl] : []), primary]) {
    const url = home(locale);
    const context = await browser.newContext();
    const { page, errors } = await open(context, url);
    await openPanel(page);
    for (const value of ["site", "high", "dark", "default"]) {
      const box = await page.locator(`.flc-prefsEditor-themeInput[value="${value}"]`).boundingBox();
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(200);
      const saved = await storedContrast(page);
      expect(saved === value, `${url}: clicking where the "${value}" input is chose "${saved}"`);
    }
    if (locale === rtl) {
      await page.focus('.flc-prefsEditor-themeInput[value="default"]');
      for (const value of ["site", "high", "dark", "default"]) {
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("Space");
        await page.waitForTimeout(200);
        const focused = await page.evaluate(() => document.activeElement.value);
        const saved = await storedContrast(page);
        expect(focused === value && saved === value, `${url}: by keyboard, "${focused}" is focused and "${saved}" is stored, expected "${value}"`);
      }
    }
    expect(errors.length === 0, `${url}: errors choosing contrast: ${errors.join("; ")}`);
    await context.close();
  }
}

// Reset from the open panel clears the saved preferences too.
{
  const context = await browser.newContext();
  await context.addInitScript((key) => {
    if (!sessionStorage.getItem("seeded")) {
      localStorage.setItem(key, JSON.stringify({ version: 1, contrast: "high", textSize: 1.5 }));
      sessionStorage.setItem("seeded", "1");
    }
  }, KEY);
  const { page, errors } = await open(context, home(primary));
  expect((await state(page)).contrast === "high", "saved high contrast did not apply");
  await openPanel(page);
  await page.click("[data-preferences-reset]");
  await page.waitForTimeout(500);
  expect((await stored(page)) === null, "reset from the open panel did not clear the saved preferences");
  expect((await state(page)).contrast === null, "reset from the open panel did not restore the default contrast");
  expect(errors.length === 0, `errors resetting from the panel: ${errors.join("; ")}`);
  await context.close();
}

// A font set saved before version 1 moves into the new format once.
{
  const context = await browser.newContext();
  await context.addInitScript(() => {
    if (!sessionStorage.getItem("seeded")) {
      localStorage.setItem("katagami-font-set", "gothic");
      sessionStorage.setItem("seeded", "1");
    }
  });
  const { page } = await open(context, home(primary));
  expect((await state(page)).fontSet === "gothic", "the older font set choice did not apply");
  expect(JSON.stringify(await stored(page)) === JSON.stringify({ version: 1, fontSet: "gothic" }), "the older font set choice did not move into the new format");
  expect((await page.evaluate(() => localStorage.getItem("katagami-font-set"))) === null, "the older key was not removed");
  await context.close();
}

// Without storage, nothing breaks: defaults apply, and choices last for the page.
{
  const context = await browser.newContext();
  await context.addInitScript(() => {
    for (const method of ["getItem", "setItem", "removeItem"]) {
      Storage.prototype[method] = () => {
        throw new Error("storage blocked");
      };
    }
  });
  const { page, errors } = await open(context, home(primary));
  await openPanel(page);
  await chooseContrast(page, "high");
  await page.waitForTimeout(300);
  expect((await state(page)).contrast === "high", "without storage, a choice did not apply to the page");
  expect(errors.length === 0, `errors without storage: ${errors.join("; ")}`);
  await context.close();
}

// With forced colours, as in Windows' contrast themes, the browser replaces background
// colours, which would hide the icons the theme draws as masks over one: the header's
// tools, the search bar's, the seal and the breadcrumb separator. Each must keep a colour
// unlike the page's, in light and dark forced colours.
{
  const painted = (page) =>
    page.evaluate(() => {
      const page = getComputedStyle(document.documentElement).backgroundColor;
      const marks = [...document.querySelectorAll(".tool__icon, .brand__mark")]
        .filter((element) => element.checkVisibility())
        .map((element) => [element.className, getComputedStyle(element).backgroundColor]);
      for (const item of document.querySelectorAll(".breadcrumbs li + li")) marks.push(["breadcrumb separator", getComputedStyle(item, "::before").backgroundColor]);
      return { forced: matchMedia("(forced-colors: active)").matches, hidden: marks.filter(([, colour]) => colour === page || /rgba\(.*, 0\)$/.test(colour)).map(([name, colour]) => `${name} ${colour}`), count: marks.length };
    });
  for (const colorScheme of ["light", "dark"]) {
    const context = await browser.newContext({ forcedColors: "active", colorScheme });
    for (const url of new Set([home(primary), inner(primary), ...(rtl ? [inner(rtl)] : [])])) {
      const { page } = await open(context, url);
      let result = await painted(page);
      expect(result.forced && result.count > 0, `${url}, forced colours (${colorScheme}): the check found no icons, or forced colours did not apply`);
      expect(result.hidden.length === 0, `${url}, forced colours (${colorScheme}): invisible icons: ${result.hidden.join(", ")}`);
      if (await page.isVisible("[data-search-open]")) {
        await page.click("[data-search-open]");
        result = await painted(page);
        expect(result.hidden.length === 0, `${url}, forced colours (${colorScheme}), search open: invisible icons: ${result.hidden.join(", ")}`);
      }
      await page.close();
    }
    await context.close();
  }
}

// The reader's system settings apply without JavaScript, and an explicit choice overrides them.
{
  let context = await browser.newContext({ javaScriptEnabled: false, colorScheme: "dark" });
  let { page } = await open(context, home(primary));
  expect((await background(page)) === DARK, "a dark system setting did not give dark colours");
  expect(!(await page.isVisible("[data-preferences]")), "the Settings part is shown without JavaScript");
  expect((await state(page)).fontSet === settings.fontSet, "the site's font set is not used without JavaScript");
  // Without JavaScript the Language and Search buttons stay hidden, and the languages show
  // as plain links.
  expect(!(await page.isVisible("[data-language-toggle]")) && !(await page.isVisible("[data-search-open]")), "a Language or Search button is shown without JavaScript");
  if (publicLocales.length > 1) {
    const links = await page.locator("#language-list a").evaluateAll((items) => items.filter((item) => item.checkVisibility()).length);
    expect(links === publicLocales.length, `without JavaScript, ${links} of ${publicLocales.length} language links are shown`);
  }
  await context.close();

  context = await browser.newContext({ javaScriptEnabled: false, contrast: "more" });
  ({ page } = await open(context, home(primary)));
  expect((await background(page)) === WHITE, "a high contrast system setting did not give high contrast");
  await context.close();

  context = await browser.newContext({ colorScheme: "dark" });
  await context.addInitScript((key) => localStorage.setItem(key, JSON.stringify({ version: 1, contrast: "site" })), KEY);
  ({ page } = await open(context, home(primary)));
  expect((await background(page)) === WASHI, "choosing the site's colours did not override a dark system setting");
  await context.close();
}

// The right-to-left panel is in its language and right to left.
if (rtl) {
  const context = await browser.newContext();
  const { page, errors } = await open(context, home(rtl));
  await openPanel(page);
  expect((await page.textContent(".flc-prefsEditor-text-font-label")).includes(panelMessage(rtl, "fontSet", "textFontLabel")), `the panel is not in ${rtl.name}`);
  expect((await page.evaluate(() => getComputedStyle(document.querySelector(".fl-prefsEditor")).direction)) === "rtl", "the right-to-left panel is not right to left");
  expect(errors.length === 0, `errors in the right-to-left panel: ${errors.join("; ")}`);
  await context.close();
}

// The header, as its placement specification sets it out, at phone, tablet and desktop
// widths, in the default language and a right-to-left one: what screen readers call each
// control, which controls are present, the size of every target and the space between
// them, the seal as a second link home that adds no Tab stop, the focus order, the search
// bar and the Language dropdown opening and closing from the keyboard, where each part
// sits, and where each control opens. Axe audits the page with the dropdown and the
// search bar open.
{
  const offered = publicLocales.length > 1;
  const axeIssues = async (page) => {
    await page.addScriptTag({ path: path.resolve("node_modules/axe-core/axe.min.js") });
    return page.evaluate(async () =>
      (await window.axe.run(document)).violations.map((violation) => `${violation.id} at ${violation.nodes.map((node) => node.target.join(" ")).slice(0, 2).join(", ")}`),
    );
  };
  const box = (page, selector) =>
    page.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (!element || !element.checkVisibility()) return null;
      const { left, right, top, bottom, width } = element.getBoundingClientRect();
      return { left, right, top, bottom, width };
    }, selector);
  // Targets, as the specification's Target sizes asks: the seal, each tool and Reset at
  // least 44 by 44 CSS pixels, each item of the main menu and the Language list at least
  // 44 tall, and neighbouring targets at least 8 apart. The site name is a target too,
  // held to the spacing only. Half a pixel is allowed for rounding.
  const targets = (page, scope) =>
    page.evaluate((scope) => {
      const found = [];
      const add = (element, name, square) => {
        if (!element?.checkVisibility()) return;
        const { left, right, top, bottom, width, height } = element.getBoundingClientRect();
        found.push({ name, square, sized: name !== "site name", left, right, top, bottom, width, height });
      };
      const root = document.querySelector(scope);
      add(root.querySelector(".brand__seal"), "seal", true);
      add(root.querySelector(".brand__name"), "site name", false);
      for (const tool of root.querySelectorAll(".tool")) add(tool, tool.className.split(" ")[1], true);
      for (const link of root.querySelectorAll(".main-nav a, .language__list a")) add(link, `${link.closest(".main-nav") ? "menu" : "language"} item "${link.textContent.trim()}"`, false);
      return found;
    }, scope);
  const targetProblems = (found) => {
    const problems = found
      .filter((target) => target.sized && (target.height < 43.5 || (target.square && target.width < 43.5)))
      .map((target) => `${target.name} is ${Math.round(target.width)}×${Math.round(target.height)}`);
    for (let i = 0; i < found.length; i++) {
      for (let j = i + 1; j < found.length; j++) {
        const [a, b] = [found[i], found[j]];
        const apart = Math.hypot(Math.max(0, a.left - b.right, b.left - a.right), Math.max(0, a.top - b.bottom, b.top - a.bottom));
        if (apart < 7.5) problems.push(`${a.name} and ${b.name} are ${apart.toFixed(1)}px apart`);
      }
    }
    return problems;
  };
  const focused = (page) =>
    page.evaluate(() => {
      const element = document.activeElement;
      const names = { ".skip-link": "skip link", ".brand__name": "site name", "[data-search-open]": "Search", "[data-language-toggle]": "Language", ".settings__toggle": "Settings", ".main-nav a": "main menu", "#search-field": "search field" };
      return Object.entries(names).find(([selector]) => element.matches(selector))?.[1] ?? element.outerHTML.slice(0, 60);
    });

  for (const locale of [primary, ...(rtl ? [rtl] : [])]) {
    for (const width of [390, 820, 1280]) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      const url = home(locale);
      const where = `${url} at ${width}px`;
      const { page, errors } = await open(context, url);
      const header = page.locator(".region--header");
      const count = (role, name) => header.getByRole(role, { name, exact: true }).count();

      // What screen readers call each control. The visible word is part of each name.
      // "Language: English", with the colon spaced as the language spaces it.
      const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const language = new RegExp(`^${escape(interfaceString(locale, "language"))}\\s*:\\s*${escape(locale.name)}$`);
      expect((await count("link", settings.name)) === 1, `${where}: no link named "${settings.name}"`);
      expect((await count("button", interfaceString(locale, "settings"))) === 1, `${where}: no button named "${interfaceString(locale, "settings")}"`);
      expect((await count("button", language)) === (offered ? 1 : 0), `${where}: ${offered ? "no" : "a"} button named "${language}"`);
      expect((await count("button", interfaceString(locale, "search"))) === (settings.search ? 1 : 0), `${where}: Search is ${settings.search ? "missing" : "shown"}`);
      expect((await page.getByRole("navigation", { name: interfaceString(locale, "mainNavigation"), exact: true }).count()) === 1, `${where}: no main navigation landmark`);
      // The seal is a second link home, for pointer and touch: out of the Tab order and
      // hidden from screen readers, so only the site name is heard as a link home.
      const seal = await page.evaluate(() => {
        const element = document.querySelector(".brand__seal");
        return { tag: element?.localName, href: element?.getAttribute("href"), tabindex: element?.getAttribute("tabindex"), hidden: element?.getAttribute("aria-hidden") };
      });
      expect(seal.tag === "a" && seal.href === url, `${where}: the seal is not a link to ${url}: ${JSON.stringify(seal)}`);
      expect(seal.tabindex === "-1", `${where}: the seal is in the Tab order`);
      expect(seal.hidden === "true", `${where}: the seal is not hidden from screen readers`);
      for (const selector of [".settings__toggle", ...(offered ? ["[data-language-toggle]"] : [])]) {
        expect((await page.getAttribute(selector, "aria-expanded")) === "false", `${where}: ${selector} is not collapsed`);
      }

      // The tools show their names on wide screens and their icons alone on narrow ones.
      const label = await box(page, ".settings__toggle .tool__label");
      expect(width < 768 ? label.width <= 1 : label.width > 1, `${where}: the Settings label is ${label.width > 1 ? "shown" : "hidden"}`);
      const small = targetProblems(await targets(page, ".region--header"));
      expect(small.length === 0, `${where}: header targets: ${small.join("; ")}`);

      // Focus moves through the header in the order it appears on screen.
      const order = ["skip link", "site name", ...(settings.search ? ["Search"] : []), ...(offered ? ["Language"] : []), "Settings", "main menu"];
      const met = [];
      for (let i = 0; i < order.length; i++) {
        await page.keyboard.press("Tab");
        met.push(await focused(page));
      }
      expect(met.join(", ") === order.join(", "), `${where}: focus order is ${met.join(", ")}, expected ${order.join(", ")}`);

      // Tab through the whole header reaches the home page once outside the main menu,
      // through the site name: the seal adds no stop.
      await page.reload({ waitUntil: "networkidle" });
      const stops = [];
      for (let i = 0; i < 40; i++) {
        await page.keyboard.press("Tab");
        const stop = await page.evaluate(() => {
          const element = document.activeElement;
          if (!element.closest(".region--header")) return null;
          return { home: element.matches("a[href]") && !element.getAttribute("href").startsWith("#") && new URL(element.href).pathname, menu: Boolean(element.closest(".main-nav")), name: element.className };
        });
        if (!stop) break;
        stops.push(stop);
      }
      const homeStops = stops.filter((stop) => stop.home === url && !stop.menu);
      expect(homeStops.length === 1 && homeStops[0].name === "brand__name", `${where}: Tab reaches the home page ${homeStops.length} times outside the main menu: ${homeStops.map((stop) => stop.name).join(", ")}`);

      // Where each part sits: the brand block at the start, Search at the end of the site
      // name's row, Language then Settings at the end of the row above the main menu, the
      // main menu on its own row, and nothing below the divider. Right-to-left pages mirror.
      const rtlPage = locale.dir === "rtl";
      const area = await box(page, ".region--header");
      const fromStart = (part) => (rtlPage ? area.right - part.right : part.left - area.left);
      const fromEnd = (part) => (rtlPage ? part.left - area.left : area.right - part.right);
      const brand = await box(page, ".brand");
      const name = await box(page, ".brand__name");
      const settingsButton = await box(page, ".settings__toggle");
      const menu = await box(page, ".main-nav");
      expect(Math.abs(fromStart(brand)) < 2, `${where}: the brand block is not at the start`);
      expect(Math.abs(fromEnd(settingsButton)) < 2, `${where}: Settings is not at the end`);
      expect(settingsButton.top >= brand.bottom - 1 && menu.top >= settingsButton.bottom - 1, `${where}: Settings is not on the row between the brand block and the main menu`);
      expect(Math.abs(fromStart(menu)) < 2, `${where}: the main menu does not start at the start`);
      expect((await page.locator(".main-nav a").evaluateAll((links) => links.every((link) => link.checkVisibility()))), `${where}: a main menu item is hidden`);
      if (offered) {
        const languageButton = await box(page, "[data-language-toggle]");
        expect(Math.abs(languageButton.top - settingsButton.top) < 4, `${where}: Language and Settings are not on one row`);
        expect(rtlPage ? languageButton.left >= settingsButton.right - 1 : languageButton.right <= settingsButton.left + 1, `${where}: Language does not come before Settings`);
      }
      if (settings.search) {
        const searchButton = await box(page, "[data-search-open]");
        expect(Math.abs(fromEnd(searchButton)) < 2 && searchButton.top < name.bottom && searchButton.bottom > name.top, `${where}: Search is not at the end of the site name's row`);
      }

      // The Language dropdown opens below its button, aligned to its outer edge, and
      // Escape closes it and returns focus to the button.
      if (offered) {
        await page.click("[data-language-toggle]");
        const button = await box(page, "[data-language-toggle]");
        const list = await box(page, "#language-list");
        expect((await page.getAttribute("[data-language-toggle]", "aria-expanded")) === "true" && list, `${where}: the Language dropdown did not open`);
        if (list) {
          expect(list.top >= button.bottom - 1 && Math.abs(fromEnd(list) - fromEnd(button)) < 2, `${where}: the Language dropdown is not below its button, aligned to its outer edge`);
        }
        const dropdown = targetProblems(await targets(page, ".language"));
        expect(dropdown.length === 0, `${where}: Language dropdown targets: ${dropdown.join("; ")}`);
        const current = await page.locator('#language-list a[aria-current="true"]').allTextContents();
        const own = publicLocales.includes(locale) ? [locale.name] : [];
        expect(current.join() === own.join(), `${where}: the Language dropdown marks [${current.join(", ")}] as current`);
        const issues = await axeIssues(page);
        expect(issues.length === 0, `axe, Language open, ${where}: ${issues.join("; ")}`);
        await page.keyboard.press("Escape");
        expect(
          (await page.getAttribute("[data-language-toggle]", "aria-expanded")) === "false" && !(await box(page, "#language-list")) && (await focused(page)) === "Language",
          `${where}: Escape did not close the Language dropdown and return focus to its button`,
        );
      }

      // The search bar opens fixed across the top of the screen, as a dialog, with focus in
      // its field; Escape and its close button close it and return focus to Search.
      if (settings.search) {
        await page.click("[data-search-open]");
        const bar = await box(page, "[data-search-dialog]");
        expect((await page.evaluate(() => document.querySelector("[data-search-dialog]").open)) && (await focused(page)) === "search field", `${where}: the search bar did not open with focus in its field`);
        expect(bar && bar.top === 0 && Math.abs(bar.width - width) < 2, `${where}: the search bar is not across the top of the screen`);
        const close = await box(page, "[data-search-close]");
        expect(close && close.width >= 43.5 && close.bottom - close.top >= 43.5, `${where}: the search bar's close button is smaller than 44px square`);
        const issues = await axeIssues(page);
        expect(issues.length === 0, `axe, search open, ${where}: ${issues.join("; ")}`);
        await page.keyboard.press("Escape");
        expect(!(await box(page, "[data-search-dialog]")) && (await focused(page)) === "Search", `${where}: Escape did not close the search bar and return focus to Search`);
        await page.click("[data-search-open]");
        await page.click("[data-search-close]");
        expect(!(await box(page, "[data-search-dialog]")) && (await focused(page)) === "Search", `${where}: the close button did not close the search bar and return focus to Search`);
      }

      // The Settings bar opens full width below the main menu and above the divider, and
      // holds Reset.
      await openPanel(page);
      const settingsBar = await box(page, "[data-settings-bar]");
      const menuNow = await box(page, ".main-nav");
      const areaNow = await box(page, ".region--header");
      expect(settingsBar && settingsBar.top >= menuNow.bottom - 1 && settingsBar.bottom <= areaNow.bottom + 1, `${where}: the Settings bar is not below the main menu and above the divider`);
      expect(settingsBar && Math.abs(settingsBar.width - areaNow.width) < 2, `${where}: the Settings bar is not full width`);
      expect(await page.isVisible("[data-settings-bar] [data-preferences-reset]"), `${where}: Reset is not in the Settings bar`);
      const reset = await box(page, "[data-settings-bar] [data-preferences-reset]");
      expect(reset && reset.width >= 43.5 && reset.bottom - reset.top >= 43.5, `${where}: Reset is smaller than 44px square`);
      // The contrast choices, which the theme spaces, are at least 8 pixels apart; their
      // size, like the steppers' and the font menu's, is Infusion's.
      const choices = await page.locator("[data-settings-bar] .fl-choice label").evaluateAll((labels) => labels.map((label) => label.getBoundingClientRect()));
      const crowded = choices.slice(1).filter((rect, i) => Math.max(rect.left - choices[i].right, choices[i].left - rect.right) < 7.5);
      expect(choices.length > 1 && crowded.length === 0, `${where}: contrast choices closer than 8px`);

      expect(errors.length === 0, `${where}: errors in the header: ${errors.join("; ")}`);
      await context.close();
    }
  }
}

// Latin pages never download an Arabic font, even with Arabic language names in the
// Language list; pages in a locale with `fontSet: arabic` use the Arabic companion.
{
  const context = await browser.newContext();
  const arabic = locales.find((locale) => locale.fontSet === "arabic");
  for (const url of new Set(locales.filter((locale) => locale !== arabic).flatMap((locale) => [home(locale), inner(locale)]))) {
    const { fonts } = await open(context, url);
    expect(!fonts().some((file) => file.includes("arabic")), `${url} downloaded an Arabic font: ${fonts().join(", ")}`);
  }
  if (arabic) {
    const url = home(arabic);
    const { page, fonts } = await open(context, url);
    expect(fonts().some((file) => file.startsWith("ibm-plex-sans-arabic/")), `${url} did not download IBM Plex Sans Arabic`);
    expect((await page.evaluate(() => getComputedStyle(document.body).fontFamily)).includes("IBM Plex Sans Arabic"), `${url} body text does not use the Arabic companion`);
  }
  await context.close();
}

// Vertical rhythm: every heading, paragraph, list item, caption and table cell starts a
// whole number of baselines below the page title, in every font set, at phone and
// desktop widths, in Latin and Arabic text, and with larger text and line spacing.
// Images, cards and rules may sit off the grid themselves, but the text after them must
// return to it. The only allowance is 0.3px, for sub-pixel rounding.
const rhythmSettings = [
  { fontSet: "hyperlegible" },
  { fontSet: "mincho" },
  { fontSet: "gothic" },
  { fontSet: "hyperlegible", textSize: 1.4, lineSpace: 1.3 },
];
for (const settings of rhythmSettings) {
  for (const width of [390, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    await context.addInitScript(([key, value]) => localStorage.setItem(key, JSON.stringify({ version: 1, ...value })), [KEY, settings]);
    for (const url of sitePages) {
      const { page } = await open(context, url);
      const off = await page.evaluate(() => {
        // The baseline in pixels, measured, since it depends on the reader's preferences.
        const probe = document.body.appendChild(document.createElement("div"));
        probe.style.blockSize = "var(--baseline)";
        const baseline = probe.getBoundingClientRect().height;
        probe.remove();
        const main = document.querySelector("main");
        const top = main.querySelector("h1").getBoundingClientRect().top;
        return [...main.querySelectorAll("h1, h2, h3, h4, p, li, figcaption, th, td")]
          .filter((element) => element.getClientRects().length)
          .map((element) => ({ element, px: element.getBoundingClientRect().top - top }))
          .filter(({ px }) => Math.abs(px - Math.round(px / baseline) * baseline) > 0.3)
          .map(({ element, px }) => `${element.localName} at ${(px / baseline).toFixed(2)}`);
      });
      expect(off.length === 0, `${JSON.stringify(settings)}, ${width}px, ${url}: off the baseline grid: ${off.slice(0, 4).join("; ")}`);
      await page.close();
    }
    await context.close();
  }
}

await browser.close();
server.close();

for (const problem of problems) console.log(problem);
console.log(`browser checks: ${problems.length} problems`);
process.exitCode = problems.length ? 1 : 0;
