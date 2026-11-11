import { CATS } from '../lib/generators.js';
import { THEMES } from '../lib/oralQuestions.js';
import { store } from '../lib/storage.js';
import { f } from '../lib/format.js';
import { ORAL_START, ORAL_END, daysUntil } from '../lib/dates.js';

// Réussite par thème. data : { thème: { ok, n } }
function ThemeBars({ labels, data, empty }) {
  data = data || {};
  const hasData = Object.keys(labels).some((k) => data[k] && data[k].n);
  if (!hasData) return <p className="empty">{empty}</p>;
  return (
    <div className="bars">
      {Object.entries(labels).map(([k, label]) => {
        const c = data[k] || { ok: 0, n: 0 };
        const p = c.n ? c.ok / c.n : 0;
        const color = !c.n ? 'var(--line)' : p >= 0.75 ? 'var(--ok)' : p >= 0.5 ? 'var(--warn)' : 'var(--bad)';
        return (
          <div className="bar" key={k}>
            <span>{label}</span>
            <div className="track">
              <div className="fill" style={{ width: `${c.n ? Math.max(4, p * 100) : 0}%`, background: color }} />
            </div>
            <span className="v">{c.n ? `${c.ok}/${c.n}` : '—'}</span>
          </div>
        );
      })}
    </div>
  );
}

function HistItem({ x }) {
  const date = new Date(x.d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  let content;
  if (x.t === 'oral')
    content = (
      <>
        QCM de l'oral :{' '}
        <b className="num">
          {x.s}/{x.m}
        </b>
      </>
    );
  else if (x.t === 'serie')
    content = (
      <>
        Série de calculs :{' '}
        <b className="num">
          {x.s}/{x.m}
        </b>
      </>
    );
  else if (x.t === 'redac')
    content = (
      <>
        Rédaction « {x.label} » : <b className="num">{f(x.s)}/20</b>
      </>
    );
  else
    content = (
      <>
        Examen blanc : calculs{' '}
        <b className="num">
          {x.s}/{x.m}
        </b>
        {x.s2 != null && (
          <>
            , rédaction <b className="num">{f(x.s2)}/20</b>
          </>
        )}
        {x.e != null && (
          <>
            , écrit ≈ <b className="num">{f(x.e)}/20</b>
          </>
        )}
      </>
    );
  return (
    <li>
      <span className="d">{date}</span>
      <span>{content}</span>
    </li>
  );
}

export default function Home({ onGo }) {
  const oralIn = daysUntil(ORAL_START);
  return (
    <section className="view">
      {/* Bandeau affiché jusqu'à la fin de la période des entretiens */}
      {daysUntil(ORAL_END) >= 0 && (
        <div className="oral-alert">
          <div>
            <b>
              {oralIn > 0
                ? `Priorité à l'oral : il peut tomber dans ${oralIn} jour${oralIn > 1 ? 's' : ''}`
                : "Priorité à l'oral : les entretiens ont commencé"}
            </b>
            <p>Ta convocation peut arriver dès le 16 novembre, avant l'écrit. Entraîne-toi chaque jour à répondre à voix haute.</p>
          </div>
          <button className="btn" onClick={() => onGo('oral')}>
            Préparer l'oral
          </button>
        </div>
      )}
      <div className="hero">
        <p className="eyebrow">Sélection FPC · groupement Université Paris-Saclay</p>
        <h1>L'écrit du mercredi 9 décembre</h1>
        <p className="lede">
          Une heure en tout : 30 minutes de rédaction sanitaire et sociale, puis 30 minutes de calculs simples. L'écrit est noté sur 20,
          comme l'oral de 20 minutes, qui a lieu entre le 16 novembre et le 8 janvier. Sous 8/20 à l'une des deux épreuves, c'est
          éliminatoire.
        </p>
      </div>

      <div className="day" aria-label="Déroulé du 9 décembre">
        <div>
          <span className="h">12h00–12h30</span>
          <span className="w">Convocation possible</span>
        </div>
        <div className="on">
          <span className="h">13h30–14h00</span>
          <span className="w">Rédaction</span>
        </div>
        <div>
          <span className="h">14h00–14h15</span>
          <span className="w">Copie ramassée</span>
        </div>
        <div className="on">
          <span className="h">14h15–14h45</span>
          <span className="w">Calculs, calculatrice simple</span>
        </div>
      </div>

      <div className="starts">
        <button className="start" onClick={() => onGo('calc', 'free')}>
          <em>À ton rythme</em>
          <b>Calculs</b>
          <span>Une question à la fois, correction détaillée immédiate.</span>
        </button>
        <button className="start" onClick={() => onGo('redac')}>
          <em>30 min</em>
          <b>Rédaction</b>
          <span>Un sujet, une copie, une correction notée sur 20.</span>
        </button>
        <button className="start" onClick={() => onGo('exam')}>
          <em>1 h</em>
          <b>Examen blanc</b>
          <span>Les deux sous-épreuves enchaînées, comme le jour J.</span>
        </button>
        <button className="start" onClick={() => onGo('oral')}>
          <em>Priorité · dès le 16 nov.</em>
          <b>Oral</b>
          <span>Entretien blanc avec Claude en jury, réponses dictées corrigées, trames perso et QCM.</span>
        </button>
      </div>

      <div className="grid2">
        <section className="panel">
          <h2>Tes calculs par thème</h2>
          <ThemeBars
            labels={CATS}
            data={store.cat}
            empty="Aucun calcul pour l'instant. Fais quelques questions et tu verras ici tes thèmes forts et tes thèmes faibles."
          />
        </section>
        <section className="panel">
          <h2>Ton oral par thème</h2>
          <ThemeBars
            labels={THEMES}
            data={store.oral}
            empty="Aucun QCM pour l'instant. Lance-en un depuis l'onglet Oral pour voir les thèmes à retravailler."
          />
        </section>
      </div>

      <div className="grid2">
        <section className="panel" style={{ gridColumn: '1 / -1' }}>
          <h2>Dernières séances</h2>
          <ol className="hist">
            {store.hist.length ? (
              store.hist.slice(0, 8).map((x, i) => <HistItem key={i} x={x} />)
            ) : (
              <li className="empty" style={{ display: 'block' }}>
                Tes séries chronométrées, rédactions corrigées et examens blancs s'afficheront ici.
              </li>
            )}
          </ol>
        </section>
      </div>
    </section>
  );
}
