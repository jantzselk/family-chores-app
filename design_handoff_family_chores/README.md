# Handoff: Family Chores — Mobile Chore Tracker

## Overview
A phone-first app for families to manage daily/weekly chores across three kids
(**Nixon**, **Benson**, **Harrison**). Chores can **rotate** between kids day-to-day
or stay assigned to one kid. The "today" screen can be viewed three ways (By Kid /
By Task / By Time), chores are completed with a configurable interaction, and chores
can be **added, edited, and deleted** — with special handling for recurring chores
(skip-just-today vs. stop-repeating).

This handoff covers the full app, with emphasis on the **add / edit / delete** flows,
which are the most recent and most logic-heavy additions.

## About the Design Files
The files in this bundle are **design references created in HTML/React-via-Babel** —
prototypes that show the intended look and behavior. They are **not production code to
copy directly**. The Babel-in-browser setup, the iOS device bezel (`ios-frame.jsx`),
the on-canvas Tweaks panel (`tweaks-panel.jsx`), and the `localStorage` persistence are
**prototype scaffolding** — drop them in your real implementation.

Your task is to **recreate these designs in the target codebase's existing
environment** (React Native, SwiftUI, Flutter, a web stack, etc.) using its established
component patterns, navigation, and data layer. If no codebase exists yet, pick the most
appropriate framework for a mobile chore app and implement there. The HTML/JSX here is
the source of truth for **layout, tokens, copy, and interaction logic** — not file
structure.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, radii, shadows, copy, and
interaction behavior are all specified below and present in the files. Recreate the UI
to match. The visual system follows the **SageMedic Design System** (indigo primary,
Mulish type, JetBrains Mono for numerals).

---

## Design Tokens

### Colors
| Token | Hex | Use |
|---|---|---|
| Primary (indigo) | `#3D34A4` | FAB, primary buttons, "Today" pill, active states, weekly chip text |
| Primary active/press | `#2C238A` | pressed primary |
| Primary disabled | `#B7B3D9` | disabled "Add Chore" button |
| Primary soft | `#ECEBF6` | "Today" pill bg, weekly chip bg |
| Canvas | `#FFFFFF` | cards, sheets |
| Surface soft | `#F4F4F6` | chip backgrounds, segmented-control track, cancel button |
| Surface strong | `#E7E7EC` | sheet grabber handle |
| App background | `#F5F5F8` | scroll area behind cards |
| Hairline | `#E0E0E5` | card borders (1.5px), input borders |
| Hairline soft | `#EFEFF2` | section-head divider line |
| Ink | `#0F0F1A` | primary text |
| Body | `#3F3F4D` | secondary text |
| Muted | `#6F6F7D` | tertiary text, icons |
| Muted soft | `#A0A0AB` | de-emphasized numerals, strikethrough color |
| **Destructive red** | `#E5484D` | swipe-delete background, edit-mode delete button icon, "Stop It Repeating" |
| Destructive red soft | `#FDECEC` | edit-mode delete button background |
| Destructive red border | `#F3C9CB` | "Delete Chore" outline button in editor |
| Carried-over chip bg / fg | `#FCEADF` / `#A23B12` | "Carried over" badge |

**Per-kid colors** (avatar fill, banner, rail accent):
| Kid | Color | Soft (tint) | Ink (on tint) | Initial |
|---|---|---|---|---|
| Nixon | `#5A4FD0` | `#ECEAFA` | `#2E2675` | N |
| Benson | `#1E9355` | `#E4F4EB` | `#0F5530` | B |
| Harrison | `#E0682F` | `#FBEADF` | `#8A3A14` | H |

### Typography
- **Display / UI:** `Mulish` (weights 400/500/600/700/800/900). Headlines weight **800**,
  tight tracking (-0.01em to -0.03em), **Title Case**.
- **Numerals:** `JetBrains Mono` weight 500, tabular (done counters, "n/total").
- Key sizes: date weekday **26px/800**; chore title **16px/800**; section heads
  **13px/800 uppercase, 0.06em tracking**; chips **12px/600–700**; body helper text 12–13.5px.

