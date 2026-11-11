import { useEffect, useRef, useState } from 'react';
import { SUBJ } from '../lib/subjects.js';
import { pick, shuffle } from '../lib/format.js';
import { getSampler, ERR } from '../lib/claude.js';
import { ETAPES, METHODE_INTEGREE, isValidMethode, methodePrompt } from '../lib/redactionQcm.js';

// Déroulé du QCM de méthode, question par question, puis score.
function MethodeQuiz({ qs, onDone, onAgain }) {
  const [i, setI] = useState(0),
    [picked, setPicked] = useState(null),
    [score, setScore] = useState(0),
    q = qs[i],
    end = i >= qs.length;
  if (end)
    return (
      <div className="panel">
        <div className="score">
          <span className="big num">
            {score}
            <small>/{qs.length}</small>
          </span>
          <span className={`pill ${score >= qs.length - 1 ? 'ok' : score >= qs.length / 2 ? 'warn' : 'bad'}`}>
            {score >= qs.length - 1 ? 'Méthode maîtrisée' : score >= qs.length / 2 ? 'Presque' : 'À revoir'}
          </span>
        </div>
        <p>
          Le jour J, il faudra écrire toi-même : passe maintenant à l'écriture sur ce sujet, en reprenant le plan et les idées que tu viens
          de voir.
        </p>
        <div className="row">
          <button className="btn" onClick={onDone}>
            Écrire ma copie sur ce sujet
          </button>
          <button className="btn ghost" onClick={onAgain}>
            Refaire un QCM
          </button>
        </div>
      </div>
    );
  const choose = (k) => {
    if (picked != null) return;
    setPicked(k);
    q.opts[k].ok && setScore((x) => x + 1);
  };
  return (
    <div className="qcard">
      <div className="qmeta">
        <span className="tag">
          {'Étape '}
          {i + 1}/{qs.length}
          {' · '}
          {q.etape || ETAPES[i] || ''}
        </span>
        <span className="muted num">
          {score}
          {' bonne'}
          {score > 1 ? 's' : ''}
          {' réponse'}
          {score > 1 ? 's' : ''}
        </span>
      </div>
      <div className="progress">
        <div style={{ width: `${(i / qs.length) * 100}%` }} />
      </div>
      <p className="qtext">{q.q}</p>
      <div className="opts">
        {q.opts.map((x, k) => {
          const cl = picked == null ? '' : x.ok ? 'right' : k === picked ? 'wrong' : 'dim';
          return (
            <button key={k} className={`opt ${cl}`} disabled={picked != null} onClick={() => choose(k)}>
              <span className="l">{'ABCD'[k]}</span>
              <span>{x.t}</span>
              {picked != null && x.why && <span className="why">{x.why}</span>}
            </button>
          );
        })}
      </div>
      {picked != null && (
        <div className="row">
          <p className={`fb ${q.opts[picked].ok ? 'ok' : 'bad'}`} style={{ flex: 1 }}>
            {q.opts[picked].ok ? 'Bonne réponse !' : 'Pas tout à fait : regarde les explications sous chaque proposition.'}
          </p>
          <button
            className="btn"
            onClick={() => {
              setPicked(null);
              setI((x) => x + 1);
              window.scrollTo && window.scrollTo(0, 0);
            }}
          >
            {i + 1 < qs.length ? 'Question suivante' : 'Voir mon score'}
          </button>
        </div>
      )}
    </div>
  );
}

// Onglet Rédaction, mode « QCM : la méthode ». Claude crée les questions ; sans Claude, seul le sujet « Les aidants » est disponible.
export default function RedactionMethodeQcm({ onWrite }) {
  const [sid, setSid] = useState(SUBJ[0].id),
    [st, setSt] = useState({ status: 'idle' }),
    [n, setN] = useState(0),
    sj = SUBJ.find((x) => x.id === sid) || SUBJ[0],
    ac = useRef(null);
  useEffect(
    () => () => {
      ac.current && ac.current.abort();
    },
    [],
  );
  const prep = (qs) => qs.map((q) => ({ ...q, opts: shuffle(q.opts) }));
  const gen = () => {
    ac.current && ac.current.abort();
    const c = new AbortController();
    ac.current = c;
    setSt({ status: 'loading' });
    getSampler()
      .then((g) => {
        if (!g) {
          const f = METHODE_INTEGREE[sj.id];
          setSt(f ? { status: 'ready', qs: prep(f), fixed: true } : { status: 'unavailable' });
          return;
        }
        return g.json(methodePrompt(sj), { signal: c.signal }).then((r) => {
          const qs = r && r.questions;
          if (!isValidMethode(qs)) throw { code: 'bad' };
          setSt({ status: 'ready', qs: prep(qs.slice(0, 6)) });
          setN((x) => x + 1);
        });
      })
      .catch((e) => {
        if (c.signal.aborted) return;
        const f = METHODE_INTEGREE[sj.id];
        setSt(f ? { status: 'ready', qs: prep(f), fixed: true } : { status: 'error', code: e && e.code });
      });
  };
  const change = (id) => {
    ac.current && ac.current.abort();
    setSid(id);
    setSt({ status: 'idle' });
  };
  return (
    <section className="view">
      <div className="panel">
        <h2>La méthode en QCM</h2>
        <p className="muted">
          6 questions pour apprendre à construire une bonne copie : comprendre le sujet, choisir un plan, argumenter, introduire, bien
          écrire et conclure. C'est un échauffement : le jour J, tu devras écrire toi-même.
        </p>
        <div className="redac-bar">
          <label htmlFor="methode-subject">
            <b>Sujet</b>
          </label>
          <select id="methode-subject" value={sid} onChange={(e) => change(e.target.value)}>
            {SUBJ.map((x) => (
              <option key={x.id} value={x.id}>
                {x.theme}
                {' · '}
                {x.title}
              </option>
            ))}
          </select>
          <button className="btn ghost" onClick={() => change(pick(SUBJ.filter((x) => x.id !== sid)).id)}>
            Sujet au hasard
          </button>
        </div>
        <div className="sujet">
          <h3>{sj.title}</h3>
          {sj.doc && <blockquote>{sj.doc}</blockquote>}
          <ol className="consignes">
            {sj.qs.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ol>
        </div>
        {st.status === 'idle' && (
          <div>
            <button className="btn" onClick={gen}>
              Commencer le QCM
            </button>
          </div>
        )}
      </div>
      {st.status === 'loading' && (
        <div className="panel">
          <p className="thinking">Préparation des questions sur ce sujet…</p>
        </div>
      )}
      {st.status === 'unavailable' && (
        <div className="panel">
          <p>
            Le QCM de ce sujet est créé par Claude, qui n'est pas disponible ici. Choisis le sujet « Les aidants, des soignants invisibles »
            : son QCM est intégré à l'application.
          </p>
        </div>
      )}
      {st.status === 'error' && (
        <div className="panel">
          <p>{ERR[st.code] || "La création du QCM n'a pas abouti."}</p>
          <div>
            <button className="btn" onClick={gen}>
              Réessayer
            </button>
          </div>
        </div>
      )}
      {st.status === 'ready' && (
        <MethodeQuiz key={`${sid}-${n}-${st.fixed ? 'f' : 'g'}`} qs={st.qs} onDone={() => onWrite(sj.id)} onAgain={gen} />
      )}
    </section>
  );
}
