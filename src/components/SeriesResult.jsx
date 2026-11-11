import { fmtAns } from '../lib/generators.js';
import Steps from './Steps.jsx';

// Résultat d'une série : score et correction ligne par ligne.
export default function SeriesResult({ data }) {
  const p = data.ok / data.qs.length;
  const [cls, label] = p >= 0.75 ? ['ok', 'Solide'] : p >= 0.5 ? ['warn', 'À consolider'] : ['bad', 'À retravailler'];
  return (
    <div className="panel">
      <div className="score">
        <span className="big num">
          {data.ok}
          <small>/{data.qs.length}</small>
        </span>
        <span className={`pill ${cls}`}>{label}</span>
        <span className="muted">en {data.used} min</span>
      </div>
      <p className="muted">Ouvre chaque ligne pour voir la méthode.</p>
      <ol className="review">
        {data.qs.map((o, k) => (
          <li key={k} className={data.res[k] ? 'ok' : 'bad'}>
            <details>
              <summary>
                <span className="mark">{data.res[k] ? '✓' : '✗'}</span>
                <span>{o.q}</span>
              </summary>
              <p>
                Ta réponse : <b className="num">{data.ans[k].trim() || 'aucune'}</b> · Attendu : <b className="num">{fmtAns(o)}</b>
              </p>
              <Steps question={o} />
            </details>
          </li>
        ))}
      </ol>
    </div>
  );
}
