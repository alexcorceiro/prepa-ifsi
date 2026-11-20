import { useState } from 'react';
import { METHODES, MAJ, questionById } from '../lib/oralQuestions.js';
import { addHist } from '../lib/storage.js';
import Quiz, { prepare } from './OralQuiz.jsx';

// Résultats par étape, gardés dans ce navigateur : { [partie]: { [etape]: { ok, n } } }
const KEY = 'ifsi-oral-methode-v1';
const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}') || {};
  } catch {
    return {};
  }
};
const persist = (d) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(d));
  } catch {
    /* ignoré */
  }
};

const fmtMaj = (d) => {
  const [y, m, j] = String(d || '').split('-');
  return y ? `${Number(j)}/${Number(m)}/${y}` : '';
};

const level = (ok, n) => (ok / n >= 0.8 ? 'ok' : ok / n >= 0.6 ? 'warn' : 'bad');

// Méthode guidée : pour chaque étape, la méthode et la phrase à dire, puis un QCM pour l'ancrer.
export default function OralMethode({ partie }) {
  const P = METHODES.find((m) => m.id === partie) || METHODES[0];
  const [res, setRes] = useState(load);
  const [idx, setIdx] = useState(() => {
    const done = load()[P.id] || {};
    const k = P.etapes.findIndex((e) => !done[e.id]);
    return k < 0 ? 0 : k;
  });
  const [phase, setPhase] = useState('learn'); // learn | quiz | step | bilan
  const [list, setList] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [run, setRun] = useState(0);

  const E = P.etapes[idx];
  const mine = res[P.id] || {};
  const isLast = idx === P.etapes.length - 1;
  const top = () => window.scrollTo && window.scrollTo(0, 0);

  const go = (k) => {
    setIdx(k);
    setPhase('learn');
    top();
  };
  const startQuiz = (qs) => {
    setList(prepare(qs, 'all'));
    setRun((r) => r + 1);
    setPhase('quiz');
    top();
  };
  const done = (a) => {
    const ok = a.filter((x) => x.ok).length;
    const d = { ...res, [P.id]: { ...mine, [E.id]: { ok, n: a.length } } };
    setRes(d);
    persist(d);
    addHist({ t: 'oral', s: ok, m: a.length });
    setAnswers(a);
    setPhase('step');
    top();
  };
  const reset = () => {
    const d = { ...res, [P.id]: {} };
    setRes(d);
    persist(d);
    go(0);
  };

  const steps = (
    <ol className="msteps" aria-label="Étapes de la méthode">
      {P.etapes.map((e, k) => {
        const r = mine[e.id];
        return (
          <li key={e.id}>
            <button type="button" aria-current={k === idx && phase !== 'bilan' ? 'step' : undefined} onClick={() => go(k)}>
              <span className={`n ${r ? level(r.ok, r.n) : ''}`}>{r ? '✓' : k + 1}</span>
              <span className="t">{e.titre}</span>
              {r && (
                <span className="s num">
                  {r.ok}/{r.n}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ol>
  );

  if (phase === 'quiz')
    return (
      <div className="view">
        <p className="eyebrow">
          Étape {idx + 1} sur {P.etapes.length} · {E.titre}
        </p>
        <Quiz key={run} list={list} onDone={done} onQuit={() => setPhase('learn')} />
      </div>
    );

  if (phase === 'step') {
    const ok = answers.filter((a) => a.ok).length;
    const missed = answers.filter((a) => !a.ok);
    const cls = level(ok, answers.length);
    return (
      <div className="view">
        <section className="panel">
          <p className="eyebrow">
            Étape {idx + 1} sur {P.etapes.length}
          </p>
          <h2>{E.titre}</h2>
          <div className="score">
            <span className="big num">
              {ok}
              <small>/{answers.length}</small>
            </span>
            <span className={`pill ${cls}`}>{cls === 'ok' ? 'Acquis' : cls === 'warn' ? 'À consolider' : 'À revoir'}</span>
          </div>
          <blockquote className="mphrase">{E.phrase}</blockquote>
          <p className="muted">Redis cette phrase à voix haute avec tes mots avant de passer à la suite.</p>
          <div className="row">
            {isLast ? (
              <button className="btn" onClick={() => setPhase('bilan')}>
                Voir mon bilan
              </button>
            ) : (
              <button className="btn" onClick={() => go(idx + 1)}>
                Étape suivante
              </button>
            )}
            {missed.length > 0 && (
              <button className="btn ghost" onClick={() => startQuiz(missed.map((a) => questionById(a.q.id)))}>
                Refaire mes {missed.length} erreur{missed.length > 1 ? 's' : ''}
              </button>
            )}
            <button className="btn ghost" onClick={() => go(idx)}>
              Relire la méthode
            </button>
          </div>
        </section>
        {missed.length > 0 && (
          <ol className="review">
            {missed.map((a, k) => {
              const best = a.q.opts.find((o) => o.ok);
              return (
                <li key={k} className="bad">
                  <details open>
                    <summary>
                      <span className="mark">✗</span>
                      <span>{a.q.jury ? `« ${a.q.q} »` : a.q.q}</span>
                    </summary>
                    <p>
                      <b>Meilleure réponse :</b> {best.t}
                      <br />
                      <span className="muted">{best.why}</span>
                    </p>
                  </details>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    );
  }

  if (phase === 'bilan') {
    const tot = P.etapes.reduce((s, e) => s + (mine[e.id] ? mine[e.id].ok : 0), 0);
    const n = P.etapes.reduce((s, e) => s + (mine[e.id] ? mine[e.id].n : 0), 0);
    const weak = P.etapes.filter((e) => mine[e.id] && level(mine[e.id].ok, mine[e.id].n) !== 'ok');
    return (
      <div className="view">
        <section className="panel">
          <p className="eyebrow">Bilan</p>
          <h2>{P.titre}</h2>
          <div className="score">
            <span className="big num">
              {tot}
              <small>/{n}</small>
            </span>
            {n > 0 && <span className={`pill ${level(tot, n)}`}>{level(tot, n) === 'ok' ? 'Prêt pour le jury' : 'Encore un tour'}</span>}
          </div>
          {steps}
          <p>
            {weak.length
              ? `Reprends en priorité : ${weak.map((e) => e.titre).join(' ; ')}.`
              : 'Toutes les étapes sont acquises. Entraîne-toi maintenant à répondre à voix haute, chronométré.'}
          </p>
          <div className="row">
            {weak.length > 0 && (
              <button className="btn" onClick={() => go(P.etapes.indexOf(weak[0]))}>
                Reprendre « {weak[0].titre} »
              </button>
            )}
            <button className={weak.length ? 'btn ghost' : 'btn'} onClick={reset}>
              Recommencer la méthode
            </button>
          </div>
        </section>
      </div>
    );
  }

  // learn
  const qs = E.questions.map(questionById).filter(Boolean);
  return (
    <div className="view">
      <section className="panel">
        <p className="eyebrow">Méthode guidée</p>
        <h2>{P.titre}</h2>
        <p>{P.intro}</p>
        {steps}
      </section>
      <section className="panel mcard">
        <p className="eyebrow">
          Étape {idx + 1} sur {P.etapes.length}
        </p>
        <h3>{E.titre}</h3>
        <ol className="mlist">
          {E.methode.map((m, k) => (
            <li key={k}>{m}</li>
          ))}
        </ol>
        <div className="jury">
          <span className="who">À dire au jury</span>
          <p className="qtext">{E.phrase}</p>
        </div>
        <div className="row">
          <button className="btn" onClick={() => startQuiz(qs)}>
            QCM de l'étape · {qs.length} questions
          </button>
          {idx > 0 && (
            <button className="btn ghost" onClick={() => go(idx - 1)}>
              Étape précédente
            </button>
          )}
        </div>
      </section>
      {P.id === 'actu' && MAJ && <p className="note">Informations à jour au {fmtMaj(MAJ)} : vérifie l'actualité la veille de ton oral.</p>}
    </div>
  );
}
