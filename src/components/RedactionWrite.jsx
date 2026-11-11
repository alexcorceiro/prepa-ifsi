import { useEffect, useRef, useState } from 'react';
import { SUBJ } from '../lib/subjects.js';
import { pick } from '../lib/format.js';
import { store, addHist, clearDraft } from '../lib/storage.js';
import { clampNote } from '../lib/claude.js';
import Editor from './Editor.jsx';
import Correction from './Correction.jsx';

const initialId = () => (store.draft && SUBJ.some((s) => s.id === store.draft.id) ? store.draft.id : SUBJ[0].id);

// Mode « Écrire ma copie » : sujet, copie chronométrée et correction par Claude.
// initId : sujet à ouvrir, par exemple quand on arrive depuis un QCM.
export default function RedactionWrite({ initId } = {}) {
  const [subjId, setSubjId] = useState(() => (initId && SUBJ.some((s) => s.id === initId) ? initId : initialId()));
  const [run, setRun] = useState(0); // change la clé de l'éditeur pour repartir d'une copie vierge
  const [submission, setSubmission] = useState(null); // { text, used }
  const corrRef = useRef(null);
  const subject = SUBJ.find((s) => s.id === subjId);

  const open = (id) => {
    setSubjId(id);
    setSubmission(null);
    setRun((r) => r + 1);
  };

  useEffect(() => {
    if (submission) corrRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [submission]);

  return (
    <section className="view">
      <div className="redac-bar">
        <label htmlFor="subjSel">
          <b>Sujet</b>
        </label>
        <select id="subjSel" value={subjId} onChange={(e) => open(e.target.value)}>
          {SUBJ.map((s) => (
            <option key={s.id} value={s.id}>
              {s.theme} · {s.title}
            </option>
          ))}
        </select>
        <button className="btn ghost" onClick={() => open(pick(SUBJ.filter((s) => s.id !== subjId)).id)}>
          Sujet au hasard
        </button>
      </div>

      <Editor key={`${subjId}-${run}`} subject={subject} draft onSubmit={(text, used) => setSubmission({ text, used })} />

      {submission && (
        <div ref={corrRef} className="view">
          <Correction
            subject={subject}
            text={submission.text}
            used={submission.used}
            onResult={(r) => {
              if (!r) return;
              addHist({ t: 'redac', s: clampNote(r), m: 20, label: subject.title });
              clearDraft();
            }}
          />
          <div className="row">
            <button
              className="btn ghost"
              onClick={() => {
                clearDraft();
                open(subjId);
                window.scrollTo(0, 0);
              }}
            >
              Nouvelle copie sur ce sujet
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
