---
title: "Specification: Header Placement"
dc:title: "Specification: Header Placement"
dc:creator: "Christopher Steel"
dc:contributor: "Claude Opus 5.5 (Anthropic), AI assistance"
dc:subject: "Katagami, header, placement, brand block, search, language, settings, main menu, divider, right-to-left, screen readers"
dc:description: "Where each element of Katagami's header sits, at every width and in both directions, what opens where, and what each control is called on screen and to screen readers."
dc:date: "2026-10-31"
dc:type: "Text"
dc:format: "text/markdown"
dc:identifier: "urn:uuid:d47fba74-6d2d-4243-8644-baa7612549e7"
dc:language: "en-CA"
dc:rights: "CC-BY-4.0"
sat:version: "0.1.1"
sat:status: "Draft"
---

# Specification: Header Placement

Version: 0.1.1
Status: Draft

## Purpose

This specification fixes where each element of Katagami's header sits, at every width and in both writing directions, where each control opens, and what each control is called, on screen and to screen readers. It was worked out with Christopher Steel on 2026-10-31 while building chrissteel.com, starting from the header of the vishpala.com theme and the "By Design" study.

## Scope

In scope: placement, order, what opens where, and the names of controls.

Out of scope, each for later work:

- Style: colours, type, spacing, borders and the look of the divider. Each site's design decides these.
- Behaviour beyond opening and closing: search results and the search index, what happens when a page has no translation, and long lists of languages.

## Terms

| Term | Meaning |
| --- | --- |
| Header | Everything from the top of the page to the divider, the page's banner landmark |
| Announcement bar | An optional strip at the top of the header, shown only when a site enables an announcement |
| Brand block | The seal, the site name, the headline and the description |
| Seal | A decorative mark beside the site name |
| Tools | Search, Language and Settings |
| Main menu | The site's top-level navigation |
| Divider | The decorative band that forms the header's bottom edge |
| Bar | A full-width panel that opens across the page |
| Dropdown | A list that opens below its button, over the content |

## Layout

### Wide screens

```text
 ┌────────────────────────────────────────────────────────────────┐
 │  Announcement, when enabled                                    │
 ├────────────────────────────────────────────────────────────────┤
 │ ┌─┐ SITE NAME                                    [⌕ Search]    │
 │ │◆│ Headline                                                   │
 │ │◆│ Description                                                │
 │ └─┘                              [⊕ English ▾] [⚙ Settings]    │
 │ Home   Articles   Projects   Collaboration   About             │
 ├≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈┤ ← DIVIDER
 │ page content: the page's own title (H1) starts here            │
```

- The brand block sits at the start: the seal, then the site name, the headline and the description, one under the other.
- Search sits at the end of the site name's row.
- Language and Settings sit at the end, on the row just above the main menu, in that order.
- The main menu has its own row, under the brand block.
- The divider is the header's last element.

### Narrow screens

```text
 ┌──────────────────────────────┐
 │ ┌─┐ SITE NAME             [⌕]│
 │ │◆│ Headline                 │
 │ │◆│ Description              │
 │ └─┘              [⊕] [⚙]     │
 │ Home  Articles  Projects     │
 │ Collaboration  About         │
 ├≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈┤
```

Every element keeps its wide-screen position. Only the tools change, to their icons alone, with their names kept for screen readers. The main menu stays visible and wraps when it has to; it is never hidden behind a menu button.

### Right-to-left pages

The whole header mirrors: the brand block sits on the right, Search at the top left, Language and Settings at the bottom left, and the main menu reads from the right. Nothing else changes.

### Announcement bar

When a site enables an announcement, it is the first thing in the header landmark after the skip link, at the very top of the page, and never between other parts of the header.

## Controls

| Control | Shown when | On screen, wide | On screen, narrow | Heard by screen readers |
| --- | --- | --- | --- | --- |
| Site name | Always | The name | The name | "<site name>, link", to the home page |
| Seal | Always | The mark | The mark | Nothing: decorative |
| Search | The site enables search | ⌕ and "Search" | ⌕ | "Search, button" |
| Language | The site has two or more public languages | ⊕, the current language's name and ▾ | ⊕ | "Language: <current language>, button, collapsed" or "expanded" |
| Settings | Always | ⚙ and "Settings" | ⚙ | "Settings, button, collapsed" or "expanded" |
| Main menu | Always | Each item's label | Each item's label | "Main navigation" landmark; the current item says "current page" |

- A site with one public language shows no language control. Fixture locales do not count in a production build.
- The visible word on each control is part of its spoken name, so voice control users can say what they see.
- The headline and the description are plain text in the banner, not headings. The page's single H1 belongs to the page, below the divider.
- The site name is written in its normal case. Any capitals are a matter of style, set with CSS, so screen readers do not spell the name out.

## What opens where

| Control | Opens as | Where |
| --- | --- | --- |
| Search | A bar | Fixed across the top of the screen, over the header, with results below the field; it closes with its close button or Escape, and focus returns to the Search button |
| Language | A dropdown | Directly below the Language button, aligned to its outer edge, over the page content; it lists every public language in its own name, with the current one marked |
| Settings | A bar | Full width, below the main menu and above the divider, pushing the page down; Reset is inside it |

```text
 Search open                              Settings open
 ┌──────────────────────────────────┐     ┌──────────────────────────────────┐
 │ [⌕ Search…                   ✕]  │     │ ┌─┐ SITE NAME          [⌕ Search]│
 │  results…                        │     │ └─┘        [⊕ English ▾][⚙ Sett.]│
 ├──────────────────────────────────┤     │ Home  Articles  Projects  …      │
 │ (header, covered)                │     │┌────────────────────────────────┐│
                                          ││ SETTINGS BAR: text size,       ││
 Language open                            ││ spacing, fonts, contrast, reset││
 ┌──────────────────────────────────┐     │└────────────────────────────────┘│
 │ ┌─┐ SITE NAME          [⌕ Search]│     ├≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈┤
 │ └─┘        [⊕ English ▾][⚙ Sett.]│
 │             ┌────────────┐       │
 │             │ English ✓  │       │
 │             │ Français   │       │
 │             │ العربية    │       │
 │             └────────────┘       │
```

## Reading and focus order

The order of the header in the page's code matches the order on screen, top to bottom and in the reading direction:

1. Skip link
2. Announcement, when enabled
3. Site name
4. Search
5. Language
6. Settings
7. Main menu

Keyboard users meet the controls in the order sighted users read them.

## Where the text comes from

The theme provides the places; each site provides the words, per language: the site name, the headline, the description, the seal, and the announcement. The labels of the controls, such as "Search", "Language" and "Settings", are the theme's interface strings in each language.

## Open questions

- The seal's content and its text alternative, if a site wants the seal understood rather than treated as decoration.
- Where Settings opens on a page with an announcement: this specification assumes the same place, below the main menu.

## Changelog

| Version | Date | Status | Notes |
| --- | --- | --- | --- |
| 0.1.0 | 2026-10-31 | Draft | Initial version, from the header discussion of 2026-10-31 |
| 0.1.1 | 2026-11-03 | Draft | The announcement bar is inside the header landmark, first after the skip link, matching the reading order; it was described as above the header |

## License

This document, *Specification: Header Placement*, by **Christopher Steel**, with AI assistance from **Claude Opus 5.5 (Anthropic)**, is licensed under the [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/).
