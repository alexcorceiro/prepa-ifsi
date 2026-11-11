// Données et consignes des deux QCM de rédaction.
// - « La méthode » : 6 questions, une par étape de la copie (comprendre, plan, argumenter, introduire, écrire, conclure).
// - « La meilleure copie » : pour chaque question du sujet, 4 réponses rédigées et notées.
// Le sujet « Les aidants » est intégré ; pour les autres sujets, Claude crée le QCM à partir des consignes ci-dessous.

export const ETAPES = ['Comprendre le sujet', 'Choisir le plan', 'Argumenter', 'Introduire', 'Bien écrire', 'Conclure'];
export const METHODE_AIDANTS = [
  {
    etape: 'Comprendre le sujet',
    q: 'Quel est le problème principal soulevé par ce texte ?',
    opts: [
      {
        t: "L'épuisement des aidants familiaux, qui menace leur santé et le maintien à domicile de la personne aidée.",
        ok: true,
        why: "C'est l'idée centrale : le texte part du rôle des aidants pour arriver au risque d'épuisement et à ses conséquences.",
      },
      {
        t: 'Le manque de maisons de retraite en France.',
        ok: false,
        why: "Le texte n'en parle pas : c'est un hors-sujet, l'erreur la plus pénalisée.",
      },
      {
        t: "Les aidants familiaux s'occupent de la toilette et des repas.",
        ok: false,
        why: "C'est un détail du texte, pas le problème qu'il soulève.",
      },
      {
        t: 'Le vieillissement de la population.',
        ok: false,
        why: "C'est le contexte général, trop large : le texte cible précisément l'épuisement des aidants.",
      },
    ],
  },
  {
    etape: 'Choisir le plan',
    q: "Pour la question « Quel rôle l'infirmier peut-il jouer auprès des aidants ? », quel plan est le plus adapté ?",
    opts: [
      {
        t: "I. Repérer l'épuisement de l'aidant — II. L'informer, l'écouter et l'orienter vers des aides (répit, associations).",
        ok: true,
        why: "Deux parties claires, qui répondent directement à la question et vont du constat à l'action.",
      },
      {
        t: 'I. Les avantages — II. Les inconvénients.',
        ok: false,
        why: 'Plan « pour/contre » plaqué : la question ne demande pas de peser le pour et le contre.',
      },
      {
        t: 'Une liste de tout ce que fait un infirmier dans une journée.',
        ok: false,
        why: 'Pas de plan et hors-sujet : il faut parler de son rôle auprès des aidants.',
      },
      {
        t: 'I. Ma vie personnelle — II. Mon projet professionnel.',
        ok: false,
        why: "C'est un plan de lettre de motivation, pas de rédaction sur un sujet sanitaire et social.",
      },
    ],
  },
  {
    etape: 'Argumenter',
    q: 'Quel paragraphe est le mieux argumenté ?',
    opts: [
      {
        t: "« L'infirmier peut repérer les signes d'épuisement de l'aidant, car il est souvent présent au domicile. Par exemple, lors d'un passage, il peut remarquer qu'une épouse dort mal et néglige ses propres soins, et lui proposer de l'aide. »",
        ok: true,
        why: "Il y a une idée, une explication (« car… ») et un exemple concret : c'est la structure attendue.",
      },
      {
        t: "« L'infirmier a un rôle très important et essentiel auprès des aidants. »",
        ok: false,
        why: "C'est une affirmation sans explication ni exemple : elle ne prouve rien.",
      },
      {
        t: '« Les aidants sont fatigués, les infirmiers aussi, tout le monde est fatigué. »',
        ok: false,
        why: 'Généralisation familière, sans raisonnement.',
      },
      {
        t: "« L'infirmier doit tout faire à la place de l'aidant pour qu'il se repose. »",
        ok: false,
        why: "Idée irréaliste et inexacte : l'infirmier accompagne et oriente, il ne remplace pas l'aidant.",
      },
    ],
  },
  {
    etape: 'Introduire',
    q: 'Quelle introduction est la meilleure ?',
    opts: [
      {
        t: "« De nombreuses personnes accompagnent chaque jour un proche malade ou âgé. Ce rôle d'aidant, souvent assuré sans formation, peut mener à l'épuisement. Nous verrons d'abord ce problème et ses conséquences, puis le rôle que l'infirmier peut jouer. »",
        ok: true,
        why: "Elle amène le sujet, pose le problème et annonce le plan : les trois étapes d'une bonne introduction.",
      },
      { t: '« Dans ce texte, on va parler des aidants. »', ok: false, why: 'Trop pauvre : pas de problème posé, pas de plan annoncé.' },
      {
        t: "« Depuis la nuit des temps, l'homme aide son prochain. »",
        ok: false,
        why: 'Formule creuse et trop générale : les correcteurs la sanctionnent.',
      },
      {
        t: "« Je pense que les aidants ont raison d'être fatigués et que l'État ne fait rien. »",
        ok: false,
        why: 'Opinion tranchée dès la première phrase, sans nuance ni annonce du plan.',
      },
    ],
  },
  {
    etape: 'Bien écrire',
    q: 'Quelle phrase est correctement écrite ?',
    opts: [
      {
        t: '« Les aidants, qui accompagnent leur proche au quotidien, négligent souvent leur propre santé. »',
        ok: true,
        why: 'Accords justes, ponctuation correcte, registre soutenu.',
      },
      {
        t: '« Les aidants qui accompagne leurs proche au quotidien néglige souvent leurs propre santé. »',
        ok: false,
        why: "Erreurs d'accord : « accompagnent », « proches » ou « proche », « négligent », « leur propre santé ».",
      },
      {
        t: '« Les aidants ils négligent souvent leur santé à eux. »',
        ok: false,
        why: "Registre oral (« ils » répété, « à eux ») : à éviter à l'écrit.",
      },
      {
        t: '« Les aidants, négligent souvent, leur propre santé. »',
        ok: false,
        why: 'Virgules mal placées : on ne sépare pas le sujet du verbe ni le verbe de son complément.',
      },
    ],
  },
  {
    etape: 'Conclure',
    q: 'Quelle conclusion est la meilleure ?',
    opts: [
      {
        t: "« L'épuisement des aidants est un enjeu de santé pour eux comme pour leurs proches. Par sa présence et son écoute, l'infirmier peut le repérer et les orienter. Future professionnel, je serai attentif à ne pas oublier ceux qui accompagnent les patients. »",
        ok: true,
        why: "Elle résume la réponse, puis ouvre sur le futur métier : c'est ce que le jury apprécie.",
      },
      { t: "« Voilà, j'ai fini. »", ok: false, why: "Ce n'est pas une conclusion." },
      {
        t: '« En conclusion, il y a beaucoup de choses à dire sur ce sujet très intéressant. »',
        ok: false,
        why: "Phrase vide, qui ne résume rien et n'ouvre sur rien.",
      },
      {
        t: "« Pour conclure, je vais maintenant parler d'un autre problème : le prix des médicaments. »",
        ok: false,
        why: "Une conclusion n'apporte pas une nouvelle partie hors-sujet.",
      },
    ],
  },
];
export const METHODE_INTEGREE = { aidants: METHODE_AIDANTS };
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

