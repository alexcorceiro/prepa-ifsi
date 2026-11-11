import { useEffect, useRef, useState } from 'react';
import { words, plural } from '../lib/format.js';
import { getSampler, ERR } from '../lib/claude.js';
import { REPONSES_PERSO, loadOralNotes, saveOralNotes, fmtTime } from '../lib/oralProfil.js';
import { reponsePrompt } from '../lib/oralPrompts.js';
import Mic, { appendText } from './Mic.jsx';

// Correction d'une réponse par Claude : note sur 10, points forts, à améliorer, version améliorée, conseil.
function ReponseCorrection({ q, txt, used, onSaved }) {
  const [st, setSt] = useState({ status: 'loading' }),
    [n, setN] = useState(0),
    cb = useRef(onSaved);
  cb.current = onSaved;
  useEffect(() => {
    let alive = true;
    const ac = new AbortController();
    setSt({ status: 'loading' });
    getSampler()
      .then((g) => {
        if (!alive) return;
        if (!g) {
          setSt({ status: 'unavailable' });
          return;
        }
        return g.json(reponsePrompt(q, txt, used), { signal: ac.signal }).then((r) => {
          if (alive) {
            setSt({ status: 'done', r });
            cb.current && cb.current(r);
          }
        });
      })
      .catch((e) => {
        if (!alive) return;
        const c = e && e.code;
        setSt({ status: c === 'cancelled' ? 'cancelled' : 'error', code: c });
      });
    return () => {
      alive = false;
      ac.abort();
    };
  }, [n]);
  if (st.status === 'loading')
    return (
      <div className="panel">
        <p className="thinking">Le jury lit ta réponse…</p>
      </div>
    );
  if (st.status === 'unavailable')
    return (
      <div className="panel">
        <p>La correction par Claude n'est pas disponible ici. Compare ta réponse à ta trame ci-dessous.</p>
      </div>
    );
  if (st.status !== 'done')
    return (
      <div className="panel">
        <p>{ERR[st.code] || "La correction n'a pas abouti."}</p>
        <div>
          <button className="btn ghost" onClick={() => setN((x) => x + 1)}>
            Réessayer
          </button>
        </div>
      </div>
    );
  const r = st.r || {},
    note = Math.max(0, Math.min(10, Number(r.note) || 0)),
    [cl, lab] = note >= 7 ? ['ok', 'Convaincant'] : note >= 5 ? ['warn', 'À consolider'] : ['bad', 'À retravailler'],
    L = (a) => (Array.isArray(a) ? a : []);
  return (
    <div className="panel">
      <div className="score">
        <span className="big num">
          {String(note).replace('.', ',')}
          <small>/10</small>
        </span>
        <span className={`pill ${cl}`}>{lab}</span>
      </div>
      <div className="two">
        <div>
          <h4>Points forts</h4>
          <ul>
            {L(r.points_forts).map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>À améliorer</h4>
          <ul>
            {L(r.a_ameliorer).map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
      </div>
      {r.version_amelioree && (
        <div>
          <h4>Ta réponse, en mieux</h4>
          <blockquote className="better-answer">{r.version_amelioree}</blockquote>
          <p className="note">
            Ne l'apprends pas par cœur : reprends les idées avec tes mots. Remplace chaque [crochet] par ton propre exemple.
          </p>
        </div>
      )}
      {r.conseil && (
        <p className="conseil">
          <strong>Conseil :</strong> {r.conseil}
        </p>
      )}
    </div>
  );
}

// Trame de réponse construite à partir du dossier.
function Trame({ q }) {
  return (
    <details className="trame">
      <summary>Voir ma trame de réponse</summary>
      <ul>
        {q.trame.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </details>
  );
}

// « Réponds comme devant le jury » : une question, un chrono avec durée conseillée, la dictée et la correction.
export default function OralLibre() {
  const [qid, setQid] = useState('pres'),
    [txt, setTxt] = useState(''),
    [run, setRun] = useState(false),
    [el, setEl] = useState(0),
    [phase, setPhase] = useState('answer'),
    [used, setUsed] = useState(null),
    [k, setK] = useState(0),
    t0 = useRef(null),
    q = REPONSES_PERSO.find((x) => x.id === qid) || REPONSES_PERSO[0];
  useEffect(() => {
    if (!run) return;
    t0.current = Date.now() - el * 1000;
    const it = setInterval(() => setEl(Math.floor((Date.now() - t0.current) / 1000)), 500);
    return () => clearInterval(it);
  }, [run]);
  const reset = (id) => {
      setRun(false);
      setEl(0);
      setTxt('');
      setPhase('answer');
      setUsed(null);
      id && setQid(id);
    },
    w = words(txt),
    over = el > q.sec,
    idx = REPONSES_PERSO.indexOf(q),
    nextQ = REPONSES_PERSO[(idx + 1) % REPONSES_PERSO.length];
  const submit = () => {
    setRun(false);
    setUsed(el || null);
    setPhase('result');
    setK((x) => x + 1);
    window.scrollTo && document.getElementById('oral-libre') && document.getElementById('oral-libre').scrollIntoView({ block: 'start' });
  };
  const saved = (r) => {
    const d = loadOralNotes();
    d[q.id] = { txt, note: Number(r && r.note) || null, d: new Date().toISOString() };
    saveOralNotes(d);
  };
  return (
    <section className="panel" id="oral-libre">
      <p className="eyebrow">Le plus important</p>
      <h2>Réponds comme devant le jury</h2>
      <p>
        Choisis une question, lance le chrono et réponds à voix haute, comme le jour J. Écris ensuite ce que tu as dit (ou réponds
        directement par écrit), puis fais corriger ta réponse.
      </p>
      <label className="view" style={{ gap: 6 }}>
        <b>Question</b>
        <select value={qid} onChange={(e) => reset(e.target.value)}>
          {REPONSES_PERSO.map((x) => (
            <option key={x.id} value={x.id}>
              {x.q}
            </option>
          ))}
        </select>
      </label>
      <div className="jury">
        <span className="who">Le jury</span>
        <p className="qtext">
          {'« '}
          {q.q}
          {' »'}
        </p>
        <p className="muted">
          {'Durée conseillée : '}
          {fmtTime(q.sec)}
        </p>
      </div>
      {phase === 'answer' && (
        <>
          <div className="runbar">
            <span className={`timer num${over ? ' low' : ''}`}>
              {fmtTime(el)}
              <small className="muted" style={{ fontSize: '.9rem' }}>
                {' / '}
                {fmtTime(q.sec)}
              </small>
            </span>
            <button className="btn ghost" onClick={() => setRun((x) => !x)}>
              {run ? 'Pause' : el ? 'Reprendre' : 'Lancer le chrono'}
            </button>
            <span className="muted grow num">{plural(w, 'mot')}</span>
            <button className="btn" disabled={w < 15} onClick={submit}>
              Faire corriger
            </button>
          </div>
          {over && <p className="fb bad">Durée conseillée dépassée : au jury, une réponse trop longue perd en clarté.</p>}
          <Mic onText={(t) => setTxt((p) => appendText(p, t))} />
          <label className="sr" htmlFor="oral-libre-txt">
            Ta réponse
          </label>
          <textarea
            id="oral-libre-txt"
            className="answer-area"
            value={txt}
            onChange={(e) => setTxt(e.target.value)}
            placeholder="Dicte ou écris ici ce que tu as dit au jury (au moins quelques phrases)."
          />
          <p className="note">{w < 15 ? 'Écris au moins 15 mots pour obtenir une correction.' : 'Prêt ? Clique sur « Faire corriger ».'}</p>
        </>
      )}
      {phase === 'result' && (
        <>
          <details>
            <summary>Ta réponse</summary>
            <p style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>{txt}</p>
          </details>
          <ReponseCorrection key={k} q={q} txt={txt} used={used} onSaved={saved} />
          <div className="row">
            <button className="btn" onClick={() => reset()}>
              Recommencer cette question
            </button>
            <button className="btn ghost" onClick={() => reset(nextQ.id)}>
              Question suivante
            </button>
          </div>
        </>
      )}
      <Trame key={q.id} q={q} />
    </section>
  );
}
