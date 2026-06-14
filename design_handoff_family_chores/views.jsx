// views.jsx — Header, layout views (By Kid / By Task / By Time), KidSection styles, Composer
const { useState: useStateV } = React;

// ── Header ────────────────────────────────────────────────
function Header({ dateObj, relLabel, doneCount, total, offset, onPrev, onNext, onToday, editMode, onToggleEdit }) {
  const atStart = offset === 0;
  const isToday = offset === 0;
  const navBtn = (dir, onClick, disabled) => (
    <button onClick={disabled ? undefined : onClick} aria-label={dir === 'prev' ? 'Previous day' : 'Next day'} style={{
      width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
      border: '1.5px solid var(--color-hairline)', background: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.35 : 1,
      transition: 'opacity 140ms ease, background 140ms ease',
    }}>{(dir === 'prev' ? Icon.chevL : Icon.chevR)({ s: 20, c: 'var(--color-ink)' })}</button>
  );

  return (
    <div style={{ padding: '8px 18px 14px' }}>
      {/* brand + done counter */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, width: 18, height: 18 }}>
            <span style={{ background: '#5A4FD0', borderRadius: 3 }} />
            <span style={{ background: '#1E9355', borderRadius: 3 }} />
            <span style={{ background: '#E0682F', borderRadius: 3 }} />
            <span style={{ background: 'var(--color-primary)', borderRadius: 3 }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.02em', color: 'var(--color-muted)', textTransform: 'uppercase' }}>Family Chores</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={onToggleEdit} style={{
            display: 'inline-flex', alignItems: 'center', gap: 5, height: 30, padding: '0 12px',
            borderRadius: 100, cursor: 'pointer', fontFamily: 'var(--font-sans)',
            fontSize: 12.5, fontWeight: 800, transition: 'all 140ms ease',
            border: editMode ? 'none' : '1.5px solid var(--color-hairline)',
            background: editMode ? 'var(--color-primary)' : '#fff',
            color: editMode ? '#fff' : 'var(--color-body)',
          }}>
            {editMode ? Icon.check({ s: 14, c: '#fff', w: 3 }) : Icon.pencil({ s: 13, c: 'var(--color-body)' })}
            {editMode ? 'Done' : 'Edit'}
          </button>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 18, color: 'var(--color-ink)' }}>
              {doneCount}<span style={{ color: 'var(--color-muted-soft)' }}>/{total}</span>
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Done</span>
          </div>
        </div>
      </div>

      {/* day navigator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
        {navBtn('prev', onPrev, atStart)}
        <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.03em', color: 'var(--color-ink)', lineHeight: 1.05 }}>{dateObj.weekday}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 4 }}>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-muted)' }}>{dateObj.short}</span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', height: 20, padding: '0 9px', borderRadius: 100,
              background: isToday ? 'var(--color-primary-soft)' : 'var(--color-surface-soft)',
              color: isToday ? 'var(--color-primary)' : 'var(--color-muted)',
              fontSize: 11.5, fontWeight: 800, letterSpacing: '0.01em',
            }}>{relLabel}</span>
          </div>
        </div>
        {navBtn('next', onNext, false)}
      </div>

      {/* jump back to today */}
      {!isToday && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
          <button onClick={onToday} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, height: 30, padding: '0 14px',
            borderRadius: 100, border: 'none', background: 'var(--color-primary)', color: '#fff',
            fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)',
            boxShadow: '0 4px 12px rgba(61,52,164,0.28)',
          }}>{Icon.undo({ s: 13, c: '#fff' })} Back to today</button>
        </div>
      )}
    </div>
  );
}

// ── Section heading (By Task / By Time) ───────────────────
function GroupHead({ label, icon, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 4px 10px' }}>
      {icon}
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-muted-soft)' }}>{count}</span>
      <div style={{ flex: 1, height: 1.5, background: 'var(--color-hairline-soft)', marginLeft: 4 }} />
    </div>
  );
}

