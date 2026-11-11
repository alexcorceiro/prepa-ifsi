// Méthode de résolution d'un calcul, étape par étape.
export default function Steps({ question }) {
  return (
    <ol className="steps">
      {question.steps.map((s, k) => (
        <li key={k}>{s}</li>
      ))}
    </ol>
  );
}
