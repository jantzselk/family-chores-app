# Family Chore Rotation App — Design Spec

**Date:** 2026-06-07  
**Status:** Approved

---

## Overview

A mobile-first PWA for a family (Nixon, Benson, Harrison) to track and rotate daily/weekly chores. Multiple family devices sync in real time. No accounts — access is gated by a shared 4-digit PIN, remembered per device.

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + CSS custom properties |
| Database + real-time | Supabase (PostgreSQL + real-time subscriptions) |
| PWA | next-pwa |
| Hosting | Vercel |
| Icons | lucide-react |
| Fonts | Mulish (UI) + JetBrains Mono (numerals) via next/font |

---

## Design Tokens

Source of truth: `design_handoff_family_chores/README.md` and `Family Chores.html`.

### Colors
| Token | Hex | Use |
|-------|-----|-----|
| Primary | `#3D34A4` | FAB, buttons, active states |
| Primary active | `#2C238A` | pressed primary |
| Primary disabled | `#B7B3D9` | disabled button |
| Primary soft | `#ECEBF6` | pill bg, chip bg |
| Canvas | `#FFFFFF` | cards, sheets |
| Surface soft | `#F4F4F6` | chip bg, segmented track |
| Surface strong | `#E7E7EC` | sheet handle |
| App bg | `#F5F5F8` | scroll area |
| Hairline | `#E0E0E5` | card borders (1.5px) |
| Hairline soft | `#EFEFF2` | section divider |
| Ink | `#0F0F1A` | primary text |
| Body | `#3F3F4D` | secondary text |
| Muted | `#6F6F7D` | tertiary text, icons |
| Muted soft | `#A0A0AB` | de-emphasized numerals |
| Destructive | `#E5484D` | delete actions |
| Destructive soft | `#FDECEC` | delete button bg |
| Destructive border | `#F3C9CB` | delete outline |
| Carried bg/fg | `#FCEADF` / `#A23B12` | carried-over chip |

**Per-kid:**
| Kid | Color | Soft | Ink |
|-----|-------|------|-----|
| Nixon | `#5A4FD0` | `#ECEAFA` | `#2E2675` |
| Benson | `#1E9355` | `#E4F4EB` | `#0F5530` |
| Harrison | `#E0682F` | `#FBEADF` | `#8A3A14` |

### Typography
- Headlines: Mulish 800, -0.01 to -0.03em tracking, Title Case
- Numerals: JetBrains Mono 500, tabular
- Key sizes: date 26px/800, chore title 16px/800, section heads 13px/800 uppercase 0.06em, chips 12px/600-700

### Spacing / Radii / Shadows
- Scale: 4/8/12/16/20/24/32/48px
- Radii: cards 18px, kid sections 20-22px, sheets 26px top-only, inputs 9-12px, pills 100px
- Card shadow: `0 3px 10px rgba(15,15,26,0.04)`
- Sheet shadow: `0 -10px 40px rgba(15,15,26,0.18)`
- FAB shadow: `0 8px 24px rgba(61,52,164,0.42)`

---

## Database Schema

### `config`
One row. Stores bcrypt-hashed PIN.
```sql
CREATE TABLE config (
  id         integer PRIMARY KEY DEFAULT 1,
  pin_hash   text NOT NULL,
  updated_at timestamptz DEFAULT now()
);
```

### `tasks`
Canonical task definitions. Editing a task propagates to all future day renders.
```sql
CREATE TABLE tasks (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL,
  cadence         text NOT NULL CHECK (cadence IN ('once','daily','weekly')),
  slot            text NOT NULL CHECK (slot IN ('morning','afternoon','evening','anytime')),
  time            text,
  assignment_mode text NOT NULL CHECK (assignment_mode IN ('individual','rotating','paired')),
  queue           text[] NOT NULL,
  turn            integer NOT NULL DEFAULT 0,
  group_id        uuid,
  active          boolean NOT NULL DEFAULT true,
  created_at      timestamptz DEFAULT now()
);
```

### `day_snapshots`
Per-day completion state. Real-time subscriptions on this table.
```sql
CREATE TABLE day_snapshots (
  day_date   date PRIMARY KEY,
  snapshot   jsonb NOT NULL DEFAULT '[]',
  updated_at timestamptz DEFAULT now()
);
```

Snapshot item shape: `{ task_id, done, carried, skipped, turn_snapshot }`

---

## Assignment Modes

| Mode | Storage | Behavior |
|------|---------|----------|
| `individual` | 3 task records sharing a `group_id`, each `queue: ['<one kid>']` | Each kid gets their own card; checks off independently |
| `rotating` | 1 record, `queue: ['nixon','benson','harrison']`, `turn` advances on completion | Single card, rotation strip shows current kid |
| `paired` | 1 record, `queue: ['nixon','benson','harrison']`, `turn` advances on completion | Pair = `queue[turn]` + `queue[(turn+1)%3]`; one shared card showing both avatars |

---

## Screens

### `/` — Day View
- Auth-gated via middleware (→ `/unlock` or `/setup`)
- Default layout: By Kid (Banner style)
- Layout tab bar: By Kid / By Task / By Time
- Header: logo, edit toggle, done counter, day navigator
- FAB: 58px indigo, bottom-right

### `/setup` — First-time PIN creation
- Only shown when `config` table has no row
- Large numeric keypad, confirm PIN step

### `/unlock` — PIN entry
- Shown on devices with no session
- Correct PIN → `localStorage.pinVerified = true` → redirect to `/`

---

## Key Interactions

### Completing a chore
Checkbox tap → optimistic toggle in local state → upsert `day_snapshots`. For rotating/paired modes, also increments `tasks.turn`.

### Day rollover (`buildNextDay`)
Triggered on navigating past the last-visited date:
- One-time done → excluded
- Skipped → returns fresh (done:false, carried:false)
- Completed recurring → rotate turn, reset done
- Uncompleted recurring → same kid, carried:true

### Delete flow
- One-time: immediate delete
- Recurring: ConfirmDelete sheet → "Just Skip Today" (skipped:true in snapshot) or "Stop It Repeating" (active:false on task)

### Edit mode
Pencil icon in header → all cards show red minus (delete) on left; tapping row body opens Composer. Swipe-to-delete disabled in edit mode.

### PIN management
Settings sheet (gear icon in header): Change PIN (requires current PIN) + Lock This Device (clears localStorage session).

---

## Real-Time Sync
Supabase real-time subscription on `day_snapshots WHERE day_date = today`. Any completion on one device broadcasts to all others instantly. Optimistic updates for local responsiveness.

---

## PWA
- `next-pwa` with service worker
- Manifest: name "Family Chores", display "standalone", theme `#3D34A4`, bg `#F5F5F8`
- Add-to-homescreen on iOS Safari → no browser chrome
