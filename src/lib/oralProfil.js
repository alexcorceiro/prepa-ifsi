// Profil réel du candidat (tiré de sa lettre et de son CV) et trames de ses réponses personnelles.
// Le profil est envoyé à Claude pour qu'il pose des questions et corrige sans inventer de faits.
// Les [crochets] dans les trames sont à compléter avec tes propres exemples.

export const PROFIL = `Alex, en reconversion vers le métier d'infirmier (voie FPC, IFPM GH Nord Essonne à Longjumeau ; il habite Chilly-Mazarin, tout près).
Parcours : bac STI2D (2018), BTS Systèmes numériques (2018-2021), bachelor puis mastère en développement à l'Efrei (2021-2024), en alternance.
Expérience : environ 8 ans dans l'informatique, surtout au service des agents de collectivités. Mairie de Chilly-Mazarin (alternance 2018-2022 : support, formation et accompagnement des agents aux outils numériques), PRO BTP (alternance 2022-2024 : recueil des besoins, travail en équipe), mairie de Villeneuve-le-Roi (CDD 2025-2026, technicien informatique : accueil et accompagnement d'agents, situations urgentes, procédures, confidentialité). Depuis, électricien en intérim sur des chantiers de travaux publics (sécurité, équipe).
Déclic : sa mère a eu un cancer du sein ; il l'a accompagnée lors de ses hospitalisations et a observé de près les équipes soignantes ; des infirmiers libéraux l'ont soignée à domicile et ont échangé avec lui sur leur parcours et leur métier.
Démarches : échanges avec des infirmiers en réanimation, aux urgences, en médecine générale et en libéral ; visites d'IFSI de sa région et forums d'orientation.
Atouts : écoute, explication claire à des non-spécialistes, calme face à l'urgence, rigueur et procédures, travail en équipe ; portugais courant (C1), anglais B2.`;
export const REPONSES_PERSO = [
  {
    id: 'pres',
    q: 'Pouvez-vous vous présenter ?',
    sec: 180,
    trame: [
      "Qui je suis, en une phrase : Alex, en reconversion vers le métier d'infirmier.",
      "Mon parcours : environ 8 ans dans l'informatique, surtout en mairie, au service des agents (Chilly-Mazarin, PRO BTP, Villeneuve-le-Roi). Aujourd'hui, électricien en intérim.",
      "Ce que j'y ai appris : écouter, expliquer simplement, garder mon calme dans l'urgence, respecter les procédures.",
      "Le déclic : la maladie de ma mère, que j'ai accompagnée lors de ses hospitalisations, et les infirmiers libéraux qui la soignaient à domicile.",
      "Mes démarches : échanges avec des infirmiers (réa, urgences, médecine, libéral), visites d'IFSI, forums.",
      "Aujourd'hui : un projet mûri, et je suis prêt à m'engager dans les 3 ans de formation.",
    ],
  },
  {
    id: 'motiv',
    q: 'Pourquoi voulez-vous devenir infirmier ?',
    sec: 120,
    trame: [
      "Ce que j'aimais le plus dans mon travail : aider les personnes et les voir repartir rassurées.",
      "Ce que j'ai vu à l'hôpital avec ma mère : soigner, ce n'est pas seulement traiter, c'est aussi écouter, rassurer, accompagner.",
      "Ce qui m'attire précisément : la relation avec le patient, les soins, le travail en équipe.",
      '[Ton exemple : un geste ou un moment précis que tu as vu chez un infirmier]',
    ],
  },
  {
    id: 'emo',
    q: "Votre projet vient de la maladie de votre mère. Comment être sûr que ce n'est pas un choix sous le coup de l'émotion ?",
    sec: 90,
    trame: [
      "Oui, c'est le déclic, et je ne le cache pas.",
      "Mais je ne me suis pas arrêté là : j'ai vérifié mon projet sur le terrain (infirmiers en réa, urgences, médecine, libéral ; IFSI ; forums).",
      "Ils m'ont parlé aussi des difficultés : horaires, fatigue, situations dures. Mon choix tient compte de tout ça.",
      "Le projet a mûri dans le temps : ce n'est pas une décision prise à chaud.",
    ],
  },
  {
    id: 'soin',
    q: 'Avez-vous été en contact avec le milieu du soin ?',
    sec: 120,
    trame: [
      "J'ai accompagné ma mère lors de ses hospitalisations : j'ai vu de près le travail des équipes.",
      'Les infirmiers libéraux qui la soignaient à domicile ont échangé avec moi sur leur métier et leur formation.',
      "J'ai discuté avec des infirmiers en réanimation, aux urgences et en médecine générale.",
      "J'ai visité des IFSI et participé à des forums d'orientation.",
      "Ce que j'en retiens : [une chose concrète que tu as comprise sur le métier]",
    ],
  },
  {
    id: 'info',
    q: "Pourquoi quitter l'informatique ?",
    sec: 90,
    trame: [
      "Je ne quitte pas l'informatique par rejet : j'y ai beaucoup appris.",
      "Ce que je préférais, c'était le contact avec les agents, pas la technique.",
      "J'ai voulu un métier où l'aide aux personnes est au centre.",
      "Le projet s'est construit progressivement, puis s'est confirmé avec la maladie de ma mère.",
    ],
  },
  {
    id: 'elec',
    q: "Je vois que vous êtes électricien en intérim. Pouvez-vous m'expliquer ce passage ?",
    sec: 90,
    trame: [
      "Après mon CDD à la mairie de Villeneuve-le-Roi, j'ai pris une mission d'intérim sur des chantiers de travaux publics.",
      "J'y ai appris le respect strict des consignes de sécurité, la vigilance et le travail en équipe.",
      "Ce sont des réflexes utiles en soins : sur un chantier comme à l'hôpital, une erreur a des conséquences.",
      "Cette période m'a aussi donné le recul pour confirmer mon projet.",
    ],
  },
  {
    id: 'transf',
    q: "Qu'est-ce que votre expérience en mairie vous apporte pour ce métier ?",
    sec: 90,
    trame: [
      "L'écoute : comprendre la demande d'une personne stressée.",
      "Expliquer simplement à quelqu'un qui n'est pas spécialiste.",
      'Gérer plusieurs urgences en même temps, garder mon calme.',
      'Respecter les procédures et la confidentialité (RGPD), assurer la traçabilité.',
      '[Ton exemple : un agent en difficulté que tu as aidé — situation, action, résultat]',
    ],
  },
  {
    id: 'as',
    q: "Pourquoi infirmier plutôt qu'aide-soignant ?",
    sec: 90,
    trame: [
      "Je respecte beaucoup le métier d'aide-soignant, qui est complémentaire.",
      "L'infirmier a un rôle propre et réalise aussi les soins sur prescription médicale.",
      "Il évalue l'état du patient, coordonne, fait de l'éducation à la santé.",
      "C'est ce rôle, à la fois relationnel et technique, qui correspond à mon projet.",
    ],
  },
  {
    id: 'diff',
    q: 'Selon vous, quelles sont les difficultés du métier ?',
    sec: 90,
    trame: [
      'Le rythme et les horaires : nuits, week-ends, fatigue.',
      'La charge émotionnelle : la souffrance, la fin de vie, les familles.',
      'La responsabilité : une erreur peut avoir des conséquences graves.',
      "Comment je compte y faire face : m'appuyer sur l'équipe, prendre du recul, me former en continu.",
    ],
  },
  {
    id: 'stress',
    q: 'Comment gérez-vous le stress ? Donnez-moi un exemple.',
    sec: 90,
    trame: [
      "Je priorise : ce qui est urgent d'abord, avec méthode.",
      'Je reste calme et je rassure la personne en face.',
      '[Ton exemple vécu en mairie : situation, ce que tu as fait, le résultat]',
      "Ce que j'en retiens pour le soin.",
    ],
  },
  {
    id: 'etudes',
    q: 'Reprendre des études pendant 3 ans, ça ne vous fait pas peur ?',
    sec: 60,
    trame: [
      "J'ai déjà suivi des études exigeantes jusqu'en 2024 (BTS, bachelor, mastère), en alternance : je sais m'organiser entre cours et terrain.",
      "Je mesure l'investissement : cours, stages, horaires décalés.",
      "Je suis motivé et prêt à m'y consacrer pleinement.",
    ],
  },
  {
    id: 'fin',
    q: 'Comment allez-vous financer et organiser votre formation ?',
    sec: 90,
    trame: [
      "Je me suis renseigné sur les pistes : [ta piste principale : Transitions Pro, prise en charge par la Région si demandeur d'emploi, employeur ou autofinancement].",
      'Mon plan B : [à préciser].',
      "Organisation : j'habite à Chilly-Mazarin, tout près de l'institut ; [ton organisation personnelle].",
      'Du temps de travail personnel chaque semaine.',
    ],
  },
  {
    id: 'inst',
    q: 'Pourquoi avoir choisi notre institut ?',
    sec: 60,
    trame: [
      "L'IFPM du GH Nord Essonne est tout près de chez moi, à Chilly-Mazarin.",
      "C'est en Essonne que je vis et que j'ai fait une grande partie de mon parcours.",
      'Il fait partie du groupement Université Paris-Saclay.',
      "[Ce que tu sais de l'institut : visite, forum, terrains de stage du GHNE]",
    ],
  },
];
// Dernières notes obtenues par question (mode « Réponds comme devant le jury »), gardées dans ce navigateur.
const ORAL_KEY = 'ifsi-oral-libre-v1';
export function loadOralNotes() {
  try {
    return JSON.parse(localStorage.getItem(ORAL_KEY) || '{}') || {};
  } catch {
    return {};
  }
}
export function saveOralNotes(d) {
  try {
    localStorage.setItem(ORAL_KEY, JSON.stringify(d));
  } catch {}
}
export const fmtTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
