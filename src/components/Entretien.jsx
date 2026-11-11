import { useEffect, useRef, useState } from 'react';
import { getSampler, ERR } from '../lib/claude.js';
import { fmtTime } from '../lib/oralProfil.js';
import { ENTRETIEN_QUESTIONS, ENTRETIEN_MINUTES, ENTRETIEN_OUVERTURE, entretienPrompt, bilanPrompt } from '../lib/oralPrompts.js';
import Mic, { appendText } from './Mic.jsx';

// Bilan de l'entretien blanc : note sur 20, appréciation, points forts, question à retravailler, conseils.
function Bilan({ turns, used, onAgain }) {
  const [st, setSt] = useState({ status: 'loading' }),
    [n, setN] = useState(0);
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
        return g.json(bilanPrompt(turns, used), { signal: ac.signal }).then((r) => {
          alive && setSt({ status: 'done', r });
        });
      })
      .catch((e) => {
        alive && setSt({ status: 'error', code: e && e.code });
      });
    return () => {
      alive = false;
      ac.abort();
    };
  }, [n]);
  if (st.status === 'loading')
    return (
      <div className="panel">
        <p className="thinking">Le jury délibère…</p>
      </div>
    );
  if (st.status === 'unavailable')
    return (
      <div className="panel">
        <p>Le bilan par Claude n'est pas disponible ici.</p>
      </div>
    );
  if (st.status !== 'done')
    return (
      <div className="panel">
        <p>{ERR[st.code] || "Le bilan n'a pas abouti."}</p>
        <div>
          <button className="btn" onClick={() => setN((x) => x + 1)}>
            Réessayer
          </button>
        </div>
      </div>
    );
  const r = st.r || {},
    note = Math.max(0, Math.min(20, Number(r.note) || 0)),
    [cl, lab] =
      note >= 14 ? ['ok', 'Très convaincant'] : note >= 10 ? ['ok', 'Admissible'] : note >= 8 ? ['warn', 'Juste'] : ['bad', 'Éliminatoire'],
    L = (a) => (Array.isArray(a) ? a : []),
    rr = r.reponse_a_retravailler;
  return (
    <div className="panel">
      <h3>Bilan du jury</h3>
      <div className="score">
        <span className="big num">
          {String(note).replace('.', ',')}
          <small>/20</small>
        </span>
        <span className={`pill ${cl}`}>{lab}</span>
      </div>
      {r.appreciation && <p>{r.appreciation}</p>}
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
      {rr && rr.question && (
        <div className="conseil">
          <strong>{'À retravailler : '}</strong>
          {'« '}
          {rr.question}
          {' » — '}
          {rr.conseil}
        </div>
      )}
      {L(r.conseils).length > 0 && (
        <div>
          <h4>Pour le jour J</h4>
          <ul>
            {L(r.conseils).map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
      )}
      <p className="note">Note indicative d'entraînement : seul le vrai jury fixe ta note.</p>
      <div>
        <button className="btn" onClick={onAgain}>
          Refaire un entretien
        </button>
      </div>
    </div>
  );
}