export const COPIES_AIDANTS = [
  {
    q: 'Quel est le problème principal soulevé par ce texte ?',
    points: 2,
    reponses: [
      {
        t: "Ce texte soulève le problème de l'épuisement des aidants familiaux. Ces personnes accompagnent au quotidien un proche âgé, malade ou en situation de handicap, souvent sans formation et en plus de leur travail. À force de s'occuper de l'autre, elles en viennent à négliger leur propre santé. Cet épuisement devient alors un risque, à la fois pour l'aidant et pour la personne aidée, dont le maintien à domicile peut être remis en cause.",
        ok: true,
        note: '2/2',
        why: 'Le problème est clairement identifié et reformulé avec tes propres mots, puis expliqué en quelques phrases.',
      },
      {
        t: 'Le texte parle des aidants familiaux. Ils font la toilette et les repas, ils accompagnent leur proche aux rendez-vous médicaux et ils sont parfois présents la nuit.',
        ok: false,
        note: '0,5/2',
        why: 'Tu décris ce que font les aidants, mais tu ne dis jamais quel est le problème : leur épuisement.',
      },
      {
        t: 'Le problème principal est que « des millions de personnes accompagnent au quotidien un proche âgé, malade ou en situation de handicap » et que « beaucoup disent manquer de temps pour eux-mêmes ».',
        ok: false,
        note: '1/2',
        why: "Recopier le texte entre guillemets ne montre pas que tu l'as compris : le correcteur attend une reformulation.",
      },
      {
        t: "Le problème principal est le manque de places en maison de retraite. C'est pour cela que les familles doivent garder leurs parents chez eux. L'État devrait construire beaucoup plus d'établissements.",
        ok: false,
        note: '0/2',
        why: "Hors-sujet : le texte ne parle pas des maisons de retraite. Et ton opinion sur l'État n'est pas demandée.",
      },
    ],
  },
  {
    q: "Quelles peuvent être les conséquences de l'épuisement d'un aidant, pour lui et pour la personne aidée ?",
    points: 3,
    reponses: [
      {
        t: "L'épuisement a d'abord des conséquences pour l'aidant lui-même. Fatigué, il manque de sommeil et de temps pour lui. Il peut repousser ses propres soins, s'isoler et finir par tomber malade à son tour, physiquement ou moralement.\n\nCet épuisement touche aussi la personne aidée. Un aidant à bout de forces est moins disponible et moins patient, ce qui peut nuire à la qualité de l'accompagnement. Dans les cas les plus graves, s'il ne peut plus assumer son rôle, le maintien à domicile devient impossible et une entrée en établissement doit être envisagée, parfois dans l'urgence.",
        ok: true,
        note: '3/3',
        why: "La réponse traite les deux parties de la question (l'aidant, puis la personne aidée), dans deux paragraphes clairs, avec des conséquences précises.",
      },
      {
        t: '- fatigue\n- stress\n- il tombe malade\n- la personne aidée va en maison de retraite',
        ok: false,
        note: '1/3',
        why: "Les idées sont justes, mais une liste de mots n'est pas une rédaction : il faut des phrases et des liens entre les idées.",
      },
      {
        t: "L'aidant est très fatigué. Il dort mal, il est stressé et il n'a plus de temps pour ses loisirs ni pour voir ses amis. Il peut même faire une dépression et devoir arrêter de travailler.",
        ok: false,
        note: '1,5/3',
        why: 'Bien rédigé, mais il manque la moitié de la réponse : la question demande aussi les conséquences pour la personne aidée.',
      },
      {
        t: "Ben l'aidant il est crevé, du coup il peut plus s'occuper de sa mère correctement et elle va être mal, et lui aussi il va tomber malade c'est sur.",
        ok: false,
        note: '1/3',
        why: "Les idées sont bonnes, mais le langage est familier (« ben », « crevé », « du coup ») et il y a des fautes : c'est pénalisé à l'écrit.",
      },
    ],
  },
  {
    q: "Selon vous, quel rôle l'infirmier peut-il jouer auprès des aidants ? Argumentez.",
    points: 5,
    reponses: [
      {
        t: "L'infirmier occupe une place privilégiée auprès des aidants, car il intervient souvent au domicile ou rencontre les familles à l'hôpital.\n\nSon premier rôle est de repérer l'épuisement. Lors de ses passages, il peut remarquer des signes de fatigue, une perte de patience, ou un aidant qui néglige sa propre santé. Il peut alors prendre le temps de l'écouter sans le juger, car beaucoup d'aidants n'osent pas dire qu'ils sont à bout.\n\nSon second rôle est d'informer et d'orienter. L'infirmier peut conseiller l'aidant sur les gestes du quotidien pour le soulager, l'informer sur les aides existantes, comme les solutions de répit ou les associations d'aidants, et faire le lien avec le médecin ou l'assistante sociale. Lorsque j'ai accompagné ma mère pendant sa maladie, j'ai constaté combien les explications des soignants rassuraient aussi la famille.\n\nFutur infirmier, je souhaite être attentif au patient, mais aussi à ceux qui l'entourent.",
        ok: true,
        note: '5/5',
        why: 'Une introduction, deux arguments développés (repérer, puis informer et orienter) avec des exemples, une expérience personnelle et une conclusion tournée vers le métier.',
      },
      {
        t: "L'infirmier a un rôle très important auprès des aidants. Il doit les aider, les écouter et les soutenir. Il est essentiel qu'il soit présent pour eux, car ils en ont besoin. C'est pour cela que le rôle de l'infirmier est primordial.",
        ok: false,
        note: '1,5/5',
        why: "Des affirmations sans explication ni exemple, et des répétitions (« important », « essentiel », « primordial ») : ça n'argumente pas.",
      },
      {
        t: "L'infirmier doit remplacer l'aidant : il doit venir tous les jours faire la toilette et les repas, et rester la nuit pour que l'aidant puisse se reposer complètement.",
        ok: false,
        note: '1/5',
        why: "Idée inexacte et irréaliste : l'infirmier accompagne et oriente l'aidant, il ne le remplace pas.",
      },
      {
        t: "Moi, je veux devenir infirmier parce que j'aime aider les gens et que j'ai vu ma mère malade. Je pense que je serai un bon infirmier car je suis à l'écoute et patient. Les aidants, c'est important aussi.",
        ok: false,
        note: '0,5/5',
        why: "Tu parles de ta motivation au lieu de répondre à la question : c'est un hors-sujet fréquent. Garde-la pour l'oral.",
      },
    ],
  },
];
export const COPIES_INTEGREES = { aidants: COPIES_AIDANTS };
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
