import { useState } from 'react';
import CalcFree from './CalcFree.jsx';
import Series from './Series.jsx';
import SeriesResult from './SeriesResult.jsx';
import { addHist } from '../lib/storage.js';

function SerieBlock() {
  const [stage, setStage] = useState('intro'); // intro | run | done
  const [data, setData] = useState(null);

  if (stage === 'run')
    return (
      <Series
        onDone={(d) => {
          addHist({ t: 'serie', s: d.ok, m: d.qs.length });
          setData(d);
          setStage('done');
          window.scrollTo(0, 0);
        }}
      />
    );

  if (stage === 'done')
    return (
      <div className="view">
        <SeriesResult data={data} />
        <div>
          <button className="btn" onClick={() => setStage('intro')}>
            Nouvelle série
          </button>
        </div>
      </div>
    );

  return (
    <div className="panel">
      <h2>Série chronométrée</h2>
      <p>12 questions mélangeant les six thèmes, 30 minutes, correction à la fin. C'est le format de la sous-épreuve de calcul.</p>
      <div>
        <button className="btn" onClick={() => setStage('run')}>
          Commencer la série
        </button>
      </div>
    </div>
  );
}

export default function CalcPage({ mode, setMode }) {
  const [serieOpened, setSerieOpened] = useState(mode === 'serie');
  const choose = (m) => {
    setMode(m);
    if (m === 'serie') setSerieOpened(true);
  };
  return (
    <section className="view">
      <div className="seg">
        <button aria-pressed={mode === 'free'} onClick={() => choose('free')}>
          Entraînement libre
        </button>
        <button aria-pressed={mode === 'serie'} onClick={() => choose('serie')}>
          Série chronométrée · 12 questions · 30 min
        </button>
      </div>
      {/* Les deux modes restent montés : changer d'onglet n'arrête pas une série en cours. */}
      <div hidden={mode !== 'free'}>
        <CalcFree />
      </div>
      {(serieOpened || mode === 'serie') && (
        <div hidden={mode !== 'serie'}>
          <SerieBlock />
        </div>
      )}
    </section>
  );
}
