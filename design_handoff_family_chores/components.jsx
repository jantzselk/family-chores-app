// components.jsx — atoms: icons, Avatar, badges, CompleteButton, TaskCard
const { useState, useRef, useEffect } = React;

// ── Icons (Lucide-style strokes) ──────────────────────────
const Icon = {
  clock: (p={}) => (<svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth={p.w||2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>),
  repeat: (p={}) => (<svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth={p.w||2} strokeLinecap="round" strokeLinejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>),
  carried: (p={}) => (<svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth={p.w||2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>),
  check: (p={}) => (<svg width={p.s||22} height={p.s||22} viewBox="0 0 24 24" fill="none" stroke={p.c||'#fff'} strokeWidth={p.w||3} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>),
  plus: (p={}) => (<svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth={p.w||2.4} strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>),
  x: (p={}) => (<svg width={p.s||18} height={p.s||18} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth={p.w||2.4} strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>),
  arrowRight: (p={}) => (<svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth={p.w||2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>),
  sun: (p={}) => (<svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth={p.w||2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>),
  chevL: (p={}) => (<svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth={p.w||2.4} strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>),
  chevR: (p={}) => (<svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth={p.w||2.4} strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>),
  undo: (p={}) => (<svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth={p.w||2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-1"/></svg>),
  trash: (p={}) => (<svg width={p.s||18} height={p.s||18} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth={p.w||2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6"/><path d="M10 11v6M14 11v6"/></svg>),
  pencil: (p={}) => (<svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth={p.w||2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>),
  minus: (p={}) => (<svg width={p.s||18} height={p.s||18} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth={p.w||2.6} strokeLinecap="round"><path d="M5 12h14"/></svg>),
  flag: (p={}) => (<svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth={p.w||2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/></svg>),
};

// ── Avatar — initial in colored circle ───────────────────
function Avatar({ kid, size = 34, ring = false, dim = false }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: dim ? kid.soft : kid.color,
      color: dim ? kid.ink : '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: size * 0.42,
      letterSpacing: '-0.02em',
      boxShadow: ring ? `0 0 0 3px #fff, 0 0 0 5px ${kid.color}` : 'none',
    }}>{kid.initial}</div>
  );
}

// ── Rotation strip — three mini avatars, current ringed ──
function RotationStrip({ task }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {task.queue.map((kidId, i) => {
        const k = KIDS[kidId];
        const isCurrent = i === task.turn % task.queue.length;
        return (
          <div key={kidId} title={k.name} style={{
            width: 18, height: 18, borderRadius: '50%',
            background: isCurrent ? k.color : k.soft,
            color: isCurrent ? '#fff' : k.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 9.5,
            opacity: isCurrent ? 1 : 0.7,
            boxShadow: isCurrent ? `0 0 0 2px #fff, 0 0 0 3.5px ${k.color}` : 'none',
            position: 'relative', zIndex: isCurrent ? 2 : 1,
          }}>{k.initial}</div>
        );
      })}
    </div>
  );
}

// ── Badge / chip ──────────────────────────────────────────
function Chip({ icon, label, bg, fg, bold }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, height: 24,
      padding: '0 9px', borderRadius: 100, background: bg, color: fg,
      fontSize: 12, fontWeight: bold ? 700 : 600, lineHeight: 1, whiteSpace: 'nowrap',
    }}>
      {icon}{label}
    </span>
  );
}

// ── Complete button (checkbox + hold modes) ───────────────
function CompleteButton({ mode, done, color, soft, onToggle, interactive = true, size = 46 }) {
  const [progress, setProgress] = useState(0);
  const raf = useRef(null); const startT = useRef(0);
  const HOLD_MS = 620;
  const inner = size - 6;
  const r = (size - 4) / 2;
  const circ = 2 * Math.PI * r;

  function clear() { if (raf.current) cancelAnimationFrame(raf.current); raf.current = null; setProgress(0); }
  function begin() {
    if (done || mode !== 'hold') return;
    startT.current = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - startT.current) / HOLD_MS);
      setProgress(p);
      if (p >= 1) { clear(); onToggle(); }
      else raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }
  useEffect(() => () => clear(), []);

  const isHold = mode === 'hold' && !done;
  const handlers = !interactive ? {} : isHold
    ? { onPointerDown: begin, onPointerUp: clear, onPointerLeave: clear, onPointerCancel: clear }
    : { onClick: (e) => { e.stopPropagation(); onToggle(); } };

  return (
    <button {...handlers} aria-label={done ? 'Mark not done' : 'Mark done'} style={{
      width: size, height: size, padding: 0, border: 'none', background: 'transparent',
      position: 'relative', flexShrink: 0, cursor: interactive ? 'pointer' : 'default',
      touchAction: 'none', WebkitTapHighlightColor: 'transparent',
      pointerEvents: interactive ? 'auto' : 'none',
    }}>
      {/* progress ring while holding */}
      {progress > 0 && (
        <svg width={size} height={size} style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={circ} strokeDashoffset={circ * (1 - progress)} strokeLinecap="round" />
        </svg>
      )}
      {/* the circle */}
      <div style={{
        position: 'absolute', top: 3, left: 3, width: inner, height: inner, borderRadius: '50%',
        background: done ? color : '#fff',
        boxShadow: done ? 'none' : `inset 0 0 0 2.5px ${soft}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 180ms ease',
      }}>
        <div style={{
          transform: done ? 'scale(1)' : 'scale(0.4)', opacity: done ? 1 : 0,
          transition: 'transform 200ms cubic-bezier(.34,1.56,.64,1), opacity 160ms ease',
        }}>
          {Icon.check({ s: inner * 0.6, c: '#fff', w: 3.4 })}
        </div>
        {/* faint hint dot when empty */}
        {!done && progress === 0 && (
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: soft }} />
        )}
      </div>
    </button>
  );
}

// ── Task card (swipe-to-delete + edit mode) ───────────────
const SWIPE_OPEN = 86;
function TaskCard({ task, mode, showAssignee, onToggle, onDelete, onEdit, editMode }) {
  const kid = currentKid(task);
  const next = nextKid(task);
  const tapMode = mode === 'tap';

  const [dx, setDx] = useState(0);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startDx = useRef(0);
  const moved = useRef(false);

  // collapse any open swipe when entering edit mode
  useEffect(() => { if (editMode) setDx(0); }, [editMode]);

  function onDown(e) {
    if (editMode || e.target.closest('[data-noswipe]')) return;
    dragging.current = true; moved.current = false;
    startX.current = e.clientX; startDx.current = dx;
  }
  function onMove(e) {
    if (!dragging.current) return;
    const delta = e.clientX - startX.current;
    if (Math.abs(delta) > 6) moved.current = true;
    setDx(Math.max(-SWIPE_OPEN - 16, Math.min(0, startDx.current + delta)));
  }
  function onUp() {
    if (!dragging.current) return;
    dragging.current = false;
    setDx(dx < -SWIPE_OPEN / 2 ? -SWIPE_OPEN : 0);
  }

  function handleBodyClick() {
    if (moved.current) return;            // it was a swipe, not a tap
    if (dx !== 0) { setDx(0); return; }   // tap closes a revealed Delete
    if (editMode) { onEdit(task); return; }
    if (tapMode) onToggle(task.id);
  }

  const meta = [];
  if (task.done) {
    if (task.cadence !== 'once') meta.push(<Chip key="next" icon={Icon.arrowRight({ s: 12, c: next.ink })} label={`${next.name} next`} bg={next.soft} fg={next.ink} bold />);
    else meta.push(<Chip key="done1" icon={Icon.flag({ s: 12, c: 'var(--color-muted)' })} label="One-time" bg="var(--color-surface-soft)" fg="var(--color-muted)" />);
  } else {
    if (task.carried) meta.push(<Chip key="c" icon={Icon.carried({ s: 12, c: '#A23B12' })} label="Carried over" bg="#FCEADF" fg="#A23B12" bold />);
    if (task.time)    meta.push(<Chip key="t" icon={Icon.clock({ s: 12, c: 'var(--color-muted)' })} label={task.time} bg="var(--color-surface-soft)" fg="var(--color-body)" />);
    else              meta.push(<Chip key="a" icon={Icon.sun({ s: 12, c: 'var(--color-muted)' })} label="Anytime" bg="var(--color-surface-soft)" fg="var(--color-muted)" />);
    if (task.cadence === 'weekly')    meta.push(<Chip key="w" icon={Icon.repeat({ s: 12, c: 'var(--color-primary)' })} label="Weekly" bg="var(--color-primary-soft)" fg="var(--color-primary)" />);
    else if (task.cadence === 'once') meta.push(<Chip key="o" icon={Icon.flag({ s: 12, c: 'var(--color-muted)' })} label="One-time" bg="var(--color-surface-soft)" fg="var(--color-muted)" />);
  }

  return (
    <div style={{
      position: 'relative', borderRadius: 18, overflow: 'hidden',
      boxShadow: task.done || editMode ? 'none' : '0 3px 10px rgba(15,15,26,0.04)',
    }}>
      {/* red delete action revealed underneath on swipe */}
      {!editMode && dx < 0 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'flex-end', background: '#E5484D' }}>
          <button data-noswipe onClick={() => { setDx(0); onDelete(task); }} aria-label="Delete chore" style={{
            width: SWIPE_OPEN, border: 'none', background: 'transparent', color: '#fff',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
            cursor: 'pointer', fontFamily: 'var(--font-sans)',
          }}>
            {Icon.trash({ s: 20, c: '#fff' })}
            <span style={{ fontSize: 11.5, fontWeight: 800 }}>Delete</span>
          </button>
        </div>
      )}

      {/* foreground card */}
      <div
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
        onClick={handleBodyClick}
        style={{
          position: 'relative', display: 'flex', alignItems: 'center', gap: 13,
          padding: '13px 15px', borderRadius: 18,
          background: '#fff', border: '1.5px solid var(--color-hairline)',
          opacity: task.done ? 0.62 : 1,
          transform: `translateX(${dx}px)`,
          transition: dragging.current ? 'none' : 'transform 220ms cubic-bezier(.4,0,.2,1), opacity 200ms ease',
          cursor: editMode || tapMode ? 'pointer' : 'default',
          touchAction: 'pan-y', WebkitTapHighlightColor: 'transparent',
        }}>
        {editMode
          ? <button data-noswipe onClick={(e) => { e.stopPropagation(); onDelete(task); }} aria-label="Delete chore" style={{
              width: 46, height: 46, borderRadius: '50%', flexShrink: 0, border: 'none',
              background: '#FDECEC', color: '#E5484D', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{Icon.minus({ s: 22, c: '#E5484D' })}</button>
          : <span data-noswipe style={{ display: 'inline-flex' }}>
              <CompleteButton mode={mode} done={task.done} color={kid.color} soft={kid.soft}
                interactive={!tapMode} onToggle={() => onToggle(task.id)} />
            </span>}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, letterSpacing: '-0.01em',
            color: 'var(--color-ink)', textDecoration: task.done ? 'line-through' : 'none',
            textDecorationColor: 'var(--color-muted-soft)',
          }}>{task.title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
            {meta}
          </div>
        </div>

        {editMode
          ? <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <Avatar kid={kid} size={28} dim />
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--color-surface-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {Icon.pencil({ s: 15, c: 'var(--color-muted)' })}
              </div>
            </div>
          : showAssignee
            ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <Avatar kid={kid} size={32} dim={task.done} />
                <span style={{ fontSize: 11, fontWeight: 700, color: task.done ? 'var(--color-muted-soft)' : kid.ink }}>{kid.name}</span>
              </div>
            : <RotationStrip task={task} />}
      </div>
    </div>
  );
}

Object.assign(window, { Icon, Avatar, RotationStrip, Chip, CompleteButton, TaskCard });
