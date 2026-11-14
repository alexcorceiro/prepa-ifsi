import { useEffect, useRef, useState } from 'react';
import { SUBJ } from '../lib/subjects.js';
import { store, addHist, clearDraft } from '../lib/storage.js';
import { clampNote } from '../lib/claude.js';
import Editor from './Editor.jsx';
import Correction from './Correction.jsx';
import { doneIds, markDone, nextSubject, optionLabel } from '../lib/subjectPicker.js';

// Sujet à l'ouverture : celui du brouillon en cours s'il y en a un, sinon un sujet au hasard pas encore rédigé.
const initialId = () => (store.draft && SUBJ.some((s) => s.id === store.draft.id) ? store.draft.id : nextSubject('ecrire').id);

// Mode « Écrire ma copie » : sujet, copie chronométrée et correction par Claude.
// initId : sujet à ouvrir, par exemple quand on arrive depuis un QCM.
export default function RedactionWrite({ initId } = {}) {
  const [subjId, setSubjId] = useState(() => (initId && SUBJ.some((s) => s.id === initId) ? initId : initialId()));
  const [run, setRun] = useState(0); // change la clé de l'éditeur pour repartir d'une copie vierge
  const [submission, setSubmission] = useState(null); // { text, used }
  const [finishedIds, setFinishedIds] = useState(() => doneIds('ecrire'));
  const [roundMsg, setRoundMsg] = useState(false);
  const corrRef = useRef(null);
  const subject = SUBJ.find((s) => s.id === subjId);

  const open = (id, newRound = false) => {
    setSubjId(id);
    setSubmission(null);
    setRun((r) => r + 1);
    setRoundMsg(newRound);
    setFinishedIds(doneIds('ecrire'));
  };
  // Un autre sujet au hasard, en priorité parmi ceux pas encore rédigés.
  const openNext = () => {
    const { id, newRound } = nextSubject('ecrire', subjId);
    open(id, newRound);
    window.scrollTo(0, 0);
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
              {optionLabel(s, finishedIds)}
            </option>
          ))}
        </select>
        <button className="btn ghost" onClick={openNext}>
          Sujet au hasard
        </button>
      </div>
      <p className="note">
        {finishedIds.length}/{SUBJ.length} sujets rédigés · ✓ = déjà rédigé · le hasard choisit d'abord les sujets pas encore faits
      </p>
      {roundMsg && <p className="fb ok">Bravo, tu as rédigé les {SUBJ.length} sujets ! Un nouveau tour commence.</p>}

      <Editor
        key={`${subjId}-${run}`}
        subject={subject}
        draft
        onSubmit={(text, used) => {
          // Copie rendue : le sujet est coché comme rédigé.
          markDone('ecrire', subjId);
          setFinishedIds(doneIds('ecrire'));
          setSubmission({ text, used });
        }}
      />

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
              className="btn"
              onClick={() => {
                clearDraft();
                openNext();
              }}
            >
              Sujet suivant
            </button>
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
