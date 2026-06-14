// data.jsx — kids, seed chores, persistence, date helpers
// Per-task rotation queue: completing a task advances it to the next kid tomorrow.
// Uncompleted tasks carry over to the SAME kid the next day.

const KIDS = {
  nixon:    { id: 'nixon',    name: 'Nixon',    initial: 'N', color: '#5A4FD0', soft: '#ECEAFA', ink: '#2E2675' },
  benson:   { id: 'benson',   name: 'Benson',   initial: 'B', color: '#1E9355', soft: '#E4F4EB', ink: '#0F5530' },
  harrison: { id: 'harrison', name: 'Harrison', initial: 'H', color: '#E0682F', soft: '#FBEADF', ink: '#8A3A14' },
};
const KID_ORDER = ['nixon', 'benson', 'harrison'];

// Time slots for the "By Time" layout
const SLOTS = {
  morning:   { id: 'morning',   label: 'Morning' },
  afternoon: { id: 'afternoon', label: 'Afternoon' },
  evening:   { id: 'evening',   label: 'Evening' },
  anytime:   { id: 'anytime',   label: 'Anytime Today' },
};

// Seed chores. queue = rotation order; turn = index of whose turn it is today.
const SEED_TASKS = [
  { id: 't1', title: 'Feed The Dog',            cadence: 'daily',  time: '7:30 AM',  slot: 'morning',   queue: ['nixon','benson','harrison'],   turn: 0, done: false, carried: false },
  { id: 't2', title: 'Empty The Dishwasher',    cadence: 'daily',  time: null,       slot: 'morning',   queue: ['benson','harrison','nixon'],   turn: 0, done: true,  carried: false },
  { id: 't3', title: 'Pack School Bags',        cadence: 'daily',  time: '8:00 AM',  slot: 'morning',   queue: ['harrison','nixon','benson'],   turn: 0, done: false, carried: false },
  { id: 't4', title: 'Tidy The Living Room',    cadence: 'daily',  time: null,       slot: 'afternoon', queue: ['benson','nixon','harrison'],   turn: 0, done: false, carried: false },
  { id: 't5', title: 'Set The Dinner Table',    cadence: 'daily',  time: '5:30 PM',  slot: 'evening',   queue: ['nixon','harrison','benson'],   turn: 0, done: false, carried: false },
  { id: 't6', title: 'Take Out Trash & Recycling', cadence: 'daily', time: null,     slot: 'evening',   queue: ['harrison','benson','nixon'],   turn: 0, done: false, carried: true  },
  { id: 't7', title: 'Wipe Kitchen Counters',   cadence: 'daily',  time: null,       slot: 'evening',   queue: ['nixon','benson','harrison'],   turn: 1, done: false, carried: false },
  { id: 't8', title: 'Vacuum Upstairs',         cadence: 'weekly', time: null,       slot: 'anytime',   queue: ['benson','harrison','nixon'],   turn: 0, done: false, carried: false },
  { id: 't9', title: 'Clean The Bathroom',      cadence: 'weekly', time: null,       slot: 'anytime',   queue: ['harrison','nixon','benson'],   turn: 0, done: false, carried: false },
  { id: 't10', title: 'Return Library Books',   cadence: 'once',   time: null,       slot: 'anytime',   queue: ['nixon'],                       turn: 0, done: false, carried: false },
];

// ── helpers ───────────────────────────────────────────────
const BASE_DATE = new Date(2026, 5, 6); // Sat Jun 6 2026

function dateForOffset(offset) {
  const d = new Date(BASE_DATE);
  d.setDate(d.getDate() + offset);
  return d;
}
function fmtDate(d) {
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const mons = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return { weekday: days[d.getDay()], short: `${mons[d.getMonth()]} ${d.getDate()}` };
}
function relativeDay(offset) {
  if (offset === 0) return 'Today';
  if (offset === 1) return 'Tomorrow';
  return `In ${offset} days`;
}
function currentKid(task) { return KIDS[task.queue[task.turn % task.queue.length]]; }
function nextKid(task)    { return KIDS[task.queue[(task.turn + 1) % task.queue.length]]; }

// Advance one calendar day:
//   • finished one-time chores disappear (they don't recur)
//   • a chore skipped "just today" returns fresh tomorrow, same kid, not carried
//   • completed recurring chores rotate to the next kid & reset
//   • uncompleted chores stay with the same kid and are flagged carried-over
function advanceDay(tasks) {
  return tasks
    .filter(t => !(t.done && t.cadence === 'once'))
    .map(t => {
      const base = { ...t, skippedToday: false };
      if (t.skippedToday) return { ...base, done: false, carried: false };
      if (t.done)         return { ...base, turn: (t.turn + 1) % t.queue.length, done: false, carried: false };
      return { ...base, carried: true };
    });
}

// ── persistence ───────────────────────────────────────────
// State keeps a snapshot of every day visited, so navigation is reversible:
//   days   = { [offset]: tasks[] }  — one stored day per offset
//   offset = which day is currently being viewed (0 = the anchor "Today")
//   maxOffset = furthest day generated so far
const STORE_KEY = 'famchore_v4';
function freshState() {
  return { days: { 0: SEED_TASKS.map(t => ({ ...t })) }, offset: 0, maxOffset: 0 };
}
function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (p && p.days && p.days[p.offset]) return p;
    }
  } catch (e) {}
  return freshState();
}
function saveState(state) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
}

Object.assign(window, {
  KIDS, KID_ORDER, SLOTS, SEED_TASKS,
  dateForOffset, fmtDate, relativeDay, currentKid, nextKid, advanceDay,
  loadState, saveState, freshState, STORE_KEY,
});