### Spacing / Radii / Shadow
- 4px base scale: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 48.
- Radii: cards **18px**; kid sections **20–22px**; sheets **26px** (top corners only);
  inputs & segmented control **9–12px**; pills/CTAs **100px (full)**; avatars/circles **50%**.
- Resting card shadow: `0 3px 10px rgba(15,15,26,0.04)`.
- Bottom sheet shadow: `0 -10px 40px rgba(15,15,26,0.18)`.
- FAB shadow: `0 8px 24px rgba(61,52,164,0.42)`.

### Icons
Lucide-style 1.5–2.6px strokes, drawn inline in `components.jsx` (`Icon` map):
`clock, repeat, carried (rotate-ccw), check, plus, x, arrowRight, sun, chevL, chevR,
undo, trash, pencil, minus, flag`. Re-use your codebase's icon set; geometry is standard Lucide.

---

## Screens / Views

There is **one primary screen** (the day view) with three layout variants, plus **two
bottom sheets** (chore editor, delete confirmation).

### 1. Day View (primary screen)
- **Purpose:** see and complete today's chores; navigate between days; add/edit/delete.
- **Layout (top → bottom):**
  - **Header** (`padding: 8px 18px 14px`):
    - Row 1, space-between: left = 4-tile logo glyph (2×2 grid of 18px, colors
      `#5A4FD0 / #1E9355 / #E0682F / #3D34A4`, 3px radius tiles) + "FAMILY CHORES"
      (13px/800 uppercase, muted). Right = **Edit toggle button** + **done counter**
      (`{done}/{total}` mono + "DONE" label).
    - Row 2 (day navigator): circular prev/next buttons (40px, 1.5px hairline border,
      white) flanking centered weekday (26px/800) + short date + relative-day pill
      ("Today"/"Tomorrow"/"In N days").
    - Optional "Back to today" indigo pill (only when not on today).
  - **Layout segmented control** (By Kid / By Task / By Time) — track bg surface-soft,
    active segment white with `0 1px 3px rgba(15,15,26,0.12)`.
  - **Chore list**, rendered per the active layout variant (below).
  - **FAB** (bottom-right, `right:18 bottom:30`, 58px indigo circle, white + icon).

- **Edit toggle button:** default state shows pencil icon + "Edit" (white bg, 1.5px
  hairline border, body text). Active state shows check + "Done" (indigo bg, white).

#### Layout variant A — By Kid
One section per kid (only kids with chores shown), in fixed order Nixon → Benson →
Harrison. Three selectable section styles (a Tweak, default **Banner**):
- **Banner:** colored header bar (kid color, white text, avatar + name 18px/800 + `done/total`),
  white card body below holding the chore rows. 22px radius, soft shadow.
- **Tinted:** whole section tinted in `kid.soft`, header inline (avatar + name in `kid.ink`).
- **Rail:** white card with a 6px colored left rail, 1.5px hairline border.