// ── KidSection (3 styles) — used by the By Kid layout ─────
function KidSection({ kid, tasks, style, mode, onToggle, onDelete, onEdit, editMode }) {
  const done = tasks.filter(t => t.done).length;
  const counter = (
    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 13 }}>{done}/{tasks.length}</span>
  );
  const cards = tasks.map(t => <TaskCard key={t.id} task={t} mode={mode} showAssignee={false} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} editMode={editMode} />);

  if (style === 'banner') {
    return (
      <section style={{ borderRadius: 22, overflow: 'hidden', boxShadow: '0 4px 16px rgba(15,15,26,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '13px 16px', background: kid.color, color: '#fff' }}>
          <Avatar kid={{ ...kid, color: 'rgba(255,255,255,0.22)' }} size={32} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, flex: 1 }}>{kid.name}</span>
          <span style={{ opacity: 0.9 }}>{counter}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, padding: 11, background: '#fff' }}>{cards}</div>
      </section>
    );
  }
  if (style === 'tinted') {
    return (
      <section style={{ borderRadius: 22, background: kid.soft, padding: 13 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '2px 4px 12px' }}>
          <Avatar kid={kid} size={34} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, flex: 1, color: kid.ink }}>{kid.name}</span>
          <span style={{ color: kid.ink }}>{counter}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>{cards}</div>
      </section>
    );
  }
  // rail
  return (
    <section style={{ display: 'flex', gap: 0, borderRadius: 20, overflow: 'hidden', border: '1.5px solid var(--color-hairline)', background: '#fff' }}>
      <div style={{ width: 6, background: kid.color, flexShrink: 0 }} />
      <div style={{ flex: 1, padding: 13 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '2px 2px 12px' }}>
          <Avatar kid={kid} size={30} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, flex: 1, color: 'var(--color-ink)' }}>{kid.name}</span>
          <span style={{ color: kid.ink }}>{counter}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>{cards}</div>
      </div>
    </section>
  );
}

// ── Layout: By Kid ────────────────────────────────────────
function ByKidView({ tasks, kidStyle, mode, onToggle, onDelete, onEdit, editMode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
      {KID_ORDER.map(id => {
        const kid = KIDS[id];
        const mine = tasks.filter(t => currentKid(t).id === id);
        if (!mine.length) return null;
        return <KidSection key={id} kid={kid} tasks={mine} style={kidStyle} mode={mode} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} editMode={editMode} />;
      })}
    </div>
  );
}

// ── Layout: By Task (flat, to-do then done) ───────────────
function ByTaskView({ tasks, mode, onToggle, onDelete, onEdit, editMode }) {
  const score = t => (t.carried ? 0 : 1) * 1 + (t.time ? 0 : 1) * 2;
  const todo = tasks.filter(t => !t.done).sort((a, b) => score(a) - score(b));
  const done = tasks.filter(t => t.done);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <GroupHead label="To Do" icon={Icon.sun({ s: 15, c: 'var(--color-primary)' })} count={todo.length} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {todo.map(t => <TaskCard key={t.id} task={t} mode={mode} showAssignee onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} editMode={editMode} />)}
        </div>
      </div>
      {done.length > 0 && (
        <div>
          <GroupHead label="Done" icon={Icon.check({ s: 15, c: 'var(--color-muted)', w: 3 })} count={done.length} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {done.map(t => <TaskCard key={t.id} task={t} mode={mode} showAssignee onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} editMode={editMode} />)}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Layout: By Time ───────────────────────────────────────
function ByTimeView({ tasks, mode, onToggle }) {
  const order = ['morning', 'afternoon', 'evening', 'anytime'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {order.map(slot => {
        const group = tasks.filter(t => t.slot === slot);
        if (!group.length) return null;
        return (
          <div key={slot}>
            <GroupHead label={SLOTS[slot].label} icon={Icon.clock({ s: 15, c: 'var(--color-primary)' })} count={group.length} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {group.map(t => <TaskCard key={t.id} task={t} mode={mode} showAssignee onToggle={onToggle} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { Header, GroupHead, KidSection, ByKidView, ByTaskView, ByTimeView });
