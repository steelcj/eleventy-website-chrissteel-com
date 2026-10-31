// Which interface strings a locale uses: those named by its code, then its full language
// tag, then its primary language subtag, so fr-ca and fr-CA both find fr. A locale with
// none gets undefined, and the theme falls back to English.
export function stringsFor(strings, code, tag) {
  for (const name of [code, tag, String(tag ?? code).split("-")[0]]) {
    if (name && strings[name]) return strings[name];
  }
  return undefined;
}
