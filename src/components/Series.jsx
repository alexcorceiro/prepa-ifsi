import { useEffect, useRef, useState } from 'react';
import { CATS, makeSeriesQuestions, check } from '../lib/generators.js';
import { stat } from '../lib/storage.js';
import { useTimer } from '../hooks/useTimer.js';

// Série chronométrée : 12 questions en 30 minutes, correction à la fin.
export default function Series({ count = 12, minutes = 30, onDone }) {
  const [qs] = useState(() => makeSeriesQuestions(count));
  const [ans, setAns] = useState(() => Array(count).fill(''));
  const [i, setI] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const [running, setRunning] = useState(true);
  const ansRef = useRef(ans);
  ansRef.current = ans;
  const finished = useRef(false);
  const inputRef = useRef(null);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    setRunning(false);
    const a = ansRef.current;
    const res = qs.map((o, k) => check(o, a[k]) === true);
    qs.forEach((o, k) => stat(o.cat, res[k]));
    onDone({ qs, ans: a, res, ok: res.filter(Boolean).length, used: timer.used() });
  };
  const timer = useTimer(minutes, running, finish);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, [i]);

  const o = qs[i];
  const missing = ans.filter((a) => !a.trim()).length;
  const go = (k) => {
    setI(Math.max(0, Math.min(count - 1, k)));
    setConfirm(false);
  };
  const setAnswer = (v) =>
    setAns((a) => {
      const n = a.slice();
      n[i] = v;
      return n;
    });

  return (
    <div className="view">
      <div className="runbar">
        <span className={`timer num${timer.low ? ' low' : ''}`}>{timer.display}</span>
        <span className="muted grow">
          Question {i + 1} sur {count}
        </span>
        <button className="btn ghost" onClick={() => setConfirm(true)}>
          Rendre la copie
        </button>
      </div>

      {confirm && (
        <div className="confirm">
          <span>
            {missing ? `Il reste ${missing} question${missing > 1 ? 's' : ''} sans réponse.` : 'Toutes les questions ont une réponse.'}
          </span>
          <button className="btn" onClick={finish}>
            Rendre maintenant
          </button>
          <button className="btn ghost" onClick={() => setConfirm(false)}>
            Continuer
          </button>
        </div>
      )}

      <div className="dots">
        {qs.map((_, k) => (
          <button
            key={k}
            type="button"
            className={`${ans[k].trim() ? 'done' : ''} ${k === i ? 'cur' : ''}`}
            aria-label={`Question ${k + 1}`}
            onClick={() => go(k)}
          >
            {k + 1}
          </button>
        ))}
      </div>

      <form
        className="qcard"
        onSubmit={(e) => {
          e.preventDefault();
          if (i === count - 1) setConfirm(true);
          else go(i + 1);
        }}
      >
        <div className="qmeta">
          <span className="tag">{CATS[o.cat]}</span>
        </div>
        <p className="qtext">{o.q}</p>
        <div className="ans">
          <label className="sr" htmlFor="serie-input">
            Ta réponse
          </label>
          <input
            id="serie-input"
            ref={inputRef}
            value={ans[i]}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={o.ph || 'Ta réponse'}
            inputMode={o.kind === 'time' ? 'text' : 'decimal'}
            autoComplete="off"
          />
          <span>{o.unit}</span>
        </div>
        <div className="row">
          <button className="btn ghost" type="button" disabled={i === 0} onClick={() => go(i - 1)}>
            Précédente
          </button>
          <button className="btn">{i === count - 1 ? 'Terminer' : 'Suivante'}</button>
        </div>
      </form>
      <p className="note">La correction s'affiche quand tu rends la copie ou à la fin des {minutes} minutes.</p>
    </div>
  );
}
