// app.jsx — main application: state, tweaks, layout switch, FAB
const { useState: useStateA, useEffect: useEffectA, useRef: useRefA } = React;

const LAYOUTS = [
  { value: 'By Kid',  key: 'kid' },
  { value: 'By Task', key: 'task' },
  { value: 'By Time', key: 'time' },
];
const KIDSTYLE_KEY = { 'Banner': 'banner', 'Tinted': 'tinted', 'Rail': 'rail' };
const MODE_KEY = { 'Checkbox': 'checkbox', 'Tap Row': 'tap', 'Hold': 'hold' };

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "layout": "By Kid",
  "kidStyle": "Banner",
  "mode": "Checkbox"
}/*EDITMODE-END*/;

function FAB({ onClick }) {
  return (
    <button onClick={onClick} aria-label="Add chore" style={{
      position: 'absolute', right: 18, bottom: 30, zIndex: 40,
      width: 58, height: 58, borderRadius: '50%', border: 'none', cursor: 'pointer',
      background: 'var(--color-primary)', color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 8px 24px rgba(61,52,164,0.42)',
    }}>{Icon.plus({ s: 26, c: '#fff', w: 2.6 })}</button>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [st, setSt] = useStateA(() => loadState());
  const [composerOpen, setComposerOpen] = useStateA(false);
  const [editing, setEditing] = useStateA(null);     // task being edited, or null for "new"
  const [editMode, setEditMode] = useStateA(false);   // bulk edit/delete mode
  const [pendingDelete, setPendingDelete] = useStateA(null); // task awaiting delete confirmation

  useEffectA(() => { saveState(st); }, [st]);

  const layoutKey = (LAYOUTS.find(l => l.value === t.layout) || LAYOUTS[0]).key;
  const kidStyle = KIDSTYLE_KEY[t.kidStyle] || 'banner';
  const mode = MODE_KEY[t.mode] || 'checkbox';

  const allTasks = st.days[st.offset] || [];
  const tasks = allTasks.filter(x => !x.skippedToday);   // skipped-today chores are hidden
  const doneCount = tasks.filter(x => x.done).length;
  const dateObj = fmtDate(dateForOffset(st.offset));

  function patchDay(s, fn) {
    return { ...s, days: { ...s.days, [s.offset]: fn(s.days[s.offset]) } };
  }
  function patchAllDays(s, fn) {
    const days = {};
    for (const k of Object.keys(s.days)) days[k] = fn(s.days[k]);
    return { ...s, days };
  }
  function toggle(id) {
    setSt(s => patchDay(s, day => day.map(x => x.id === id ? { ...x, done: !x.done } : x)));
  }
  function addTask(task) {
    setSt(s => patchDay(s, day => [task, ...day]));
  }
  function saveTask(updated) {
    setSt(s => patchAllDays(s, day => day.map(x => x.id === updated.id ? { ...x, ...updated } : x)));
  }
  // open + edit a chore
  function openNew()  { setEditing(null); setComposerOpen(true); }
  function openEdit(task) { setEditing(task); setComposerOpen(true); }
  // delete flow
  function requestDelete(task) {
    if (task.cadence === 'once') { deleteEverywhere(task.id); }   // nothing to disambiguate
    else setPendingDelete(task);
  }
  function skipToday(id) {
    setSt(s => patchDay(s, day => day.map(x => x.id === id ? { ...x, skippedToday: true } : x)));
    setPendingDelete(null);
  }
  function deleteEverywhere(id) {
    setSt(s => patchAllDays(s, day => day.filter(x => x.id !== id)));
    setPendingDelete(null);
  }
  function goPrev() {
    setSt(s => (s.offset > 0 ? { ...s, offset: s.offset - 1 } : s));
  }
  function goNext() {
    setSt(s => {
      if (s.offset < s.maxOffset) return { ...s, offset: s.offset + 1 };
      const nextDay = advanceDay(s.days[s.offset]);
      return {
        ...s,
        days: { ...s.days, [s.offset + 1]: nextDay },
        offset: s.offset + 1,
        maxOffset: s.offset + 1,
      };
    });
  }
  function goToday() { setSt(s => ({ ...s, offset: 0 })); }
  function resetAll() { setSt(freshState()); setEditMode(false); }

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', background: '#F5F5F8' }}>
      <div className="scroll" style={{ flex: 1, overflowY: 'auto', padding: '54px 16px 110px' }}>
        <Header dateObj={dateObj} relLabel={relativeDay(st.offset)} doneCount={doneCount}
          total={tasks.length} offset={st.offset} onPrev={goPrev} onNext={goNext} onToday={goToday}
          editMode={editMode} onToggleEdit={() => setEditMode(e => !e)} />

        <div style={{ padding: '4px 2px 16px' }}>
          <Seg options={LAYOUTS.map(l => ({ value: l.value, label: l.value }))} value={t.layout} onChange={v => setTweak('layout', v)} />
        </div>

        {layoutKey === 'kid'  && <ByKidView  tasks={tasks} kidStyle={kidStyle} mode={mode} onToggle={toggle} onDelete={requestDelete} onEdit={openEdit} editMode={editMode} />}
        {layoutKey === 'task' && <ByTaskView tasks={tasks} mode={mode} onToggle={toggle} onDelete={requestDelete} onEdit={openEdit} editMode={editMode} />}
        {layoutKey === 'time' && <ByTimeView tasks={tasks} mode={mode} onToggle={toggle} onDelete={requestDelete} onEdit={openEdit} editMode={editMode} />}
      </div>

      <FAB onClick={openNew} />
      <Composer open={composerOpen} editing={editing}
        onClose={() => { setComposerOpen(false); setEditing(null); }}
        onAdd={addTask} onSave={saveTask} onRequestDelete={requestDelete} />
      <ConfirmDelete task={pendingDelete}
        onClose={() => setPendingDelete(null)}
        onSkipToday={() => skipToday(pendingDelete.id)}
        onStopRepeating={() => deleteEverywhere(pendingDelete.id)}
        onDeleteOnce={() => deleteEverywhere(pendingDelete.id)} />

      <TweaksPanel>
        <TweakSection label="Layout" />
        <TweakRadio label="Today view" value={t.layout} options={LAYOUTS.map(l => l.value)} onChange={v => setTweak('layout', v)} />
        <TweakSection label="Kid Sections" />
        <TweakRadio label="Style" value={t.kidStyle} options={['Banner', 'Tinted', 'Rail']} onChange={v => setTweak('kidStyle', v)} />
        <TweakSection label="Completing A Task" />
        <TweakRadio label="Interaction" value={t.mode} options={['Checkbox', 'Tap Row', 'Hold']} onChange={v => setTweak('mode', v)} />
        <div style={{ fontSize: 12, color: 'var(--color-muted)', lineHeight: 1.5, padding: '2px 2px 8px' }}>
          {mode === 'checkbox' && 'Tap the circle to check it off.'}
          {mode === 'tap' && 'Tap anywhere on a chore row to complete it.'}
          {mode === 'hold' && 'Press and hold the circle to fill it in — avoids accidental taps.'}
        </div>
        <TweakSection label="Demo" />
        <TweakButton label="Reset to seed data" onClick={resetAll} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <IOSDevice><App /></IOSDevice>
);

// Scale the phone to fit any preview viewport (never upscale).
function fitDevice() {
  const root = document.getElementById('root');
  if (!root) return;
  const s = Math.min(1, (window.innerHeight - 28) / 874, (window.innerWidth - 28) / 402);
  root.style.transform = `scale(${s})`;
}
window.addEventListener('resize', fitDevice);
setTimeout(fitDevice, 60);
