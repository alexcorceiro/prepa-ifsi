import { useEffect, useRef, useState } from 'react';

// Ajoute un morceau de texte dicté à la fin de la réponse, avec un espace si besoin.
export const appendText = (prev, t) => (prev && !/\s$/.test(prev) ? prev + ' ' : prev || '') + t;

// Bouton de dictée (reconnaissance vocale du navigateur). Si elle n'est pas disponible,
// un message conseille le micro du clavier du téléphone.
export default function Mic({ onText }) {
  const SR = typeof window != 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition),
    [on, setOn] = useState(false),
    [msg, setMsg] = useState(''),
    rec = useRef(null),
    cb = useRef(onText);
  cb.current = onText;
  useEffect(
    () => () => {
      try {
        rec.current && rec.current.abort();
      } catch {}
    },
    [],
  );
  const start = () => {
    if (!SR) {
      setMsg("La dictée n'est pas disponible dans ce navigateur. Sur téléphone, touche le micro de ton clavier pour dicter.");
      return;
    }
    try {
      const r = new SR();
      r.lang = 'fr-FR';
      r.continuous = true;
      r.interimResults = false;
      r.onresult = (e) => {
        let t = '';
        for (let i = e.resultIndex; i < e.results.length; i++) e.results[i].isFinal && (t += e.results[i][0].transcript);
        t.trim() && cb.current(t.trim());
      };
      r.onerror = (e) => {
        setOn(false);
        setMsg(
          e && (e.error === 'not-allowed' || e.error === 'service-not-allowed')
            ? 'Le micro est bloqué ici. Sur téléphone, utilise le micro de ton clavier pour dicter.'
            : e && e.error === 'no-speech'
              ? "Je n'ai rien entendu : réessaie en parlant plus près du micro."
              : "La dictée s'est arrêtée. Tu peux réessayer, ou utiliser le micro de ton clavier.",
        );
      };
      r.onend = () => setOn(false);
      rec.current = r;
      r.start();
      setOn(true);
      setMsg('');
    } catch {
      setOn(false);
      setMsg("La dictée n'a pas pu démarrer. Sur téléphone, utilise le micro de ton clavier.");
    }
  };
  const stop = () => {
    try {
      rec.current && rec.current.stop();
    } catch {}
    setOn(false);
  };
  return (
    <div className="mic">
      <button type="button" className={`btn ghost${on ? ' recording' : ''}`} onClick={on ? stop : start} aria-pressed={on}>
        {on ? '■ Arrêter la dictée' : '🎙 Dicter ma réponse'}
      </button>
      {on && <span className="muted">Parle normalement, le texte s'ajoute au fur et à mesure.</span>}
      {msg && <span className="note">{msg}</span>}
    </div>
  );
}
