import { useEffect, useRef, useState } from 'react';
import SubjectCard from './SubjectCard.jsx';
import { useTimer } from '../hooks/useTimer.js';
import { store, saveDraft } from '../lib/storage.js';
import { words, plural } from '../lib/format.js';

// Copie de rédaction : sujet, chrono de 30 min et feuille à grands carreaux.
// autoStart : le chrono part tout de suite et la copie est rendue à la fin du temps (examen blanc).
// draft : le brouillon est gardé dans le navigateur (onglet Rédaction).
export default function Editor({ subject, minutes = 30, autoStart = false, draft = false, onSubmit }) {
  const [text, setText] = useState(() => (draft && store.draft && store.draft.id === subject.id ? store.draft.text || '' : ''));
  const [running, setRunning] = useState(autoStart);
  const [started, setStarted] = useState(autoStart);
  const [locked, setLocked] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const textRef = useRef(text);
  textRef.current = text;
  const dirty = useRef(false);
  const submitted = useRef(false);

  const submit = () => {
    if (submitted.current) return;
    submitted.current = true;
    setRunning(false);
    setLocked(true);
    onSubmit(textRef.current, started ? timer.used() : null);
  };

  const timer = useTimer(minutes, running, () => {
    setRunning(false);
    setLocked(true);
    setTimeUp(true);
    if (autoStart) submit();
  });

  // Sauvegarde du brouillon, 0,4 s après la dernière frappe.
  useEffect(() => {
    if (!draft || !dirty.current) return undefined;
    const t = setTimeout(() => saveDraft(subject.id, text), 400);
    return () => clearTimeout(t);
  }, [text, draft, subject.id]);

  const n = words(text);
  const id = `copie-${subject.id}`;

  return (
    <div className="view">
      <SubjectCard subject={subject} />
      <div className="runbar">
        <span className={`timer num${timer.low ? ' low' : ''}`}>{timer.display}</span>
        {!started && (
          <button
            className="btn ghost"
            onClick={() => {
              setStarted(true);
              setRunning(true);
              document.getElementById(id)?.focus();
            }}
          >
            Lancer le chrono
          </button>
        )}
        <span className="muted grow num">{plural(n, 'mot')}</span>
        <button className="btn" disabled={submitted.current} onClick={submit}>
          {autoStart ? 'Rendre la copie' : 'Faire corriger'}
        </button>
      </div>
      <label className="sr" htmlFor={id}>
        Ta copie
      </label>
      <textarea
        id={id}
        className="copie"
        spellCheck={false}
        readOnly={locked}
        value={text}
        onChange={(e) => {
          dirty.current = true;
          setText(e.target.value);
        }}
        placeholder="Rédige ta réponse ici. Réponds aux questions dans l'ordre."
      />
      <p className="note">
        {timeUp ? 'Temps écoulé : copie ramassée.' : 'Correcteur orthographique désactivé, comme sur une copie papier.'}
      </p>
    </div>
  );
}
