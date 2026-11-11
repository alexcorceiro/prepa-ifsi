import { useRef, useState } from 'react';
import { CATS, gen, check, fmtAns } from '../lib/generators.js';
import { stat } from '../lib/storage.js';
import Steps from './Steps.jsx';

// Entraînement libre : une question à la fois, correction immédiate.
export default function CalcFree() {
  const [cats, setCats] = useState(() => new Set(Object.keys(CATS)));
  const [q, setQ] = useState(() => gen(Object.keys(CATS)));
  const [value, setValue] = useState('');
  const [result, setResult] = useState(null); // null | 'invalid' | true | false
  const [sess, setSess] = useState({ ok: 0, n: 0 });
  const inputRef = useRef(null);
  const answered = result === true || result === false;

  const next = (from = cats, focus = true) => {
    setQ(gen([...from]));
    setValue('');
    setResult(null);
    if (focus) inputRef.current?.focus();
  };

  const toggle = (k) => {
    const n = new Set(cats);
    if (n.has(k)) {
      if (n.size === 1) return; // au moins un thème
      n.delete(k);
    } else n.add(k);
    setCats(n);
    if (!answered && !n.has(q.cat)) next(n, false);
  };

  const submit = (e) => {
    e.preventDefault();
    if (answered) return next();
    const r = check(q, value);
    if (r === null) return setResult('invalid');
    setResult(r);
    setSess((s) => ({ ok: s.ok + (r ? 1 : 0), n: s.n + 1 }));
    stat(q.cat, r);
  };

  return (
    <div className="view">
      <div className="chips" aria-label="Thèmes">
        {Object.entries(CATS).map(([k, label]) => (
          <button key={k} type="button" className="chip" aria-pressed={cats.has(k)} onClick={() => toggle(k)}>
            {label}
          </button>
        ))}
      </div>

      <article className="qcard">
        <div className="qmeta">
          <span className="tag">{CATS[q.cat]}</span>
          {sess.n > 0 && (
            <span className="num muted">
              {sess.ok} juste{sess.ok > 1 ? 's' : ''} sur {sess.n}
            </span>
          )}
        </div>
        <p className="qtext">{q.q}</p>
        <form className="row" onSubmit={submit}>
          <div className="ans">
            <label className="sr" htmlFor="free-input">
              Ta réponse
            </label>
            <input
              id="free-input"
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={q.ph || 'Ta réponse'}
              inputMode={q.kind === 'time' ? 'text' : 'decimal'}
              autoComplete="off"
            />
            <span>{q.unit}</span>
          </div>
          <button className="btn">{answered ? 'Question suivante' : 'Vérifier'}</button>
          {!answered && (
            <button className="btn ghost" type="button" onClick={() => next()}>
              Passer
            </button>
          )}
        </form>

        {result === 'invalid' && (
          <div className="fb bad">{q.kind === 'time' ? 'Écris une heure, par exemple 17h25.' : 'Écris un nombre, par exemple 12,5.'}</div>
        )}
        {answered && (
          <div>
            <div className={`fb ${result ? 'ok' : 'bad'}`}>
              <strong>{result ? 'Juste.' : 'Pas tout à fait.'}</strong> Réponse attendue : <b>{fmtAns(q)}</b>
            </div>
            <Steps question={q} />
          </div>
        )}
      </article>
      <p className="note">
        Le jour J, seule la calculatrice simple est autorisée. Entraîne-toi avec la même, ou de tête pour les opérations faciles.
      </p>
    </div>
  );
}
