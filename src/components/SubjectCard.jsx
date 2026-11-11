// Sujet de rédaction : thème, texte support et questions.
export default function SubjectCard({ subject }) {
  return (
    <article className="sujet">
      <p className="eyebrow">{subject.theme}</p>
      <h3>{subject.title}</h3>
      {subject.doc && (
        <>
          <blockquote>{subject.doc}</blockquote>
          <p className="src">Texte rédigé pour l'entraînement.</p>
        </>
      )}
      <ol className="consignes">
        {subject.qs.map((x, k) => (
          <li key={k}>{x}</li>
        ))}
      </ol>
    </article>
  );
}