// Entretien blanc de 20 minutes : Claude joue le jury, pose environ 8 questions tirées du dossier et relance si besoin.
export default function Entretien() {
  const [ph, setPh] = useState('intro'),
    [turns, setTurns] = useState([]),
    [txt, setTxt] = useState(''),
    [busy, setBusy] = useState(false),
    [err, setErr] = useState(null),
    [el, setEl] = useState(0),
    [used, setUsed] = useState(0),
    [k, setK] = useState(0),
    t0 = useRef(0),
    ac = useRef(null),
    endRef = useRef(null);
  useEffect(() => {
    if (ph !== 'live') return;
    t0.current = Date.now() - el * 1000;
    const it = setInterval(() => setEl(Math.floor((Date.now() - t0.current) / 1000)), 1000);
    return () => clearInterval(it);
  }, [ph]);
  useEffect(
    () => () => {
      ac.current && ac.current.abort();
    },
    [],
  );
  useEffect(() => {
    ph === 'live' && endRef.current && endRef.current.scrollIntoView({ block: 'nearest' });
  }, [turns.length, busy]);
  const nAns = turns.filter((x) => x.who === 'moi').length,
    left = ENTRETIEN_MINUTES * 60 - el;
  const finish = (tt) => {
    ac.current && ac.current.abort();
    setUsed(el);
    setTurns(tt);
    setBusy(false);
    setPh('bilan');
    window.scrollTo && document.getElementById('entretien') && document.getElementById('entretien').scrollIntoView({ block: 'start' });
  };
  const ask = (tt) => {
    setBusy(true);
    setErr(null);
    const c = new AbortController();
    ac.current = c;
    getSampler()
      .then((g) => {
        if (!g) throw { code: 'unavailable' };
        return g.json(entretienPrompt(tt, tt.filter((x) => x.who === 'moi').length), { signal: c.signal });
      })
      .then((r) => {
        const q = r && typeof r.question == 'string' && r.question.trim();
        if (!q) throw { code: 'bad' };
        setTurns([...tt, { who: 'jury', t: q }]);
        setBusy(false);
      })
      .catch((e) => {
        if (c.signal.aborted) return;
        setBusy(false);
        setErr(
          e && e.code === 'unavailable'
            ? "Le jury (Claude) n'est pas disponible ici."
            : ERR[e && e.code] || "Le jury n'a pas pu poser la question suivante.",
        );
      });
  };
  const send = () => {
    const a = txt.trim();
    if (!a || busy) return;
    const tt = [...turns, { who: 'moi', t: a }];
    setTxt('');
    if (tt.filter((x) => x.who === 'moi').length >= ENTRETIEN_QUESTIONS || left <= 0) {
      finish(tt);
      return;
    }
    setTurns(tt);
    ask(tt);
  };
  const start = () => {
    setTurns([{ who: 'jury', t: ENTRETIEN_OUVERTURE }]);
    setEl(0);
    setTxt('');
    setErr(null);
    setPh('live');
  };
  const again = () => {
    setPh('intro');
    setTurns([]);
    setEl(0);
    setK((x) => x + 1);
  };
  return (
    <section className="panel" id="entretien">
      <p className="eyebrow">Mise en situation</p>
      <h2>Entretien blanc de 20 minutes</h2>
      {ph === 'intro' && (
        <>
          <p>{`Claude joue le jury : il te pose environ ${ENTRETIEN_QUESTIONS} questions à partir de ton dossier et te relance quand une réponse est vague. Réponds à voix haute (dictée) ou par écrit. À la fin, tu reçois une note sur 20 et un bilan.`}</p>
          <p className="note">Fais-le dans un endroit calme, comme le jour J. Tu peux arrêter quand tu veux pour obtenir le bilan.</p>
          <div>
            <button className="btn" onClick={start}>
              Commencer l'entretien
            </button>
          </div>
        </>
      )}
      {ph === 'live' && (
        <>
          <div className="runbar">
            <span className={`timer num${left <= 120 ? ' low' : ''}`}>{fmtTime(Math.max(0, left))}</span>
            <span className="muted grow">
              {'Question '}
              {Math.min(nAns + 1, ENTRETIEN_QUESTIONS)}/{ENTRETIEN_QUESTIONS}
            </span>
            <button className="btn ghost" disabled={nAns < 2 || busy} onClick={() => finish(turns)}>
              Terminer et voir le bilan
            </button>
          </div>
          <div className="chat">
            {turns.map((x, i) => (
              <div key={i} className={`bubble ${x.who}`}>
                <span className="who">{x.who === 'jury' ? 'Le jury' : 'Toi'}</span>
                <p>{x.t}</p>
              </div>
            ))}
            {busy && (
              <div className="bubble jury">
                <p className="thinking">Le jury prend des notes…</p>
              </div>
            )}
            <div ref={endRef} />
          </div>
          {err && (
            <div className="row">
              <p className="fb bad" style={{ flex: 1 }}>
                {err}
              </p>
              <button className="btn ghost" onClick={() => ask(turns)}>
                Réessayer
              </button>
            </div>
          )}
          {!busy && !err && turns.length && turns[turns.length - 1].who === 'jury' && (
            <>
              <Mic onText={(t) => setTxt((p) => appendText(p, t))} />
              <label className="sr" htmlFor="entretien-txt">
                Ta réponse
              </label>
              <textarea
                id="entretien-txt"
                className="answer-area"
                style={{ minHeight: 140 }}
                value={txt}
                onChange={(e) => setTxt(e.target.value)}
                placeholder="Ta réponse au jury…"
              />
              <div>
                <button className="btn" disabled={!txt.trim()} onClick={send}>
                  {nAns + 1 >= ENTRETIEN_QUESTIONS ? 'Répondre et terminer' : 'Répondre'}
                </button>
              </div>
            </>
          )}
        </>
      )}
      {ph === 'bilan' && (
        <>
          <Bilan key={k} turns={turns} used={used} onAgain={again} />
          <details>
            <summary>Relire l'entretien</summary>
            <div className="chat" style={{ marginTop: 10 }}>
              {turns.map((x, i) => (
                <div key={i} className={`bubble ${x.who}`}>
                  <span className="who">{x.who === 'jury' ? 'Le jury' : 'Toi'}</span>
                  <p>{x.t}</p>
                </div>
              ))}
            </div>
          </details>
        </>
      )}
    </section>
  );
}
