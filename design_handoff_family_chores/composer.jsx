// composer.jsx — inline "new chore" bottom sheet + segmented control
const { useState: useStateC, useEffect: useEffectC } = React;

// Segmented control
function Seg({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--color-surface-soft)', borderRadius: 12 }}>
      {options.map(o => {
        const active = o.value === value;
        return (
          <button key={o.value} onClick={() => onChange(o.value)} style={{
            flex: 1, height: 38, border: 'none', borderRadius: 9, cursor: 'pointer',
            background: active ? '#fff' : 'transparent',
            color: active ? 'var(--color-ink)' : 'var(--color-muted)',
            fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 700,
            boxShadow: active ? '0 1px 3px rgba(15,15,26,0.12)' : 'none',
            transition: 'background 140ms ease, color 140ms ease',
          }}>{o.label}</button>
        );
      })}
    </div>
  );
}

// Kid picker chips
function KidPicker({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {KID_ORDER.map(id => {
        const k = KIDS[id];
        const active = id === value;
        return (
          <button key={id} onClick={() => onChange(id)} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            height: 46, borderRadius: 12, cursor: 'pointer',
            border: `2px solid ${active ? k.color : 'var(--color-hairline)'}`,
            background: active ? k.soft : '#fff',
            fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13,
            color: active ? k.ink : 'var(--color-body)', transition: 'all 140ms ease',
          }}>
            <Avatar kid={k} size={24} dim={!active} />{k.name}
          </button>
        );
      })}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>{label}</div>
      {children}
    </div>
  );
}

