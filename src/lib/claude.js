// Correction des rédactions par Claude.
// window.claude n'existe que lorsque la page est ouverte comme artifact sur claude.ai.
// En local (npm run dev), getSampler() renvoie null et l'app propose la grille d'autoévaluation.

import { words } from './format.js';

let samplerPromise = null;

export function getSampler() {
  if (!samplerPromise) {
    samplerPromise =
      typeof window !== 'undefined' && window.claude && window.claude.use
        ? window.claude.use('sample').catch(() => null)
        : Promise.resolve(null);
  }
  return samplerPromise;
}

export const ERR = {
  not_granted: "Tu n'as pas autorisé cette page à utiliser Claude.",
  sampling_disabled: "La correction par Claude n'est pas disponible pour ton compte.",
  rate_limited: 'Trop de demandes pour le moment. Réessaie dans quelques minutes.',
  session_expired: 'Ta session a expiré. Reconnecte-toi à Claude puis réessaie.',
  invalid_json: 'La correction est arrivée dans un format illisible. Réessaie.',
  refused: "Claude n'a pas pu corriger cette copie.",
  prompt_too_large: 'La copie est trop longue pour être corrigée.',
};

export const isRetryable = (code) =>
  ['upstream_error', 'invalid_json', 'rate_limited', 'empty_completion', 'session_expired'].includes(code) || !ERR[code];

export const clampNote = (r) => Math.max(0, Math.min(20, Number(r && r.note) || 0));

export function buildPrompt(s, text, used) {
  return `Tu es correcteur pour la sélection d'entrée en IFSI (institut de formation en soins infirmiers), voie formation professionnelle continue, en Île-de-France. La sous-épreuve de rédaction dure 30 minutes. Elle évalue les qualités rédactionnelles, l'aptitude au questionnement, à l'analyse et à l'argumentation, et la capacité du candidat à se projeter dans son futur environnement professionnel.

Corrige la copie ci-dessous de façon bienveillante mais exigeante, comme le ferait un jury. Note sur 20 avec cette grille :
- Compréhension du sujet et réponse à chaque question : /4
- Analyse et argumentation : /6
- Organisation et structure : /4
- Expression écrite (orthographe, syntaxe, vocabulaire) : /4
- Projection professionnelle : /2
Si la copie est très courte, incomplète ou hors sujet, note en conséquence. Tutoie le candidat.

SUJET : ${s.title}
${s.doc ? 'TEXTE : ' + s.doc + '\n' : ''}QUESTIONS :
${s.qs.map((x, k) => `${k + 1}. ${x}`).join('\n')}

COPIE DU CANDIDAT (${words(text)} mots${used ? `, rédigée en ${used} min` : ''}) :
"""
${text.slice(0, 12000)}
"""

Réponds uniquement avec un objet JSON de cette forme :
{"note": 12.5, "criteres": [{"nom": "Compréhension du sujet", "note": 3, "max": 4, "commentaire": "une phrase"}], "points_forts": ["..."], "a_ameliorer": ["..."], "corrections": [{"erreur": "passage fautif tel qu'écrit", "correction": "forme correcte"}], "conseil": "le conseil prioritaire pour la prochaine copie"}
Mets les 5 critères dans l'ordre de la grille, 2 à 4 points forts, 2 à 4 axes d'amélioration, 8 corrections au maximum.`;
}
