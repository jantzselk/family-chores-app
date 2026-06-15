# Family Chores App

A mobile-first Progressive Web App (PWA) for families to manage, rotate, and track daily and weekly chores. Built for the Selk family — Nixon, Benson, and Harrison.

---

## Overview

Family Chores makes it easy to assign chores across multiple kids, rotate responsibilities fairly, and check off tasks throughout the day. The app works across all family devices in real time, with no accounts required — access is protected by a shared 4-digit PIN remembered per device.

### Key Features

- **Three view modes** — view today's chores By Kid, By Task, or By Time
- **Chore rotation** — chores can rotate between kids daily or stay assigned to one kid
- **Real-time sync** — all family devices stay in sync instantly via Supabase
- **Add / Edit / Delete chores** — with smart handling for recurring vs. one-time chores
- **Carried-over chores** — uncompleted chores roll over and are flagged the next day
- **PIN-gated access** — no accounts; a shared family PIN protects the app
- **PWA-ready** — installable on iOS and Android home screens with no browser chrome

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + CSS custom properties |
| Database & Real-time | Supabase (PostgreSQL + real-time subscriptions) |
| PWA | next-pwa |
| Hosting | Vercel |
| Icons | lucide-react |
| Fonts | Mulish (UI) + JetBrains Mono (numerals) |

---

## Project Structure

```
family-chores-app/
├── design_handoff_family_chores/   # Design reference prototypes (HTML/React/Babel)
│   ├── Family Chores.html          # Entry point with tokens and script load order
│   ├── app.jsx                     # App state and handlers
│   ├── views.jsx                   # Day view layouts (By Kid / By Task / By Time)
│   ├── components.jsx              # TaskCard, CompleteButton, Avatar, chips, icons
│   ├── composer.jsx                # Chore editor and delete confirmation sheets
│   ├── data.jsx                    # Data helpers, seed chores, rollover logic
│   ├── ios-frame.jsx               # Prototype scaffolding only — do not port
│   └── tweaks-panel.jsx            # Prototype scaffolding only — do not port
├── docs/
│   └── superpowers/specs/          # Design specs and architecture decisions
├── .gitignore
└── README.md
```

---

## Screens

### Day View (Home)
The primary screen shows today's chores with a day navigator to move forward/back. A segmented control switches between three layouts:
- **By Kid** — one section per kid (Nixon → Benson → Harrison) with avatar, name, and done counter
- **By Task** — flat list grouped into To Do and Done
- **By Time** — grouped by Morning, Afternoon, Evening, and Anytime

### Chore Editor (Bottom Sheet)
Opens via the FAB (add) or by tapping a row in edit mode. Fields include chore title, who does it (rotating or always one kid), cadence (one-time / daily / weekly), and time slot.

### Delete Confirmation (Bottom Sheet)
For recurring chores, prompts the user to either "Just Skip Today" (returns tomorrow) or "Stop It Repeating" (removes permanently). One-time chores are deleted immediately with no prompt.

### PIN Setup & Unlock
First-time setup creates a shared family PIN. Subsequent visits on new devices require the PIN before accessing the app.

---

## Chore Logic

### Assignment Modes
| Mode | Behavior |
|---|---|
| Rotating | One chore card; turn advances to the next kid on completion |
| Individual | Each kid gets their own card; checked off independently |
| Paired | Two kids share a card; turn advances together |

### Day Rollover
When navigating to a new day:
- Completed one-time chores disappear
- Skipped chores return fresh (same kid, not carried)
- Completed recurring chores rotate to the next kid
- Uncompleted recurring chores stay with the same kid and are flagged as "carried over"

### Delete Semantics
- **Just Skip Today** — marks `skippedToday: true`; hidden today, returns tomorrow
- **Stop It Repeating** — sets `active: false` on the task; never appears again

---

## Design System

The visual system follows the **SageMedic Design System** with an indigo primary palette, Mulish typography, and JetBrains Mono for numerals.

Full design tokens, component specs, and interaction behavior are documented in:
`design_handoff_family_chores/README.md`

### Kid Colors
| Kid | Color | Hex |
|---|---|---|
| Nixon | Indigo | `#5A4FD0` |
| Benson | Green | `#1E9355` |
| Harrison | Orange | `#E0682F` |

---

## Design Handoff Notes

The files in `design_handoff_family_chores/` are **HTML/React-via-Babel prototypes** — they are design references, not production code. They show the intended layout, tokens, copy, and interaction logic. Recreate these designs in the target production codebase using its own component patterns and data layer.

The `ios-frame.jsx` and `tweaks-panel.jsx` files are prototype scaffolding only and should not be ported to production.

---

## Database Schema (Supabase)

Three tables power the app:

- **`config`** — stores the bcrypt-hashed family PIN
- **`tasks`** — canonical chore definitions (title, cadence, slot, assignment mode, rotation queue)
- **`day_snapshots`** — per-day completion state (done, carried, skipped) as JSONB; real-time subscriptions on this table keep all devices in sync

---

## Open Design Decision

"Stop It Repeating" currently removes the chore from **all** stored days, including past history. Confirm whether deletion should instead be **forward-only** (preserving past completions for streaks or history tracking). This is a one-line change in `deleteEverywhere`.