function Composer({ open, onClose, onAdd, editing, onSave, onRequestDelete }) {
  const isEdit = !!editing;
  const [title, setTitle] = useStateC('');
  const [rotates, setRotates] = useStateC(true);
  const [startKid, setStartKid] = useStateC('nixon');
  const [cadence, setCadence] = useStateC('daily');
  const [slot, setSlot] = useStateC('anytime');
  const [time, setTime] = useStateC('');

  function reset() { setTitle(''); setRotates(true); setStartKid('nixon'); setCadence('daily'); setSlot('anytime'); setTime(''); }

  // sync fields whenever the sheet opens (prefill when editing)
  useEffectC(() => {
    if (!open) return;
    if (editing) {
      setTitle(editing.title);
      setRotates(editing.queue.length > 1);
      setStartKid(currentKid(editing).id);
      setCadence(editing.cadence);
      setSlot(editing.slot);
      setTime(editing.time || '');
    } else {
      reset();
    }
  }, [open, editing]);

  const once = cadence === 'once';
  function submit() {
    const name = title.trim();
    if (!name) return;
    const startIdx = KID_ORDER.indexOf(startKid);
    const queue = (!once && rotates)
      ? [...KID_ORDER.slice(startIdx), ...KID_ORDER.slice(0, startIdx)]
      : [startKid];
    const fields = { title: name, cadence, time: time.trim() || null, slot, queue, turn: 0 };
    if (isEdit) {
      onSave({ ...editing, ...fields });
    } else {
      onAdd({ id: 'u' + Date.now(), ...fields, done: false, carried: false });
    }
    reset(); onClose();
  }

  return (
    <>
      {/* backdrop */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(15,15,26,0.42)', zIndex: 80,
        opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity 220ms ease',
        backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)',
      }} />
      {/* sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 81,
        background: '#fff', borderRadius: '26px 26px 0 0', padding: '10px 18px 30px',
        boxShadow: '0 -10px 40px rgba(15,15,26,0.18)',
        transform: open ? 'translateY(0)' : 'translateY(110%)',
        transition: 'transform 300ms cubic-bezier(.4,0,.2,1)',
        maxHeight: '88%', overflowY: 'auto',
      }}>
        <div style={{ width: 40, height: 5, borderRadius: 100, background: 'var(--color-surface-strong)', margin: '4px auto 14px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em', color: 'var(--color-ink)' }}>{isEdit ? 'Edit Chore' : 'New Chore'}</span>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: 'var(--color-surface-soft)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icon.x({ s: 18, c: 'var(--color-muted)' })}</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <input autoFocus value={title} onChange={e => setTitle(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') submit(); }}
            placeholder="e.g. Water The Plants" style={{
              width: '100%', height: 52, padding: '0 16px', borderRadius: 12,
              border: '1.5px solid var(--color-hairline)', background: '#fff',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--color-ink)',
              outline: 'none', boxSizing: 'border-box',
            }} />

          <Field label="Who Does It">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {!once && <Seg options={[{ value: true, label: 'Rotates between kids' }, { value: false, label: 'Always one kid' }]} value={rotates} onChange={setRotates} />}
              <KidPicker value={startKid} onChange={setStartKid} />
              <div style={{ fontSize: 12, color: 'var(--color-muted)', fontWeight: 600 }}>
                {once ? `${KIDS[startKid].name} handles this one-time chore.` : (rotates ? `Starts with ${KIDS[startKid].name}, then passes down the line each day.` : `${KIDS[startKid].name} owns this one every time.`)}
              </div>
            </div>
          </Field>

          <Field label="Repeats">
            <Seg options={[{ value: 'once', label: 'One time' }, { value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }]} value={cadence} onChange={setCadence} />
          </Field>

          <Field label="When">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Seg options={[{ value: 'anytime', label: 'Anytime' }, { value: 'morning', label: 'AM' }, { value: 'afternoon', label: 'Noon' }, { value: 'evening', label: 'PM' }]} value={slot} onChange={setSlot} />
              <input value={time} onChange={e => setTime(e.target.value)} placeholder="Optional exact time, e.g. 7:30 AM" style={{
                width: '100%', height: 46, padding: '0 16px', borderRadius: 12,
                border: '1.5px solid var(--color-hairline)', background: '#fff',
                fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--color-ink)',
                outline: 'none', boxSizing: 'border-box',
              }} />
            </div>
          </Field>

          <button onClick={submit} disabled={!title.trim()} style={{
            height: 54, borderRadius: 100, border: 'none', marginTop: 2,
            background: title.trim() ? 'var(--color-primary)' : 'var(--color-primary-disabled)',
            color: '#fff', fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 700,
            cursor: title.trim() ? 'pointer' : 'not-allowed', transition: 'background 160ms ease',
          }}>{isEdit ? 'Save Changes' : 'Add Chore'}</button>

          {isEdit && (
            <button onClick={() => { onClose(); onRequestDelete(editing); }} style={{
              height: 50, borderRadius: 100, marginTop: -6,
              border: '1.5px solid #F3C9CB', background: '#fff', color: '#E5484D',
              fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            }}>{Icon.trash({ s: 17, c: '#E5484D' })}Delete Chore</button>
          )}
        </div>
      </div>
    </>
  );
}

// ── Confirm-delete action sheet ───────────────────────────
// One-time chores get a single Delete; recurring chores get the
// "just today" vs "stop it repeating" choice.
function ConfirmDelete({ task, onClose, onSkipToday, onStopRepeating, onDeleteOnce }) {
  const open = !!task;
  const recurring = task && task.cadence !== 'once';

  const optionBtn = (heading, sub, kind, onClick) => (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left', padding: '14px 16px', borderRadius: 16, cursor: 'pointer',
      fontFamily: 'var(--font-sans)', display: 'flex', flexDirection: 'column', gap: 2,
      border: kind === 'danger' ? 'none' : '1.5px solid var(--color-hairline)',
      background: kind === 'danger' ? '#E5484D' : '#fff',
      color: kind === 'danger' ? '#fff' : 'var(--color-ink)',
    }}>
      <span style={{ fontSize: 15.5, fontWeight: 800, letterSpacing: '-0.01em' }}>{heading}</span>
      <span style={{ fontSize: 12.5, fontWeight: 600, color: kind === 'danger' ? 'rgba(255,255,255,0.82)' : 'var(--color-muted)' }}>{sub}</span>
    </button>
  );

  return (
    <>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(15,15,26,0.42)', zIndex: 90,
        opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity 200ms ease',
        backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 91,
        background: '#fff', borderRadius: '26px 26px 0 0', padding: '10px 18px 26px',
        boxShadow: '0 -10px 40px rgba(15,15,26,0.18)',
        transform: open ? 'translateY(0)' : 'translateY(110%)',
        transition: 'transform 300ms cubic-bezier(.4,0,.2,1)',
      }}>
        <div style={{ width: 40, height: 5, borderRadius: 100, background: 'var(--color-surface-strong)', margin: '4px auto 16px' }} />
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em', color: 'var(--color-ink)', textAlign: 'center' }}>
          Delete “{task ? task.title : ''}”?
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-muted)', textAlign: 'center', marginTop: 6, marginBottom: 18, lineHeight: 1.45 }}>
          {recurring ? 'This is a repeating chore. Skip it for today, or stop it coming back at all?' : 'This one-time chore will be removed.'}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {recurring ? (
            <>
              {optionBtn('Just Skip Today', "It'll come back tomorrow.", 'neutral', onSkipToday)}
              {optionBtn('Stop It Repeating', 'Removes it for good.', 'danger', onStopRepeating)}
            </>
          ) : (
            optionBtn('Delete Chore', 'Removes it from the list.', 'danger', onDeleteOnce)
          )}
        </div>

        <button onClick={onClose} style={{
          width: '100%', height: 46, marginTop: 12, borderRadius: 100, border: 'none',
          background: 'var(--color-surface-soft)', color: 'var(--color-body)',
          fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, cursor: 'pointer',
        }}>Cancel</button>
      </div>
    </>
  );
}

Object.assign(window, { Seg, KidPicker, Field, Composer, ConfirmDelete });
