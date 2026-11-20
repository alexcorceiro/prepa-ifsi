import { useState } from 'react';
import { THEMES } from '../lib/oralQuestions.js';
import { shuffle } from '../lib/format.js';
import { statOral } from '../lib/storage.js';

const LETTERS = ['A', 'B', 'C', 'D'];

// Prépare une série : questions mélangées, et options mélangées dans chaque question.
export const prepare = (pool, count) =>
  shuffle(pool)
    .slice(0, count === 'all' ? pool.length : Math.min(count, pool.length))
    .map((q) => ({ ...q, opts: shuffle(q.opts) }));

// Une série de questions, une par écran, avec l'explication de chaque option.
export default function Quiz({ list, onDone, onQuit }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [answers, setAnswers] = useState([]); // [{ q, picked, ok }]
  const q = list[i];
  const isLast = i === list.length - 1;

  const choose = (k) => {
    if (picked !== null) return;
    const ok = q.opts[k].ok;
    setPicked(k);
    statOral(q.theme, ok);
    setAnswers((a) => [...a, { q, picked: k, ok }]);
  };

  const next = () => {
    if (isLast) return onDone(answers);
    setI(i + 1);
    setPicked(null);
    window.scrollTo(0, 0);
  };

  const okSoFar = answers.filter((a) => a.ok).length;
  const right = picked !== null && q.opts[picked].ok;

  return (
    <div className="view">
      <div className="runbar">
        <span className="muted grow">
          Question {i + 1} sur {list.length}
          {answers.length > 0 && ` · ${okSoFar} bonne${okSoFar > 1 ? 's' : ''} réponse${okSoFar > 1 ? 's' : ''}`}
        </span>
        <button className="btn ghost" onClick={onQuit}>
          Arrêter
        </button>
      </div>
      <div className="progress" aria-hidden="true">
        <div style={{ width: `${((i + (picked !== null ? 1 : 0)) / list.length) * 100}%` }} />
      </div>

      <article className="qcard">
        <div className="qmeta">
          <span className="tag">{THEMES[q.theme]}</span>
        </div>
        {q.jury ? (
          <div className="jury">
            <span className="who">Le jury</span>
            <p className="qtext">« {q.q} »</p>
            <p className="muted">Quelle réponse convaincrait le mieux le jury ?</p>
          </div>
        ) : (
          <p className="qtext">{q.q}</p>
        )}

        <div className="opts" role="group" aria-label="Réponses">
          {q.opts.map((o, k) => {
            const state = picked === null ? '' : o.ok ? 'right' : k === picked ? 'wrong' : 'dim';
            return (
              <button key={k} type="button" className={`opt ${state}`} disabled={picked !== null} onClick={() => choose(k)}>
                <span className="l">{picked !== null && o.ok ? '✓' : picked === k ? '✗' : LETTERS[k]}</span>
                <span>{o.t}</span>
                {picked !== null && <span className="why">{o.why}</span>}
              </button>
            );
          })}
        </div>

        {picked !== null && (
          <>
            <div className={`fb ${right ? 'ok' : 'bad'}`}>
              <strong>{right ? 'Bonne réponse.' : 'Pas la meilleure réponse.'}</strong>{' '}
              {right ? 'Lis quand même les explications des autres options.' : 'La meilleure réponse est marquée ✓.'}
            </div>
            {q.tip && (
              <p className="conseil">
                <strong>Conseil :</strong> {q.tip}
              </p>
            )}
            <div>
              <button className="btn" onClick={next} autoFocus>
                {isLast ? 'Voir mon résultat' : 'Question suivante'}
              </button>
            </div>
          </>
        )}
      </article>
    </div>
  );
}
