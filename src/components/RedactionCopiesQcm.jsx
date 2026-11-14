import { useEffect, useRef, useState } from 'react';
import { SUBJ } from '../lib/subjects.js';
import { shuffle, f } from '../lib/format.js';
import { getSampler } from '../lib/claude.js';
import { doneIds, markDone, nextSubject, optionLabel } from '../lib/subjectPicker.js';
import { loadQcm, isValidCopies, copiesPrompt } from '../lib/redactionQcm.js';

// Déroulé du QCM « la meilleure copie » : une question du sujet à la fois, puis la copie modèle complète.
function CopiesQuiz({ sj, qs, onWrite, onAgain, againLabel, onFinish, onNext }) {
  const [i, setI] = useState(0),
    [picked, setPicked] = useState(null),
    [got, setGot] = useState(0),
    q = qs[i],
    total = qs.reduce((a, x) => a + (Number(x.points) || 0), 0) || null;
  const finished = i >= qs.length;
  // Fin du QCM : le sujet est noté comme terminé (une seule fois).
  useEffect(() => {
    if (finished) onFinish && onFinish();
  }, [finished]); // eslint-disable-line react-hooks/exhaustive-deps
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
          <button className="btn" onClick={onNext}>
            Sujet suivant
          </button>
          <button className="btn ghost" onClick={onWrite}>
            Rédiger ma copie sur ce sujet
          </button>
          <button className="btn ghost" onClick={onAgain}>
            {againLabel}
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

// Onglet Rédaction, mode « QCM : la meilleure copie ».
// Les copies viennent de src/data/qcm-redaction.json : elles s'affichent tout de suite, sans réseau ni Claude.
// Sur claude.ai uniquement, un bouton permet en plus de demander à Claude de nouvelles copies.
export default function RedactionCopiesQcm({ onWrite }) {
  // À l'ouverture : un sujet au hasard, parmi ceux pas encore faits dans ce QCM.
  const [sid, setSid] = useState(() => nextSubject('copies').id),
    [finishedIds, setFinishedIds] = useState(() => doneIds('copies')),
    [roundMsg, setRoundMsg] = useState(false),
    [st, setSt] = useState({ status: 'idle' }),
    [n, setN] = useState(0),
    [hasClaude, setHasClaude] = useState(false),
    sj = SUBJ.find((x) => x.id === sid) || SUBJ[0],
    ac = useRef(null);
  useEffect(() => {
    let on = true;
    getSampler().then((g) => on && setHasClaude(!!g));
    return () => {
      on = false;
      ac.current && ac.current.abort();
    };
  }, []);
  const prep = (qs) => qs.map((q) => ({ ...q, points: Number(q.points) || 0, reponses: shuffle(q.reponses) }));
  // Copies intégrées à l'application (cas normal).
  const showLocal = (id = sj.id) => {
    ac.current && ac.current.abort();
    loadQcm()
      .then((d) => {
        const f = d[id] && d[id].copies;
        setSt(f ? { status: 'ready', qs: prep(f), fixed: true } : { status: 'unavailable' });
        setN((x) => x + 1);
      })
      .catch(() => setSt({ status: 'unavailable' }));
  };
  // Nouvelles copies rédigées par Claude (claude.ai uniquement) ; en cas d'échec, retour aux copies intégrées.
  const genClaude = () => {
    ac.current && ac.current.abort();
    const c = new AbortController();
    ac.current = c;
    setSt({ status: 'loading' });
    getSampler()
      .then((g) => {
        if (!g) return showLocal(sj.id);
        return g.json(copiesPrompt(sj), { signal: c.signal, modelTier: 'complex' }).then((r) => {
          const qs = r && r.questions;
          if (!isValidCopies(qs)) throw { code: 'bad' };
          setSt({ status: 'ready', qs: prep(qs) });
          setN((x) => x + 1);
        });
      })
      .catch(() => {
        if (!c.signal.aborted) showLocal(sj.id);
      });
  };
  const change = (id) => {
    ac.current && ac.current.abort();
    setSid(id);
    setSt({ status: 'idle' });
    setRoundMsg(false);
    setFinishedIds(doneIds('copies'));
  };
  // QCM terminé : le sujet est coché comme fait.
  const finish = () => {
    markDone('copies', sj.id);
    setFinishedIds(doneIds('copies'));
  };
  // « Sujet suivant » : un autre sujet au hasard, pas encore fait, qui démarre tout de suite.
  const goNext = () => {
    const { id, newRound } = nextSubject('copies', sid);
    setSid(id);
    setFinishedIds(doneIds('copies'));
    setRoundMsg(newRound);
    showLocal(id);
    window.scrollTo(0, 0);
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
                {optionLabel(x, finishedIds)}
              </option>
            ))}
          </select>
          <button className="btn ghost" onClick={() => change(nextSubject('copies', sid).id)}>
            Sujet au hasard
          </button>
        </div>
        <p className="note">
          {finishedIds.length}/{SUBJ.length} sujets faits · ✓ = déjà fait · le hasard choisit d'abord les sujets pas encore faits
        </p>
        {roundMsg && <p className="fb ok">Bravo, tu as fait les {SUBJ.length} sujets ! Un nouveau tour commence.</p>}
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
            <button className="btn" onClick={() => showLocal()}>
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
          <p>Les copies de ce sujet ne sont pas encore disponibles. Choisis un autre sujet.</p>
        </div>
      )}
      {st.status === 'ready' && (
        <CopiesQuiz
          key={`${sid}-${n}-${st.fixed ? 'f' : 'g'}`}
          sj={sj}
          qs={st.qs}
          onWrite={() => onWrite(sj.id)}
          onAgain={hasClaude ? genClaude : () => showLocal()}
          onFinish={finish}
          onNext={goNext}
          againLabel={hasClaude ? 'Nouvelles copies avec Claude' : 'Recommencer ce QCM'}
        />
      )}
    </section>
  );
}