In By Kid, each chore row hides the assignee (it's implied) and shows a **rotation strip**
(3 mini avatars, current turn ringed) on the right instead.

#### Layout variant B — By Task
Flat list grouped into **To Do** then **Done** (`GroupHead` = icon + uppercase label +
count + divider rule). To-do sorted so carried-over and timed chores surface first. Rows
show the assignee avatar+name on the right.

#### Layout variant C — By Time
Grouped by time slot in order Morning → Afternoon → Evening → Anytime Today. Rows show
assignee on the right.

### 2. Chore Card (`TaskCard`) — the core list item
- **Layout:** flex row, `gap:13`, `padding:13px 15px`, 18px radius, white, 1.5px hairline
  border. Completed cards drop to `opacity:0.62` and strike through the title.
- **Left:** the **complete control** (see Interactions). **In edit mode** this is replaced
  by a 46px red-soft circle with a red minus icon (delete).
- **Center:** title (16px/800) + a row of **meta chips**:
  - `Carried over` (orange) if the chore rolled over uncompleted.
  - Time chip (`7:30 AM`) or `Anytime` (sun icon).
  - `Weekly` (indigo) for weekly cadence, or `One-time` (muted, flag icon) for one-off.
  - When **done**: a `{NextKid} next` chip (recurring) or `One-time` chip.
- **Right:** rotation strip (By Kid) or assignee avatar+name (By Task/Time). **In edit
  mode:** dim assignee avatar + a muted pencil circle (tap row to edit).

### 3. Chore Editor sheet (`Composer`) — add & edit
Bottom sheet (26px top radius, slides up via `translateY`). Title "New Chore" or "Edit
Chore". Fields:
- **Title** text input (autofocus, 52px, Enter submits).
- **Who Does It:** segmented "Rotates between kids" / "Always one kid" (hidden when
  cadence = One time), then a 3-up **kid picker** (active = 2px kid-color border +
  `kid.soft` bg), then a helper sentence.
- **Repeats:** segmented **One time / Daily / Weekly**.
- **When:** segmented Anytime / AM / Noon / PM, plus an optional exact-time text input.
- Primary button: "Add Chore" / "Save Changes" (disabled until title non-empty).
- **When editing only:** a red-outline **"Delete Chore"** button below; tapping it closes
  the editor and opens the delete confirmation.

### 4. Delete Confirmation sheet (`ConfirmDelete`)
Bottom sheet, centered title `Delete "{title}"?`.
- **Recurring chore (daily/weekly):** subtitle explains it repeats; two stacked option
  buttons:
  - **"Just Skip Today"** (neutral, outline) — subtext "It'll come back tomorrow."
  - **"Stop It Repeating"** (red `#E5484D`, filled) — subtext "Removes it for good."
- **One-time chore:** **this sheet is skipped entirely** — deletion is immediate.
- A muted **Cancel** button at the bottom.

---

## Interactions & Behavior

### Completing a chore (configurable — a Tweak, default Checkbox)
- **Checkbox:** tap the circle to toggle done.
- **Tap Row:** tap anywhere on the row toggles done (circle non-interactive).
- **Hold:** press-and-hold the circle ~620ms; a progress ring fills, then it completes.
  Avoids accidental taps. (See `CompleteButton` in `components.jsx`.)

### Deleting a chore — TWO entry points
1. **Swipe-to-delete (per-row gesture):** drag a chore row left. A red **Delete** action
   (trash icon + label, 86px wide) is revealed beneath. Tap it to trigger deletion.
   - Implementation notes: pointer drag with a 6px move threshold to distinguish tap from
     swipe; release past half-open snaps fully open, else closes; tapping an open row
     closes it. The red layer is only rendered while `dx < 0` so it never bleeds through
     the semi-transparent completed cards. Elements that shouldn't start a swipe
     (the complete button, the revealed Delete button) are marked `data-noswipe`.
2. **Edit mode (bulk):** tap **Edit** in the header. Every row shows a red minus delete
   button on the left; tapping the row body opens the editor. Swipe is disabled in edit mode.
3. The editor sheet also has a **Delete Chore** button.

All three funnel into `requestDelete(task)`:
- `cadence === 'once'` → delete immediately, no prompt.
- otherwise → open the **ConfirmDelete** sheet with the skip/stop choice.

### Delete semantics (IMPORTANT — these drive the data model)
- **Just Skip Today** → the chore is marked `skippedToday: true` for the current day only.
  It is **hidden from today's list and counts**, but returns **fresh tomorrow** (same kid,
  not flagged carried-over). It is NOT removed from data.
- **Stop It Repeating** (and one-time **Delete**) → the chore id is removed from **every
  stored day** (`deleteEverywhere`) so it never returns. *(Product decision flagged below:
  this also clears history. If you want "remove going forward only," scope the removal to
  days at offset ≥ current instead.)*

