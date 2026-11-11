import { useEffect, useRef, useState } from 'react';
import { SUBJ } from '../lib/subjects.js';
import { pick, shuffle, f } from '../lib/format.js';
import { getSampler, ERR } from '../lib/claude.js';
import { COPIES_INTEGREES, isValidCopies, copiesPrompt } from '../lib/redactionQcm.js';

// Déroulé du QCM « la meilleure copie » : une question du sujet à la fois, puis la copie modèle complète.
function CopiesQuiz({ sj, qs, onWrite, onAgain }) {
  const [i, setI] = useState(0),
    [picked, setPicked] = useState(null),
    [got, setGot] = useState(0),
    q = qs[i],
    total = qs.reduce((a, x) => a + (Number(x.points) || 0), 0) || null;
  if (i >= qs.length) {
    const best = qs.map((x) => x.reponses.find((r) => r.ok));
    return (
      <div className="view" id="copies-quiz" style={{ scrollMarginTop: '64px' }}>
        <div className="panel">
          <div className="score">
            <span className="big num">
              {got}
              <small>/{qs.length}</small>
            </span>
            <span className={`pill ${got === qs.length ? 'ok' : got >= qs.length / 2 ? 'warn' : 'bad'}`}>
              {got === qs.length ? 'Tu sais reconnaître une bonne copie' : got >= qs.length / 2 ? 'Presque' : 'À revoir'}
            </span>
          </div>
          <p>
            Voici la copie modèle complète. Recopie-la à la main une fois, en 15 minutes : ça entraîne ta main et ton orthographe. Puis
            rédige ta propre copie sur le même sujet, sans la regarder.
          </p>
        </div>
        <div className="sujet">
          <p className="eyebrow">Copie modèle</p>
          <h3>{sj.title}</h3>
          {best.map((r, k) => (
            <div key={k} className="model-part">
              <h4>
                {k + 1}
                {'. '}
                {qs[k].q}
              </h4>
              <p>{r ? r.t : ''}</p>
            </div>
          ))}
        </div>
        <div className="row">
          <button className="btn" onClick={onWrite}>
            Rédiger ma copie sur ce sujet
          </button>
          <button className="btn ghost" onClick={onAgain}>
            Nouvelles réponses
          </button>
        </div>
      </div>
    );
  }
  const choose = (k) => {
    if (picked != null) return;
    setPicked(k);
    q.reponses[k].ok && setGot((x) => x + 1);
  };
  return (
    <div className="qcard" id="copies-quiz" style={{ scrollMarginTop: '64px' }}>
      <div className="qmeta">
        <span className="tag">
          {'Question '}
          {i + 1}/{qs.length}
          {q.points ? ` · ${f(q.points)} point${q.points > 1 ? 's' : ''}` : ''}
        </span>
        <span className="muted num">
          {got}
          {' bonne'}
          {got > 1 ? 's' : ''}
          {' réponse'}
          {got > 1 ? 's' : ''}
        </span>
      </div>
      <div className="progress">
        <div style={{ width: `${(i / qs.length) * 100}%` }} />
      </div>
      <p className="qtext">{q.q}</p>
      <p className="muted">Quelle copie mérite la meilleure note ?</p>
      <div className="opts">
        {q.reponses.map((x, k) => {
          const cl = picked == null ? '' : x.ok ? 'right' : k === picked ? 'wrong' : 'dim';
          return (
            <button key={k} className={`opt copy-option ${cl}`} disabled={picked != null} onClick={() => choose(k)}>
              <span className="l">{'ABCD'[k]}</span>
              <span className="copy-text">{x.t}</span>
              {picked != null && (
                <span className="why">
                  {x.note ? (
                    <b>
                      {x.note}
                      {' · '}
                    </b>
                  ) : null}
                  {x.why}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {picked != null && (
        <div className="row">
          <p className={`fb ${q.reponses[picked].ok ? 'ok' : 'bad'}`} style={{ flex: 1 }}>
            {q.reponses[picked].ok
              ? "Bonne réponse : c'est la copie la mieux notée."
              : "Pas tout à fait : regarde la note et l'explication de chaque copie."}
          </p>
          <button
            className="btn"
            onClick={() => {
              setPicked(null);
              setI((x) => x + 1);
              setTimeout(() => {
                const el = document.getElementById('copies-quiz');
                el && el.scrollIntoView({ block: 'start' });
              }, 0);
            }}
          >
            {i + 1 < qs.length ? 'Question suivante' : 'Voir la copie modèle'}
          </button>
        </div>
      )}
    </div>
  );
}

// Onglet Rédaction, mode « QCM : la meilleure copie ». Claude rédige les copies ; sans Claude, seul le sujet « Les aidants » est disponible.
export default function RedactionCopiesQcm({ onWrite }) {
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
  const prep = (qs) => qs.map((q) => ({ ...q, points: Number(q.points) || 0, reponses: shuffle(q.reponses) }));
  const fixed = () => {
    const f = COPIES_INTEGREES[sj.id];
    return f ? { status: 'ready', qs: prep(f), fixed: true } : null;
  };
  const gen = () => {
    ac.current && ac.current.abort();
    const c = new AbortController();
    ac.current = c;
    setSt({ status: 'loading' });
    getSampler()
      .then((g) => {
        if (!g) {
          setSt(fixed() || { status: 'unavailable' });
          return;
        }
        return g.json(copiesPrompt(sj), { signal: c.signal, modelTier: 'complex' }).then((r) => {
          const qs = r && r.questions;
          if (!isValidCopies(qs)) throw { code: 'bad' };
          setSt({ status: 'ready', qs: prep(qs) });
          setN((x) => x + 1);
        });
      })
      .catch((e) => {
        if (c.signal.aborted) return;
        setSt(fixed() || { status: 'error', code: e && e.code });
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
        <h2>Choisis la meilleure copie</h2>
        <p className="muted">
          Pour chaque question du sujet, 4 réponses rédigées comme sur une vraie copie. Choisis celle qui aurait la meilleure note : tu
          découvres la note de chaque copie et pourquoi. À la fin, tu obtiens la copie modèle complète.
        </p>
        <div className="redac-bar">
          <label htmlFor="copies-subject">
            <b>Sujet</b>
          </label>
          <select id="copies-subject" value={sid} onChange={(e) => change(e.target.value)}>
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
              Voir les copies
            </button>
          </div>
        )}
      </div>
      {st.status === 'loading' && (
        <div className="panel">
          <p className="thinking">Rédaction des copies sur ce sujet… (environ 30 secondes)</p>
        </div>
      )}
      {st.status === 'unavailable' && (
        <div className="panel">
          <p>
            Les copies de ce sujet sont rédigées par Claude, qui n'est pas disponible ici. Choisis le sujet « Les aidants, des soignants
            invisibles » : ses copies sont intégrées à l'application.
          </p>
        </div>
      )}
      {st.status === 'error' && (
        <div className="panel">
          <p>{ERR[st.code] || "La création des copies n'a pas abouti."}</p>
          <div>
            <button className="btn" onClick={gen}>
              Réessayer
            </button>
          </div>
        </div>
      )}
      {st.status === 'ready' && (
        <CopiesQuiz key={`${sid}-${n}-${st.fixed ? 'f' : 'g'}`} sj={sj} qs={st.qs} onWrite={() => onWrite(sj.id)} onAgain={gen} />
      )}
    </section>
  );
}
