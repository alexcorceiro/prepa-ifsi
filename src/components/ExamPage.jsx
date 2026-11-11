import { useRef, useState } from 'react';
import { SUBJ } from '../lib/subjects.js';
import { pick, f, words, plural } from '../lib/format.js';
import { addHist, save } from '../lib/storage.js';
import { clampNote } from '../lib/claude.js';
import Editor from './Editor.jsx';
import Series from './Series.jsx';
import SeriesResult from './SeriesResult.jsx';
import Correction from './Correction.jsx';

const top = () => window.scrollTo(0, 0);

function ExamResult({ exam, onAgain }) {
  const d = exam.calc;
  const cal20 = (d.ok / d.qs.length) * 20;
  const [note, setNote] = useState(undefined); // undefined = en cours, null = pas de note
  const entry = useRef(null);
  const estimate = (v) => Math.round(((v + cal20) / 2) * 10) / 10;

  const onResult = (r) => {
    const v = r ? clampNote(r) : null;
    setNote(v);
    if (!entry.current) {
      entry.current = addHist(
        v != null ? { t: 'exam', s: d.ok, m: d.qs.length, s2: v, e: estimate(v) } : { t: 'exam', s: d.ok, m: d.qs.length },
      );
    } else if (v != null) {
      Object.assign(entry.current, { s2: v, e: estimate(v) }); // note obtenue après un nouvel essai
      save();
    }
  };

  const est = note != null ? estimate(note) : null;
  const estColor = est == null ? undefined : est < 8 ? 'var(--bad)' : est < 10 ? 'var(--warn)' : 'var(--ok)';

  return (
    <div className="view">
      <h2>Résultats de l'examen blanc</h2>
      <div className="summary">
        <div>
          <span className="k">Calculs</span>
          <span className="n">
            {d.ok}/{d.qs.length}
          </span>
          <span className="muted">soit {f(Math.round(cal20 * 10) / 10)}/20</span>
        </div>
        <div>
          <span className="k">Rédaction</span>
          <span className="n">{note === undefined ? '…' : note === null ? '—' : `${f(note)}/20`}</span>
          <span className="muted">
            {note === undefined ? 'correction en cours' : note === null ? 'voir la grille ci-dessous' : exam.subj.title}
          </span>
        </div>
        <div>
          <span className="k">Écrit estimé</span>
          <span className="n" style={{ color: estColor }}>
            {note === undefined ? '…' : est == null ? '—' : `${f(est)}/20`}
          </span>
          <span className="muted">si les deux parties pèsent autant</span>
        </div>
      </div>
      <Correction subject={exam.subj} text={exam.text || ''} used={exam.used} onResult={onResult} />
      <h3>Détail des calculs</h3>
      <SeriesResult data={d} />
      <div>
        <button className="btn ghost" onClick={onAgain}>
          Refaire un examen blanc
        </button>
      </div>
    </div>
  );
}

// Examen blanc : rédaction 30 min, copie ramassée, calculs 30 min, résultats.
export default function ExamPage() {
  const [stage, setStage] = useState('intro'); // intro | redac | pause | calc | result
  const [exam, setExam] = useState({});
  const [run, setRun] = useState(0);

  if (stage === 'redac')
    return (
      <section className="view">
        <Editor
          key={run}
          subject={exam.subj}
          autoStart
          onSubmit={(text, used) => {
            setExam((e) => ({ ...e, text, used }));
            setStage('pause');
            top();
          }}
        />
      </section>
    );

  if (stage === 'pause') {
    const n = words(exam.text || '');
    return (
      <section className="view">
        <div className="panel">
          <p className="eyebrow">Copie ramassée</p>
          <h2>Rédaction terminée</h2>
          <p>
            Tu as écrit {plural(n, 'mot')} en {exam.used} min. La correction t'attend à la fin.
          </p>
          <p className="muted">Prochaine étape : 30 minutes de calculs.</p>
          <div>
            <button
              className="btn"
              onClick={() => {
                setStage('calc');
                top();
              }}
            >
              Commencer les calculs
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (stage === 'calc')
    return (
      <section className="view">
        <Series
          key={run}
          onDone={(d) => {
            setExam((e) => ({ ...e, calc: d }));
            setStage('result');
            top();
          }}
        />
      </section>
    );

  if (stage === 'result')
    return (
      <section className="view">
        <ExamResult
          key={run}
          exam={exam}
          onAgain={() => {
            setRun((r) => r + 1);
            setStage('intro');
            top();
          }}
        />
      </section>
    );

  return (
    <section className="view">
      <div className="panel">
        <h2>Examen blanc · 1 heure</h2>
        <ol className="plan">
          <li>
            <b>30 min</b>
            <span>Rédaction sur un sujet tiré au hasard. À la fin du temps, la copie est ramassée automatiquement.</span>
          </li>
          <li>
            <b>Pause</b>
            <span>Le jour J, les copies sont ramassées entre 14h00 et 14h15. Ici, tu enchaînes quand tu es prêt.</span>
          </li>
          <li>
            <b>30 min</b>
            <span>12 calculs, tous thèmes. Calculatrice simple uniquement.</span>
          </li>
          <li>
            <b>Résultats</b>
            <span>Correction détaillée des calculs et note de la rédaction.</span>
          </li>
        </ol>
        <p className="muted">Installe-toi au calme, téléphone de côté, une calculatrice simple et une feuille de brouillon.</p>
        <div>
          <button
            className="btn"
            onClick={() => {
              setExam({ subj: pick(SUBJ) });
              setStage('redac');
              top();
            }}
          >
            Commencer l'examen
          </button>
        </div>
      </div>
    </section>
  );
}
