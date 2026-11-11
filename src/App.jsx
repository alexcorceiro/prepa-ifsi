import { useState } from 'react';
import Home from './components/Home.jsx';
import CalcPage from './components/CalcPage.jsx';
import RedactionPage from './components/RedactionPage.jsx';
import ExamPage from './components/ExamPage.jsx';
import OralPage from './components/OralPage.jsx';
import { ORAL_START, ORAL_END, EXAM_DATE, daysUntil } from './lib/dates.js';

const TABS = [
  ['home', "Aujourd'hui"],
  ['calc', 'Calculs'],
  ['redac', 'Rédaction'],
  ['exam', 'Examen blanc'],
  ['oral', 'Oral'],
];

// Double compte à rebours : l'oral peut tomber avant l'écrit.
function Countdown() {
  const oralStart = daysUntil(ORAL_START);
  const oralEnd = daysUntil(ORAL_END);
  const exam = daysUntil(EXAM_DATE);
  return (
    <div className="countdown">
      {oralStart > 0 ? (
        <>
          Oral dès le 16 nov. <b>J-{oralStart}</b>
        </>
      ) : oralEnd >= 0 ? (
        <b>Oral : période en cours</b>
      ) : (
        'Oral passé'
      )}
      {' · '}
      {exam > 0 ? (
        <>
          Écrit <b>J-{exam}</b>
        </>
      ) : exam === 0 ? (
        <b>Écrit : jour J</b>
      ) : (
        'Écrit passé'
      )}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState(() => {
    const h = window.location.hash.slice(1);
    return TABS.some(([k]) => k === h) ? h : 'home';
  });
  const [calcMode, setCalcMode] = useState('free');
  const [homeKey, setHomeKey] = useState(0);

  const show = (v) => {
    setTab(v);
    if (v === 'home') setHomeKey((k) => k + 1); // relit la progression enregistrée
    window.scrollTo(0, 0);
  };

  return (
    <div className="wrap">
      <header className="top">
        <div className="brand">
          <i>IFSI</i>Prépa sélection
        </div>
        <Countdown />
      </header>

      <nav className="tabs" aria-label="Sections">
        {TABS.map(([k, label]) => (
          <button key={k} aria-current={tab === k ? 'page' : 'false'} onClick={() => show(k)}>
            {label}
          </button>
        ))}
      </nav>

      {/* Toutes les pages restent montées : changer d'onglet n'interrompt ni un chrono ni une copie. */}
      <div hidden={tab !== 'home'}>
        <Home
          key={homeKey}
          onGo={(v, mode) => {
            show(v);
            if (mode) setCalcMode(mode);
          }}
        />
      </div>
      <div hidden={tab !== 'calc'}>
        <CalcPage mode={calcMode} setMode={setCalcMode} />
      </div>
      <div hidden={tab !== 'redac'}>
        <RedactionPage />
      </div>
      <div hidden={tab !== 'exam'}>
        <ExamPage />
      </div>
      <div hidden={tab !== 'oral'}>
        <OralPage />
      </div>
    </div>
  );
}
