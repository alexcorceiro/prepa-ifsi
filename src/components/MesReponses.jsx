import { useState } from 'react';
import { REPONSES_PERSO, loadOralNotes } from '../lib/oralProfil.js';

// Les trames des réponses personnelles, avec la dernière note obtenue pour chacune.
export default function MesReponses() {
  const [d] = useState(loadOralNotes);
  return (
    <section className="panel memo">
      <h2>Mes réponses personnelles</h2>
      <p className="muted">
        Les trames de tes réponses, construites à partir de ta lettre et de ton CV. Retiens les mots-clés, pas des phrases. Complète les
        [crochets] avec tes propres exemples.
      </p>
      {REPONSES_PERSO.map((q) => (
        <details key={q.id}>
          <summary>
            {q.q}
            {d[q.id] && d[q.id].note != null ? ` · dernière note ${String(d[q.id].note).replace('.', ',')}/10` : ''}
          </summary>
          <ul>
            {q.trame.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </details>
      ))}
    </section>
  );
}
