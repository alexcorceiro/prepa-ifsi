import { useState } from 'react';
import { QUESTIONS, THEMES } from '../lib/oralQuestions.js';
import { shuffle } from '../lib/format.js';
import { statOral, addHist } from '../lib/storage.js';
import OralLibre from './OralLibre.jsx';
import Entretien from './Entretien.jsx';
import MesReponses from './MesReponses.jsx';

const LETTERS = ['A', 'B', 'C', 'D'];

// Prépare une série : questions mélangées, et options mélangées dans chaque question.
const prepare = (pool, count) =>
  shuffle(pool)
    .slice(0, count === 'all' ? pool.length : Math.min(count, pool.length))
    .map((q) => ({ ...q, opts: shuffle(q.opts) }));

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

function Quiz({ list, onDone, onQuit }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [answers, setAnswers] = useState([]); // [{ q, picked, ok }]
  const q = list[i];
  const isLast = i === list.length - 1;

  const choose = (k) => {
    if (picked !== null) return;
    const ok = q.opts[k].ok;
    setPicked(k);
    statOral(q.theme, ok);
    setAnswers((a) => [...a, { q, picked: k, ok }]);
  };

  const next = () => {
    if (isLast) return onDone(answers);
    setI(i + 1);
    setPicked(null);
    window.scrollTo(0, 0);
  };

  const okSoFar = answers.filter((a) => a.ok).length;
  const right = picked !== null && q.opts[picked].ok;

  return (
    <div className="view">
      <div className="runbar">
        <span className="muted grow">
          Question {i + 1} sur {list.length}
          {answers.length > 0 && ` · ${okSoFar} bonne${okSoFar > 1 ? 's' : ''} réponse${okSoFar > 1 ? 's' : ''}`}
        </span>
        <button className="btn ghost" onClick={onQuit}>
          Arrêter
        </button>
      </div>
      <div className="progress" aria-hidden="true">
        <div style={{ width: `${((i + (picked !== null ? 1 : 0)) / list.length) * 100}%` }} />
      </div>

      <article className="qcard">
        <div className="qmeta">
          <span className="tag">{THEMES[q.theme]}</span>
        </div>
        {q.jury ? (
          <div className="jury">
            <span className="who">Le jury</span>
            <p className="qtext">« {q.q} »</p>
            <p className="muted">Quelle réponse convaincrait le mieux le jury ?</p>
          </div>
        ) : (
          <p className="qtext">{q.q}</p>
        )}

        <div className="opts" role="group" aria-label="Réponses">
          {q.opts.map((o, k) => {
            const state = picked === null ? '' : o.ok ? 'right' : k === picked ? 'wrong' : 'dim';
            return (
              <button key={k} type="button" className={`opt ${state}`} disabled={picked !== null} onClick={() => choose(k)}>
                <span className="l">{picked !== null && o.ok ? '✓' : picked === k ? '✗' : LETTERS[k]}</span>
                <span>{o.t}</span>
                {picked !== null && <span className="why">{o.why}</span>}
              </button>
            );
          })}
        </div>

        {picked !== null && (
          <>
            <div className={`fb ${right ? 'ok' : 'bad'}`}>
              <strong>{right ? 'Bonne réponse.' : 'Pas la meilleure réponse.'}</strong>{' '}
              {right ? 'Lis quand même les explications des autres options.' : 'La meilleure réponse est marquée ✓.'}
            </div>
            {q.tip && (
              <p className="conseil">
                <strong>Conseil :</strong> {q.tip}
              </p>
            )}
            <div>
              <button className="btn" onClick={next} autoFocus>
                {isLast ? 'Voir mon résultat' : 'Question suivante'}
              </button>
            </div>
          </>
        )}
      </article>
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
            <b>Le contenu de la formation</b> : durée, référentiel, stages, compétences.
          </li>
          <li>
            <b>L'actualité santé et médico-sociale</b> : 2 sujets maîtrisés, reliés au métier.
          </li>
        </ol>
      </details>
      <details>
        <summary>La formation en bref</summary>
        <ul>
          <li>
            <b>3 ans, 6 semestres, 180 ECTS</b> (30 par semestre) : diplôme d'État d'infirmier, <b>grade licence</b>, délivré par les
            universités.
          </li>
          <li>
            Ta promotion (septembre 2027) suivra le <b>référentiel du 20 février 2026</b> : 4 620 h, dont <b>66 semaines de stage</b> (2 310
            h), 1 890 h d'enseignement et 420 h de travail en autonomie.
          </li>
          <li>
            5 domaines : raisonnement clinique ; pratiques cliniques, qualité et risques ; prévention et promotion de la santé ;
            communication, équipe et leadership ; démarche scientifique et recherche.
          </li>
          <li>
            Le site de l'IFSI décrit encore le <b>référentiel de 2009</b> : 10 compétences (5 cœur de métier, 5 transverses), 2 100 h de
            théorie, 2 100 h de stage.
          </li>
          <li>
            Longjumeau : cours à l'IFSI et à l'Université Paris-Saclay (Kremlin-Bicêtre), stages hospitaliers et extrahospitaliers, suivi
            individuel par un formateur, dispenses possibles selon le parcours.
          </li>
          <li>
            Objectif : un <b>praticien autonome, responsable et réflexif</b>. Diplôme : 6 semestres validés + AFGSU 2.
          </li>
        </ul>
      </details>
      <details>
        <summary>L'actualité à connaître (au 19 novembre 2026)</summary>
        <ul>
          <li>
            <b>Loi infirmière du 27 juin 2025</b> : consultation infirmière, diagnostic infirmier, prescription encadrée. Arrêtés du 26 juin
            2026 : liste des produits prescrits (vaccins, pansements, substituts nicotiniques, antalgiques de palier 1…).
          </li>
          <li>
            <b>PLFSS 2027</b> : rejeté à l'Assemblée en 1re lecture, adopté au Sénat le 18 novembre ; CMP à suivre. ONDAM +2 %, déficit visé
            12,7 Md€.
          </li>
          <li>
            <b>Aide à mourir</b> : loi adoptée en juillet 2026, validée avec réserves par le Conseil constitutionnel, publiée en août ;
            décrets attendus. Autoadministration, clause de conscience.
          </li>
          <li>
            <b>Santé mentale</b> : grande cause nationale prolongée en 2026 ; objectif « zéro contention » en 2030 ; Mon soutien psy ; 3114.
          </li>
          <li>
            <b>Vaccination grippe et Covid</b> depuis le 13 octobre 2026, possible le même jour, aussi par les infirmiers.
          </li>
          <li>
            <b>Accès aux soins</b> : Médicobus (objectif 100 cabinets itinérants). <b>Grand âge</b> : APA, maintien à domicile.
          </li>
        </ul>
        <p className="muted">Vérifie les dernières infos la veille de ton oral : le PLFSS peut encore évoluer.</p>
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

// Onglet Oral : réponses chronométrées, entretien blanc, trames perso, QCM et fiche mémo.
export default function OralPage() {
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
      {stage === 'setup' && (
        <>
          <OralLibre />
          <Entretien />
          <MesReponses />
          <Setup themes={themes} setThemes={setThemes} count={count} setCount={setCount} onStart={start} />
          <Memo />
        </>
      )}
      {stage === 'quiz' && (
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
      {stage === 'result' && (
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
