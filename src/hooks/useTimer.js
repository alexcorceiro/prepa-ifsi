import { useEffect, useRef, useState } from 'react';

// Compte à rebours. Il démarre quand `running` passe à true et s'arrête quand il repasse à false.
// onEnd est appelé une seule fois, quand le temps est écoulé.
export function useTimer(minutes, running, onEnd) {
  const total = minutes * 60;
  const [left, setLeft] = useState(total);
  const endRef = useRef(null);
  const startRef = useRef(null);
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;

  useEffect(() => {
    if (!running) return undefined;
    if (endRef.current == null) {
      startRef.current = Date.now();
      endRef.current = Date.now() + total * 1000;
    }
    let done = false;
    const tick = () => {
      const l = Math.max(0, Math.ceil((endRef.current - Date.now()) / 1000));
      setLeft(l);
      if (l <= 0 && !done) {
        done = true;
        clearInterval(id);
        onEndRef.current && onEndRef.current();
      }
    };
    const id = setInterval(tick, 1000);
    tick();
    return () => clearInterval(id);
  }, [running, total]);

  const used = () => (startRef.current ? Math.max(1, Math.round((Date.now() - startRef.current) / 60000)) : null);

  return { left, display: `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`, low: left <= 300, used };
}
