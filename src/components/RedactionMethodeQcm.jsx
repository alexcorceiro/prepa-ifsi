import { useEffect, useRef, useState } from 'react';
import { SUBJ } from '../lib/subjects.js';
import { shuffle } from '../lib/format.js';
import { getSampler } from '../lib/claude.js';
import { doneIds, markDone, nextSubject, optionLabel } from '../lib/subjectPicker.js';
import { ETAPES, loadQcm, isValidMethode, methodePrompt } from '../lib/redactionQcm.js';

// Déroulé du QCM de méthode, question par question, puis score.
function MethodeQuiz({ qs, onDone, onAgain, againLabel, onFinish, onNext }) {
  const [i, setI] = useState(0),
    [picked, setPicked] = useState(null),
    [score, setScore] = useState(0),
    q = qs[i],
    end = i >= qs.length;
  const finished = i >= qs.length;
  // Fin du QCM : le sujet est noté comme terminé (une seule fois).
  useEffect(() => {
    if (finished) onFinish && onFinish();
  }, [finished]); // eslint-disable-line react-hooks/exhaustive-deps
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
          <button className="btn" onClick={onNext}>
            Sujet suivant
          </button>
          <button className="btn ghost" onClick={onDone}>
            Écrire ma copie sur ce sujet
          </button>
          <button className="btn ghost" onClick={onAgain}>
            {againLabel}
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

// Onglet Rédaction, mode « QCM : la méthode ».
// Les questions viennent de src/data/qcm-redaction.json : elles s'affichent tout de suite, sans réseau ni Claude.
// Sur claude.ai uniquement, un bouton permet en plus de demander à Claude un nouveau QCM.
export default function RedactionMethodeQcm({ onWrite }) {
  // À l'ouverture : un sujet au hasard, parmi ceux pas encore faits dans ce QCM.
  const [sid, setSid] = useState(() => nextSubject('methode').id),
    [finishedIds, setFinishedIds] = useState(() => doneIds('methode')),
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
  const prep = (qs) => qs.map((q) => ({ ...q, opts: shuffle(q.opts) }));
  // QCM intégré à l'application (cas normal).
  const showLocal = (id = sj.id) => {
    ac.current && ac.current.abort();
    loadQcm()
      .then((d) => {
        const f = d[id] && d[id].methode;
        setSt(f ? { status: 'ready', qs: prep(f), fixed: true } : { status: 'unavailable' });
        setN((x) => x + 1);
      })
      .catch(() => setSt({ status: 'unavailable' }));
  };
  // Nouveau QCM créé par Claude (claude.ai uniquement) ; en cas d'échec, retour au QCM intégré.
  const genClaude = () => {
    ac.current && ac.current.abort();
    const c = new AbortController();
    ac.current = c;
    setSt({ status: 'loading' });
    getSampler()
      .then((g) => {
        if (!g) return showLocal(sj.id);
        return g.json(methodePrompt(sj), { signal: c.signal }).then((r) => {
          const qs = r && r.questions;
          if (!isValidMethode(qs)) throw { code: 'bad' };
          setSt({ status: 'ready', qs: prep(qs.slice(0, 6)) });
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
    setFinishedIds(doneIds('methode'));
  };
  // QCM terminé : le sujet est coché comme fait.
  const finish = () => {
    markDone('methode', sj.id);
    setFinishedIds(doneIds('methode'));
  };
  // « Sujet suivant » : un autre sujet au hasard, pas encore fait, qui démarre tout de suite.
  const goNext = () => {
    const { id, newRound } = nextSubject('methode', sid);
    setSid(id);
    setFinishedIds(doneIds('methode'));
    setRoundMsg(newRound);
    showLocal(id);
    window.scrollTo(0, 0);
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
                {optionLabel(x, finishedIds)}
              </option>
            ))}
          </select>
          <button className="btn ghost" onClick={() => change(nextSubject('methode', sid).id)}>
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
              Commencer le QCM
            </button>
          </div>
        )}
      </div>
      {st.status === 'loading' && (
        <div className="panel">
          <p className="thinking">Claude prépare un nouveau QCM sur ce sujet…</p>
        </div>
      )}
      {st.status === 'unavailable' && (
        <div className="panel">
          <p>Le QCM de ce sujet n'est pas encore disponible. Choisis un autre sujet.</p>
        </div>
      )}
      {st.status === 'ready' && (
        <MethodeQuiz
          key={`${sid}-${n}-${st.fixed ? 'f' : 'g'}`}
          qs={st.qs}
          onDone={() => onWrite(sj.id)}
          onAgain={hasClaude ? genClaude : () => showLocal()}
          onFinish={finish}
          onNext={goNext}
          againLabel={hasClaude ? 'Nouveau QCM avec Claude' : 'Refaire ce QCM'}
        />
      )}
    </section>
  );
}
