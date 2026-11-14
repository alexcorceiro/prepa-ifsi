// Les deux QCM de rédaction :
// - « La méthode » : 6 questions, une par étape de la copie (comprendre, plan, argumenter, introduire, écrire, conclure).
// - « La meilleure copie » : pour chaque question du sujet, 4 réponses rédigées et notées.
// Les QCM des 15 sujets sont écrits dans src/data/qcm-redaction.json : aucun appel réseau ni à Claude n'est nécessaire.
// Sur claude.ai, les consignes ci-dessous permettent en plus de demander à Claude de nouvelles copies.

// Charge le fichier des QCM la première fois qu'on en a besoin (fichier séparé, mis en cache par le navigateur),
// pour ne pas alourdir l'ouverture de l'application.
let qcmPromise = null;
export function loadQcm() {
  if (!qcmPromise) qcmPromise = import('../data/qcm-redaction.json').then((m) => m.default);
  return qcmPromise;
}

export const ETAPES = ['Comprendre le sujet', 'Choisir le plan', 'Argumenter', 'Introduire', 'Bien écrire', 'Conclure'];
export function isValidMethode(qs) {
  return (
    Array.isArray(qs) &&
    qs.length >= 4 &&
    qs.every(
      (q) =>
        q &&
        typeof q.q == 'string' &&
        Array.isArray(q.opts) &&
        q.opts.length >= 3 &&
        q.opts.filter((x) => x && x.ok === true).length === 1 &&
        q.opts.every((x) => x && typeof x.t == 'string'),
    )
  );
}
export function methodePrompt(sj) {
  return `Tu prépares un candidat à la sous-épreuve de rédaction (30 minutes) de la sélection en IFSI, voie formation professionnelle continue : un court texte sur un sujet sanitaire et social, suivi de questions auxquelles il répond par écrit.

Crée un QCM de MÉTHODE en 6 questions sur ce sujet, pour lui apprendre à construire une bonne copie. Une question par étape, dans cet ordre exact :
1. "Comprendre le sujet" : quel est le problème principal soulevé par le texte ?
2. "Choisir le plan" : quel plan est le plus adapté à la dernière question du sujet ?
3. "Argumenter" : quel paragraphe est le mieux argumenté (idée + explication + exemple concret) ?
4. "Introduire" : quelle introduction est la meilleure (amener le sujet, poser le problème, annoncer le plan) ?
5. "Bien écrire" : quelle phrase, en lien avec le sujet, est correctement écrite (les autres contiennent des fautes d'accord, de ponctuation ou de registre) ?
6. "Conclure" : quelle conclusion est la meilleure (bilan + ouverture vers le métier d'infirmier) ?

SUJET : ${sj.title}
TEXTE : ${sj.doc}
QUESTIONS DU SUJET : ${sj.qs.map((q, i) => `${i + 1}. ${q}`).join(' ')}

Règles : 4 propositions par question, une seule correcte. Les mauvaises réponses doivent être plausibles et illustrer des erreurs fréquentes (hors-sujet, détail pris pour l'idée principale, affirmation sans argument, formule creuse, opinion non nuancée, registre oral, fautes). Pour chaque proposition, "why" explique en une phrase courte pourquoi elle est juste ou fausse. Reste factuel : n'invente ni chiffres ni lois. Français correct, phrases courtes, tutoiement dans les explications.

Réponds uniquement avec un objet JSON :
{"questions":[{"etape":"Comprendre le sujet","q":"...","opts":[{"t":"...","ok":true,"why":"..."},{"t":"...","ok":false,"why":"..."}]}]}`;
}

export function isValidCopies(qs) {
  return (
    Array.isArray(qs) &&
    qs.length >= 1 &&
    qs.every(
      (q) =>
        q &&
        typeof q.q == 'string' &&
        Array.isArray(q.reponses) &&
        q.reponses.length >= 3 &&
        q.reponses.filter((x) => x && x.ok === true).length === 1 &&
        q.reponses.every((x) => x && typeof x.t == 'string' && x.t.length > 20),
    )
  );
}
export function copiesPrompt(sj) {
  return `Tu prépares un candidat à la sous-épreuve de rédaction (30 minutes) de la sélection en IFSI, voie formation professionnelle continue (Île-de-France). Le sujet est un court texte sanitaire et social suivi de questions ; le candidat rédige ses réponses à la main.

Crée un QCM où, pour CHAQUE question du sujet, le candidat choisit la meilleure réponse rédigée parmi 4 réponses complètes, écrites comme sur une vraie copie.

SUJET : ${sj.title}
TEXTE : ${sj.doc}
QUESTIONS DU SUJET :
${sj.qs.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Pour chaque question :
- "points" : le barème de la question ; le total des questions fait 10 (la dernière, qui demande d'argumenter, vaut le plus).
- 4 réponses rédigées, en phrases complètes, de la longueur réaliste d'une copie (40 à 90 mots pour une question courte, 120 à 200 mots en plusieurs paragraphes pour la question d'argumentation, avec une courte introduction et une conclusion tournée vers le métier d'infirmier ; sépare les paragraphes par "\\n\\n").
- Une seule est la meilleure ("ok": true). Les trois autres illustrent chacune une erreur différente et réaliste : décrire le texte sans dégager le problème, recopier le texte, hors-sujet, ne traiter qu'une partie de la question, affirmations sans argument ni exemple, idée inexacte, registre familier avec fautes, liste de mots au lieu de phrases, parler de sa motivation au lieu de répondre.
- "note" : la note que mériterait cette réponse, au format "1,5/3".
- "why" : une phrase courte, au tutoiement, qui explique la note.
Reste factuel : n'invente ni chiffres précis, ni lois, ni études. Français impeccable dans la meilleure réponse.

Réponds uniquement avec un objet JSON :
{"questions":[{"q":"...","points":2,"reponses":[{"t":"...","ok":true,"note":"2/2","why":"..."}]}]}`;
}
