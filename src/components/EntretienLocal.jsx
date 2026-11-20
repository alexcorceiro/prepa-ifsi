import { useEffect, useRef, useState } from 'react';
import { QUESTIONS } from '../lib/oralQuestions.js';
import { REPONSES_PERSO, fmtTime } from '../lib/oralProfil.js';
import { shuffle } from '../lib/format.js';
import { addHist } from '../lib/storage.js';
import Mic, { appendText } from './Mic.jsx';
import OralCheck from './OralCheck.jsx';

const MINUTES = 20;

// Tirage de 8 questions, dans l'ordre d'un vrai entretien.
function tirage() {
  const perso = REPONSES_PERSO.filter((x) => x.id !== 'pres');
  const jury = (themes) => shuffle(QUESTIONS.filter((q) => q.jury && themes.includes(q.theme) && !q.q.startsWith('«')));
  const toItem = (q) => ({ q: q.q, best: q.opts.find((o) => o.ok), tip: q.tip });
  return [
    { q: REPONSES_PERSO[0].q, trame: REPONSES_PERSO[0].trame, sec: REPONSES_PERSO[0].sec },
    ...shuffle(perso)
      .slice(0, 4)
      .map((x) => ({ q: x.q, trame: x.trame, sec: x.sec })),
    toItem(jury(['metier', 'qualites'])[0]),
    toItem(jury(['contenu', 'formation'])[0]),
    toItem(jury(['actu'])[0]),
  ];
}

// Ce qu'attend le jury pour une question : la trame perso ou la meilleure réponse du QCM.
function Attendu({ it }) {
  return (
    <div className="panel attendu">
      <h4>Ce qu'attend le jury</h4>
      {it.trame ? (
        <ul>
          {it.trame.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      ) : (
        <>
          <p>{it.best.t}</p>
          <p className="muted">{it.best.why}</p>
        </>
      )}
      {it.tip && (
        <p className="conseil">
          <strong>Conseil :</strong> {it.tip}
        </p>
      )}
    </div>
  );
}

// Entretien blanc de 20 minutes, entièrement hors ligne : l'app joue le jury avec 8 questions tirées au hasard.
export default function EntretienLocal() {
  const [ph, setPh] = useState('intro'); // intro | live | bilan
  const [items, setItems] = useState([]);
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(false);
  const [txt, setTxt] = useState('');
  const [el, setEl] = useState(0);
  const t0 = useRef(0);

  useEffect(() => {
    if (ph !== 'live') return;
    t0.current = Date.now() - el * 1000;
    const it = setInterval(() => setEl(Math.floor((Date.now() - t0.current) / 1000)), 1000);
    return () => clearInterval(it);
  }, [ph]);

  const left = MINUTES * 60 - el;
  const it = items[i];
  const isLast = i === items.length - 1;
  const top = () => {
    const e = document.getElementById('entretien');
    e && e.scrollIntoView && e.scrollIntoView({ block: 'start' });
  };

  const start = () => {
    setItems(tirage());
    setI(0);
    setShown(false);
    setTxt('');
    setEl(0);
    setPh('live');
  };
  const next = () => {
    if (isLast) {
      setPh('bilan');
      top();
      return;
    }
    setI(i + 1);
    setShown(false);
    setTxt('');
    top();
  };

  return (
    <section className="panel" id="entretien">
      <p className="eyebrow">Mise en situation</p>
      <h2>Entretien blanc de 20 minutes</h2>
      {ph === 'intro' && (
        <>
          <p>
            L'app joue le jury : 8 questions dans l'ordre d'un vrai entretien. D'abord ta présentation, puis ton parcours et tes
            motivations, le métier, la formation et l'actualité. Réponds à voix haute, puis découvre ce qu'attend le jury.
          </p>
          <p className="note">
            Fais-le debout ou assis à une table, dans un endroit calme, comme le jour J. Les questions changent à chaque fois.
          </p>
          <div>
            <button className="btn" onClick={start}>
              Commencer l'entretien
            </button>
          </div>
        </>
      )}
      {ph === 'live' && it && (
        <>
          <div className="runbar">
            <span className={`timer num${left <= 120 ? ' low' : ''}`}>{fmtTime(Math.max(0, left))}</span>
            <span className="muted grow">
              Question {i + 1}/{items.length}
            </span>
            <button className="btn ghost" onClick={() => setPh('bilan')}>
              Terminer
            </button>
          </div>
          <div className="progress" aria-hidden="true">
            <div style={{ width: `${(i / items.length) * 100}%` }} />
          </div>
          <div className="jury">
            <span className="who">Le jury</span>
            <p className="qtext">« {it.q} »</p>
            {it.sec && <p className="muted">Durée conseillée : {fmtTime(it.sec)}</p>}
          </div>
          {!shown ? (
            <>
              <Mic onText={(t) => setTxt((p) => appendText(p, t))} />
              <label className="sr" htmlFor="entretien-txt">
                Tes notes
              </label>
              <textarea
                id="entretien-txt"
                className="answer-area"
                value={txt}
                onChange={(e) => setTxt(e.target.value)}
                placeholder="Réponds à voix haute. Tu peux aussi dicter ou noter tes idées ici (facultatif)."
              />
              <div>
                <button className="btn" onClick={() => setShown(true)}>
                  J'ai répondu : voir ce qu'attend le jury
                </button>
              </div>
            </>
          ) : (
            <>
              <Attendu it={it} />
              <div>
                <button className="btn" onClick={next} autoFocus>
                  {isLast ? 'Voir mon bilan' : 'Question suivante'}
                </button>
              </div>
            </>
          )}
          {left <= 0 && <p className="fb bad">Les 20 minutes sont écoulées : le jury conclurait l'entretien.</p>}
        </>
      )}
      {ph === 'bilan' && (
        <>
          <p>
            Durée : <b className="num">{fmtTime(el)}</b> pour {Math.min(i + 1, items.length)} question
            {i > 0 ? 's' : ''}.
          </p>
          <OralCheck title="Évalue ton entretien" onScore={(note) => addHist({ t: 'oral', s: note, m: 10 })} />
          <h3>Les questions posées</h3>
          <ol className="review">
            {items.slice(0, i + 1).map((x, k) => (
              <li key={k}>
                <details>
                  <summary>
                    <span>« {x.q} »</span>
                  </summary>
                  <Attendu it={x} />
                </details>
              </li>
            ))}
          </ol>
          <div>
            <button className="btn" onClick={start}>
              Nouvel entretien
            </button>
          </div>
        </>
      )}
    </section>
  );
}
