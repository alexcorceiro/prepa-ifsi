import { useState } from 'react';

const CRITERIA = [
  "J'ai répondu à toutes les questions posées.",
  'Ma copie suit un plan : introduction, développement, conclusion.',
  'Chaque argument est expliqué et illustré par un exemple.',
  "J'ai reformulé avec mes mots au lieu de recopier le texte.",
  "J'ai relu l'orthographe et les accords.",
  "J'ai fait le lien avec le métier d'infirmier.",
];

// Grille d'autoévaluation, utilisée quand Claude n'est pas disponible.
export default function SelfEval({ message }) {
  const [checked, setChecked] = useState(() => CRITERIA.map(() => false));
  return (
    <div className="panel">
      <h3>Grille d'autoévaluation</h3>
      {message && <p className="muted">{message}</p>}
      <div className="check">
        {CRITERIA.map((c, k) => (
          <label key={k}>
            <input type="checkbox" checked={checked[k]} onChange={() => setChecked((a) => a.map((v, j) => (j === k ? !v : v)))} />
            {c}
          </label>
        ))}
      </div>
      <p className="num">
        {checked.filter(Boolean).length} / {CRITERIA.length}
      </p>
    </div>
  );
}
