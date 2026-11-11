import { useEffect, useRef, useState } from 'react';
import { getSampler, buildPrompt, ERR, isRetryable, clampNote } from '../lib/claude.js';
import { f, words, plural } from '../lib/format.js';
import SelfEval from './SelfEval.jsx';

const list = (a) => (Array.isArray(a) ? a : []);

function CorrectionView({ r }) {
  const note = clampNote(r);
  const [cls, label] = note >= 12 ? ['ok', 'Solide'] : note >= 10 ? ['warn', 'Correct, à renforcer'] : ['bad', 'À retravailler'];
  return (
    <div className="panel">
      <h3>Correction de ta rédaction</h3>
      <div className="score">
        <span className="big num">
          {f(note)}
          <small>/20</small>
        </span>
        <span className={`pill ${cls}`}>{label}</span>
      </div>
      <p className="muted">
        Note estimée par Claude avec la grille ci-dessous. Le jury réel peut noter différemment : sers-t'en pour repérer tes points à
        travailler.
      </p>
      <div className="crit">
        {list(r.criteres).map((k, i) => {
          const max = Number(k.max) || 1;
          const v = Math.max(0, Math.min(max, Number(k.note) || 0));
          return (
            <div className="c" key={i}>
              <b>{k.nom}</b>
              <span className="v">
                {f(v)}/{f(max)}
              </span>
              <div className="track">
                <div className="fill" style={{ width: `${(v / max) * 100}%` }} />
              </div>
              <p>{k.commentaire}</p>
            </div>
          );
        })}
      </div>
      <div className="two">
        <div>
          <h4>Points forts</h4>
          <ul>
            {list(r.points_forts).map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>À améliorer</h4>
          <ul>
            {list(r.a_ameliorer).map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
      </div>
      {list(r.corrections).length > 0 && (
        <div>
          <h4>Langue : corrections</h4>
          <ul className="fixes">
            {list(r.corrections).map((x, i) => (
              <li key={i}>
                <s>{x.erreur}</s> → <b>{x.correction}</b>
              </li>
            ))}
          </ul>
        </div>
      )}
      {r.conseil && (
        <p className="conseil">
          <strong>Priorité pour la prochaine copie :</strong> {r.conseil}
        </p>
      )}
    </div>
  );
}

// Envoie la copie à Claude et affiche la correction.
// onResult(r) reçoit la correction, ou null si elle n'a pas pu être faite.
export default function Correction({ subject, text, used, onResult }) {
  const n = words(text);
  const [state, setState] = useState({ status: n < 30 ? 'short' : 'loading' });
  const [attempt, setAttempt] = useState(0);
  const ctlRef = useRef(null);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  useEffect(() => {
    if (n < 30) {
      onResultRef.current?.(null);
      return undefined;
    }
    let alive = true;
    const ctl = new AbortController();
    ctlRef.current = ctl;
    setState({ status: 'loading' });
    getSampler()
      .then((sample) => {
        if (!alive) return undefined;
        if (!sample) {
          setState({ status: 'unavailable' });
          onResultRef.current?.(null);
          return undefined;
        }
        return sample.json(buildPrompt(subject, text, used), { signal: ctl.signal }).then((r) => {
          if (!alive) return;
          setState({ status: 'done', r });
          onResultRef.current?.(r);
        });
      })
      .catch((e) => {
        if (!alive) return;
        const code = e && e.code;
        setState({ status: code === 'cancelled' ? 'cancelled' : 'error', code });
        if (code !== 'cancelled') onResultRef.current?.(null);
      });
    return () => {
      alive = false;
      ctl.abort();
    };
  }, [attempt]); // eslint-disable-line react-hooks/exhaustive-deps

  const retry = () => setAttempt((a) => a + 1);

  switch (state.status) {
    case 'short':
      return (
        <div className="view">
          <div className="panel">
            <p>Ta copie fait {plural(n, 'mot')}. Écris au moins quelques phrases pour obtenir une note.</p>
          </div>
          <SelfEval />
        </div>
      );
    case 'unavailable':
      return <SelfEval message="La correction par Claude n'est pas disponible ici. Utilise la grille pour relire ta copie." />;
    case 'loading':
      return (
        <div className="panel">
          <p className="thinking">Correction en cours. Cela peut prendre jusqu'à une minute.</p>
          <div>
            <button className="btn ghost" onClick={() => ctlRef.current?.abort()}>
              Arrêter
            </button>
          </div>
        </div>
      );
    case 'cancelled':
      return (
        <div className="panel">
          <p>Correction arrêtée.</p>
          <div>
            <button className="btn" onClick={retry}>
              Relancer la correction
            </button>
          </div>
        </div>
      );
    case 'error':
      return (
        <div className="view">
          <div className="panel">
            <p>{ERR[state.code] || "La correction n'a pas abouti."}</p>
            {isRetryable(state.code) && (
              <div>
                <button className="btn" onClick={retry}>
                  Réessayer
                </button>
              </div>
            )}
          </div>
          <SelfEval />
        </div>
      );
    default:
      return <CorrectionView r={state.r} />;
  }
}