### Adding & editing
- **FAB** opens the editor in "new" mode (`editing = null`).
- **Edit mode row tap** / editor **Delete**/**Save** operate on `editing = task`.
- On **Save**, edits are applied to the matching id across **all stored days** so changes
  propagate to already-generated future days. Saving rebuilds the rotation `queue` from the
  chosen kid and resets `turn` to 0 (editing re-anchors the rotation).

### Day navigation & rollover (`advanceDay`)
State stores a snapshot per visited day. Moving forward past the furthest day generates the
next day from the current one:
- Finished **one-time** chores **disappear** (don't recur).
- A chore **skipped today** returns fresh tomorrow (same kid, `done:false`, `carried:false`).
- Completed **recurring** chores **rotate** to the next kid in their queue and reset `done`.
- Uncompleted chores **stay with the same kid** and are flagged `carried: true`.

### Animation
Sheets: `transform translateY` over 300ms `cubic-bezier(.4,0,.2,1)`, backdrop fade 200–220ms
with a 2px blur. Swipe row: `transform` 220ms (no transition while actively dragging).
Check fill: spring `cubic-bezier(.34,1.56,.64,1)`. No decorative/looping animation.

---

## State Management

Top-level app state (`app.jsx`):
- `st` — persisted: `{ days: { [offset]: Task[] }, offset, maxOffset }`. `offset 0` = anchor
  "Today"; negative not used; future days lazily generated. Persisted to `localStorage`
  (key `famchore_v4`) — replace with your real store/sync.
- `composerOpen` (bool), `editing` (Task | null) — chore editor.
- `editMode` (bool) — bulk edit/delete mode.
- `pendingDelete` (Task | null) — drives the ConfirmDelete sheet.
- Tweaks (`layout`, `kidStyle`, `mode`) — these are **prototype-only** presentation
  options exposed via the on-canvas panel; in production, pick the chosen defaults
  (By Kid / Banner / Checkbox) or expose as real settings if desired.

### Task shape
```js
{
  id: string,
  title: string,
  cadence: 'once' | 'daily' | 'weekly',
  time: string | null,            // e.g. "7:30 AM"; null = anytime
  slot: 'morning'|'afternoon'|'evening'|'anytime',
  queue: string[],                // kid ids in rotation order; length 1 = always one kid
  turn: number,                   // index into queue whose turn it is today
  done: boolean,
  carried: boolean,               // rolled over uncompleted
  skippedToday?: boolean,         // "skip just today" — hidden today, returns tomorrow
}
```
Helpers in `data.jsx`: `currentKid`, `nextKid`, `advanceDay`, `loadState/saveState/freshState`.

---

## Assets
No external image assets. The logo is a CSS 4-tile glyph (see Header). All icons are inline
SVG (`Icon` map in `components.jsx`). Fonts load from Google Fonts (`Mulish`, `JetBrains Mono`)
— swap for your app's font pipeline.

## Files (in this bundle)
- `Family Chores.html` — entry point: tokens (`:root` CSS vars), font imports, device stage,
  script load order.
- `data.jsx` — kids, seed chores, date helpers, `advanceDay` rollover rules, persistence.
- `components.jsx` — `Icon` map, `Avatar`, `RotationStrip`, `Chip`, `CompleteButton`,
  and **`TaskCard`** (swipe-to-delete + edit-mode affordances).
- `views.jsx` — `Header` (with Edit toggle), `GroupHead`, `KidSection` (3 styles),
  `ByKidView` / `ByTaskView` / `ByTimeView`.
- `composer.jsx` — `Seg`, `KidPicker`, `Field`, **`Composer`** (add/edit), **`ConfirmDelete`**.
- `app.jsx` — state, handlers (`toggle`, `addTask`, `saveTask`, `requestDelete`, `skipToday`,
  `deleteEverywhere`, day nav), layout switch, FAB, sheet wiring.
- `ios-frame.jsx`, `tweaks-panel.jsx` — **prototype scaffolding only** (device bezel + the
  on-canvas tweak panel). Do not port.

## Open product decision
"Stop It Repeating" currently removes the chore from all stored days (clears history too).
Confirm whether deletion should instead be **forward-only** (keep past completions for
streaks/history). One-line change in `deleteEverywhere`.
