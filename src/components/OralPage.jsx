import { useState } from 'react';
import { QUESTIONS, THEMES, HAS_CLAUDE } from '../lib/oralQuestions.js';
import { addHist } from '../lib/storage.js';
import Quiz, { prepare } from './OralQuiz.jsx';
import OralMethode from './OralMethode.jsx';
import OralLibre from './OralLibre.jsx';
import Entretien from './Entretien.jsx';
import EntretienLocal from './EntretienLocal.jsx';
import MesReponses from './MesReponses.jsx';

const PRESETS = [
  ['Prescription + aide à mourir', ['actuPrescription', 'actuAide']],
  ['Mes 3 sujets d’actualité', ['actuPrescription', 'actuAide', 'actuMentale']],
  ['Tous les thèmes', Object.keys(THEMES)],
];

function Setup({ themes, setThemes, count, setCount, onStart }) {
  const pool = QUESTIONS.filter((q) => themes.has(q.theme));
  const toggle = (k) => {
    const n = new Set(themes);
    if (n.has(k)) {
      if (n.size === 1) return;
      n.delete(k);
    } else n.add(k);
    setThemes(n);
  };
  return (
    <div className="panel">
      <h2>QCM de l'oral</h2>
      <p>
        Pour chaque question du jury, choisis la réponse la plus convaincante. Chaque réponse est expliquée, même les mauvaises : c'est là
        que tu apprends ce que le jury attend.
      </p>
      <div className="view" style={{ gap: 10 }}>
        <b>Raccourcis</b>
        <div className="chips">
          {PRESETS.map(([label, keys]) => {
            const on = keys.length === themes.size && keys.every((k) => themes.has(k));
            return (
              <button key={label} type="button" className="chip" aria-pressed={on} onClick={() => setThemes(new Set(keys))}>
                {label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="view" style={{ gap: 10 }}>
        <b>Thèmes</b>
        <div className="chips">
          {Object.entries(THEMES).map(([k, label]) => (
            <button key={k} type="button" className="chip" aria-pressed={themes.has(k)} onClick={() => toggle(k)}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="view" style={{ gap: 10 }}>
        <b>Nombre de questions</b>
        <div className="seg">
          {[10, 20, 'all'].map((c) => (
            <button key={c} aria-pressed={count === c} onClick={() => setCount(c)}>
              {c === 'all' ? `Toutes (${pool.length})` : c}
            </button>
          ))}
        </div>
      </div>
      <div>
        <button className="btn" onClick={() => onStart(prepare(pool, count))}>
          Commencer le QCM
        </button>
      </div>
    </div>
  );
}

function Result({ answers, onRetry, onRetryMistakes, onSetup }) {
  const ok = answers.filter((a) => a.ok).length;
  const p = ok / answers.length;
  const [cls, label] = p >= 0.8 ? ['ok', 'Solide'] : p >= 0.6 ? ['warn', 'À consolider'] : ['bad', 'À retravailler'];
  const missed = answers.filter((a) => !a.ok);
  const byTheme = {};
  answers.forEach((a) => {
    const t = byTheme[a.q.theme] || (byTheme[a.q.theme] = { ok: 0, n: 0 });
    t.n++;
    if (a.ok) t.ok++;
  });

  return (
    <div className="view">
      <div className="panel">
        <div className="score">
          <span className="big num">
            {ok}
            <small>/{answers.length}</small>
          </span>
          <span className={`pill ${cls}`}>{label}</span>
        </div>
        <div className="bars">
          {Object.entries(byTheme).map(([k, t]) => {
            const r = t.ok / t.n;
            const color = r >= 0.8 ? 'var(--ok)' : r >= 0.6 ? 'var(--warn)' : 'var(--bad)';
            return (
              <div className="bar" key={k}>
                <span>{THEMES[k]}</span>
                <div className="track">
                  <div className="fill" style={{ width: `${Math.max(4, r * 100)}%`, background: color }} />
                </div>
                <span className="v">
                  {t.ok}/{t.n}
                </span>
              </div>
            );
          })}
        </div>
        <div className="row">
          {missed.length > 0 && (
            <button className="btn" onClick={() => onRetryMistakes(missed.map((a) => a.q))}>
              Refaire mes {missed.length} erreur{missed.length > 1 ? 's' : ''}
            </button>
          )}
          <button className={missed.length ? 'btn ghost' : 'btn'} onClick={onRetry}>
            Nouvelle série
          </button>
          <button className="btn ghost" onClick={onSetup}>
            Changer de thèmes
          </button>
        </div>
      </div>

      {missed.length > 0 && (
        <>
          <h3>Tes erreurs à revoir</h3>
          <ol className="review">
            {missed.map((a, k) => {
              const best = a.q.opts.find((o) => o.ok);
              return (
                <li key={k} className="bad">
                  <details>
                    <summary>
                      <span className="mark">✗</span>
                      <span>{a.q.jury ? `« ${a.q.q} »` : a.q.q}</span>
                    </summary>
                    <p>
                      Ta réponse : {a.q.opts[a.picked].t}
                      <br />
                      <span className="muted">{a.q.opts[a.picked].why}</span>
                    </p>
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
        </>
      )}
    </div>
  );
}

function Memo() {
  return (
    <section className="panel memo">
      <h2>Fiche mémo de l'oral</h2>
      <details open>
        <summary>Le déroulé</summary>
        <ul>
          <li>
            <b>20 minutes</b>, notées sur 20. Sous 8/20, c'est éliminatoire.
          </li>
          <li>Entre le 16 novembre et le 8 janvier, selon ta convocation, parfois avant l'écrit.</li>
          <li>L'entretien s'appuie sur ton dossier : CV, lettre de candidature, diplômes, attestations employeur et de formation.</li>
          <li>En pratique, il commence le plus souvent par ta présentation, puis le jury approfondit avec ses questions.</li>
        </ul>
      </details>
      <details>
        <summary>Les 7 thèmes à préparer</summary>
        <ol>
          <li>
            <b>Ton parcours</b> : « Pouvez-vous vous présenter ? », « Pourquoi quitter l'informatique ? »
          </li>
          <li>
            <b>Tes motivations</b> : « Pourquoi devenir infirmier ? », « Pourquoi maintenant ? »
          </li>
          <li>
            <b>Ta connaissance du métier</b> : missions, difficultés, lieux d'exercice.
          </li>
          <li>
            <b>Tes qualités</b> : stress, situations difficiles, travail en équipe, toujours avec un exemple vécu.
          </li>
          <li>
            <b>Ta capacité à suivre la formation</b> : organisation, financement, réaction aux difficultés.
          </li>
          <li>
            <b>Le contenu de la formation</b> : voir la méthode guidée « La formation ».
          </li>
          <li>
            <b>L'actualité santé et médico-sociale</b> : voir la méthode guidée « L'actualité ».
          </li>
        </ol>
      </details>
      <details>
        <summary>La trame de ta présentation (2 à 3 minutes)</summary>
        <ol>
          <li>Qui tu es, en une phrase.</li>
          <li>Ton parcours en informatique, en collectivité : ce que tu y as développé (écoute, explication, procédures, équipe).</li>
          <li>Le déclic : ce qui a fait naître ton projet.</li>
          <li>Ce que tu as fait pour découvrir le métier et la formation.</li>
          <li>Ton projet aujourd'hui et ton engagement pour la formation.</li>
        </ol>
        <p className="muted">Ne l'apprends pas mot pour mot : retiens des mots-clés et entraîne-toi à voix haute, chronométré.</p>
      </details>
      <details>
        <summary>La méthode pour répondre avec un exemple</summary>
        <p>
          <b>Situation</b> (le contexte, en une phrase) → <b>Action</b> (ce que tu as fait, toi) → <b>Résultat</b> →{' '}
          <b>Ce que tu en retiens</b> pour le métier d'infirmier.
        </p>
      </details>
    </section>
  );
}

const MODES = [
  ['repondre', 'Répondre au jury'],
  ['formation', 'Méthode : la formation'],
  ['actu', "Méthode : l'actualité"],
  ['entretien', 'Entretien blanc'],
  ['qcm', 'QCM et fiche mémo'],
];
const MODE_KEY = 'ifsi-oral-mode';

// Onglet Oral : cinq sous-parties. Tout fonctionne hors ligne ; Claude n'est utilisé que s'il est disponible (artifact claude.ai).
export default function OralPage() {
  const [mode, setModeState] = useState(() => {
    try {
      const m = localStorage.getItem(MODE_KEY);
      return MODES.some(([k]) => k === m) ? m : 'repondre';
    } catch {
      return 'repondre';
    }
  });
  const setMode = (m) => {
    setModeState(m);
    try {
      localStorage.setItem(MODE_KEY, m);
    } catch {
      /* ignoré */
    }
  };
  const [stage, setStage] = useState('setup'); // setup | quiz | result
  const [themes, setThemes] = useState(() => new Set(Object.keys(THEMES)));
  const [count, setCount] = useState(10);
  const [list, setList] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [run, setRun] = useState(0);

  const start = (l) => {
    setList(l);
    setRun((r) => r + 1);
    setStage('quiz');
    window.scrollTo(0, 0);
  };

  return (
    <section className="view">
      <div className="seg oral-modes" role="group" aria-label="Parties de l'oral">
        {MODES.map(([k, label]) => (
          <button key={k} aria-pressed={mode === k} onClick={() => setMode(k)}>
            {label}
          </button>
        ))}
      </div>
      {mode === 'repondre' && (
        <>
          <OralLibre />
          <MesReponses />
        </>
      )}
      {(mode === 'formation' || mode === 'actu') && <OralMethode key={mode} partie={mode} />}
      {mode === 'entretien' && (HAS_CLAUDE ? <Entretien /> : <EntretienLocal />)}
      {mode === 'qcm' && stage === 'setup' && (
        <>
          <Setup themes={themes} setThemes={setThemes} count={count} setCount={setCount} onStart={start} />
          <Memo />
        </>
      )}
      {mode === 'qcm' && stage === 'quiz' && (
        <Quiz
          key={run}
          list={list}
          onQuit={() => setStage('setup')}
          onDone={(a) => {
            addHist({ t: 'oral', s: a.filter((x) => x.ok).length, m: a.length });
            setAnswers(a);
            setStage('result');
            window.scrollTo(0, 0);
          }}
        />
      )}
      {mode === 'qcm' && stage === 'result' && (
        <Result
          answers={answers}
          onRetry={() =>
            start(
              prepare(
                QUESTIONS.filter((q) => themes.has(q.theme)),
                count,
              ),
            )
          }
          onRetryMistakes={(qs) => start(prepare(qs, 'all'))}
          onSetup={() => setStage('setup')}
        />
      )}
    </section>
  );
}
