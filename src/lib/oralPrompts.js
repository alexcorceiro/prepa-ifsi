// Consignes envoyées à Claude pour l'oral : correction d'une réponse, questions de l'entretien blanc, bilan final.
import { words } from './format.js';
import { PROFIL, fmtTime } from './oralProfil.js';

export function reponsePrompt(q, txt, used) {
  return `Tu es membre du jury de l'entretien oral de sélection en IFSI (formation en soins infirmiers), voie formation professionnelle continue, en Île-de-France. L'entretien dure 20 minutes et s'appuie sur le dossier du candidat (CV, lettre). Le jury évalue l'expérience, le projet, les motivations et la capacité à s'exprimer et à argumenter.

Le candidat s'entraîne : il a répondu à voix haute puis a écrit ce qu'il a dit, ou il a répondu directement par écrit. Juge le fond et la construction de la réponse comme à l'oral : n'évalue pas l'orthographe.

PROFIL RÉEL DU CANDIDAT (issu de son dossier, ce sont les seuls faits connus) :
${PROFIL}

QUESTION DU JURY : « ${q.q} »
Durée conseillée pour répondre : ${fmtTime(q.sec)}.${used ? ` Temps qu'il a mis : ${fmtTime(used)}.` : ''}

SA RÉPONSE (${words(txt)} mots) :
"""
${txt.slice(0, 6000)}
"""

Note la réponse sur 10 comme un jury bienveillant mais exigeant : pertinence par rapport à la question, sincérité et éléments concrets, structure, cohérence avec son parcours, projection dans le métier. Tutoie le candidat.
N'invente jamais de faits sur sa vie : dans la version améliorée, garde uniquement ses propres idées et les faits du profil ; si un exemple concret manque, écris [ton exemple : …] à la place. La version améliorée doit être une réponse orale naturelle, en phrases courtes, qu'on peut dire dans la durée conseillée.

Réponds uniquement avec un objet JSON de cette forme :
{"note": 6.5, "points_forts": ["..."], "a_ameliorer": ["..."], "version_amelioree": "...", "conseil": "le conseil prioritaire pour la prochaine fois"}
Mets 2 à 3 points forts et 2 à 3 points à améliorer, en phrases courtes.`;
}

export const ENTRETIEN_QUESTIONS = 8,
  ENTRETIEN_MINUTES = 20;
export const ENTRETIEN_OUVERTURE =
  "Bonjour, et merci d'être venu. Pour commencer, pouvez-vous vous présenter et nous expliquer votre projet ?";
export const transcript = (t) => t.map((x) => `${x.who === 'jury' ? 'JURY' : 'CANDIDAT'} : ${x.t}`).join('\n');
export function entretienPrompt(turns, n) {
  return `Tu joues le jury de l'entretien oral de sélection en IFSI (formation en soins infirmiers), voie formation professionnelle continue, en Île-de-France. L'entretien dure 20 minutes et s'appuie sur le dossier du candidat. Le jury évalue son expérience, son projet professionnel, ses motivations et sa capacité à argumenter.

DOSSIER DU CANDIDAT :
${PROFIL}

ENTRETIEN JUSQU'ICI :
${transcript(turns)}

Pose la prochaine question du jury (question ${n + 1} sur ${ENTRETIEN_QUESTIONS} environ).
- Une seule question, courte, au vouvoiement, comme à l'oral.
- Si la dernière réponse est vague, trop courte ou sans exemple, relance dessus (« Pouvez-vous me donner un exemple concret ? », « Qu'entendez-vous par… ? »). Sinon, change de thème.
- Sur l'ensemble de l'entretien, couvre : le parcours et la reconversion, les motivations, la connaissance du métier (rôle infirmier, difficultés), les qualités et une mise en situation simple, la formation (organisation, financement, stages).
- Appuie-toi sur son dossier réel (mairies, électricité en intérim, maladie de sa mère, portugais…). N'invente aucun fait sur lui.
- Ne donne aucun avis ni conseil pendant l'entretien. Tu peux commencer par une très courte transition neutre (« D'accord. », « Je vous remercie. »).

Réponds uniquement avec un objet JSON : {"question": "..."}`;
}
export function bilanPrompt(turns, used) {
  return `Tu es le jury de l'entretien oral de sélection en IFSI, voie formation professionnelle continue (Île-de-France). L'entretien est noté sur 20 ; une note inférieure à 8/20 est éliminatoire.

DOSSIER DU CANDIDAT :
${PROFIL}

TRANSCRIPTION DE L'ENTRETIEN D'ENTRAÎNEMENT (${Math.round(used / 60)} minutes) :
${transcript(turns)}

Les réponses ont pu être dictées ou tapées : ne juge pas l'orthographe. Évalue comme un jury bienveillant mais exigeant : clarté et structure, sincérité et exemples concrets, cohérence du projet avec le parcours, connaissance du métier, capacité à argumenter, posture. Si l'entretien est très court, dis-le et note avec prudence. Tutoie le candidat dans le bilan. N'invente aucun fait.

Réponds uniquement avec un objet JSON :
{"note": 13.5, "appreciation": "deux ou trois phrases de bilan", "points_forts": ["..."], "a_ameliorer": ["..."], "reponse_a_retravailler": {"question": "la question où il a été le moins convaincant", "conseil": "comment mieux y répondre"}, "conseils": ["2 ou 3 conseils concrets pour le jour J"]}`;
}
