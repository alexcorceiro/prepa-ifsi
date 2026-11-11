import { useState } from 'react';
import RedactionCopiesQcm from './RedactionCopiesQcm.jsx';
import RedactionMethodeQcm from './RedactionMethodeQcm.jsx';
import RedactionWrite from './RedactionWrite.jsx';

// Onglet Rédaction : trois modes. Les deux QCM mènent à l'écriture sur le même sujet.
export default function RedactionPage() {
  const [mode, setMode] = useState('copies'); // copies | qcm | write
  const [writeKey, setWriteKey] = useState(0);
  const [writeId, setWriteId] = useState(null);

  const write = (id) => {
    setWriteId(id);
    setMode('write');
    setWriteKey((x) => x + 1);
    window.scrollTo(0, 0);
  };

  return (
    <section className="view">
      <div className="seg" role="group" aria-label="Mode de rédaction">
        <button aria-pressed={mode === 'copies'} onClick={() => setMode('copies')}>
          QCM : la meilleure copie
        </button>
        <button aria-pressed={mode === 'qcm'} onClick={() => setMode('qcm')}>
          QCM : la méthode
        </button>
        <button aria-pressed={mode === 'write'} onClick={() => setMode('write')}>
          Écrire ma copie · 30 min
        </button>
      </div>
      {mode === 'copies' ? (
        <RedactionCopiesQcm onWrite={write} />
      ) : mode === 'qcm' ? (
        <RedactionMethodeQcm onWrite={write} />
      ) : (
        <RedactionWrite key={writeKey} initId={writeId} />
      )}
    </section>
  );
}
