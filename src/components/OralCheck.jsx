import { useState } from 'react';

export const ORAL_CRITERIA = [
  "J'ai répondu directement à la question posée.",
  'Ma réponse suit un fil : une idée, un exemple vécu, le lien avec le métier.',
  "J'ai cité au moins un exemple concret de mon parcours.",
  "J'ai respecté la durée conseillée.",
  "J'ai parlé avec mes mots, sans réciter.",
  "J'ai terminé par une phrase de conclusion claire.",
];

// Grille d'autoévaluation de l'oral : fonctionne sans connexion. onScore reçoit une note sur 10.
export default function OralCheck({ title = 'Évalue ta réponse', onScore }) {
  const [checked, setChecked] = useState(() => ORAL_CRITERIA.map(() => false));
  const [saved, setSaved] = useState(false);
  const n = checked.filter(Boolean).length;
  const note = Math.round((n / ORAL_CRITERIA.length) * 10);
  return (
    <div className="panel">
      <h3>{title}</h3>
      <p className="muted">Coche honnêtement ce que tu as réussi. Mieux encore : enregistre-toi et réécoute-toi.</p>
      <div className="check">
        {ORAL_CRITERIA.map((c, k) => (
          <label key={k}>
            <input
              type="checkbox"
              checked={checked[k]}
              onChange={() => {
                setSaved(false);
                setChecked((a) => a.map((v, j) => (j === k ? !v : v)));
              }}
            />
            {c}
          </label>
        ))}
      </div>
      <div className="row">
        <p className="num grow">
          <b>{note}/10</b> · {n} critère{n > 1 ? 's' : ''} sur {ORAL_CRITERIA.length}
        </p>
        {onScore && (
          <button
            className="btn ghost"
            onClick={() => {
              onScore(note);
              setSaved(true);
            }}
          >
            {saved ? 'Note enregistrée ✓' : 'Enregistrer ma note'}
          </button>
        )}
      </div>
    </div>
  );
}
