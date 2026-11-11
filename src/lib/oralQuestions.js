// QCM de préparation à l'entretien oral.
// Chaque question : { id, theme, jury, q, opts: [{ t, ok, why }], tip? }
//  - jury: true  -> q est une question posée par le jury ; on cherche la réponse la plus convaincante.
//  - jury: false -> question de connaissance ; une seule réponse est exacte.
//  - why : explication affichée pour chaque option après la réponse.
//  - tip : conseil affiché après la réponse (facultatif).

export const THEMES = {
  deroule: "L'épreuve",
  parcours: 'Ton parcours',
  motivation: 'Tes motivations',
  metier: 'Connaissance du métier',
  qualites: 'Qualités et mises en situation',
  formation: 'Suivre la formation',
};

export const QUESTIONS = [
  // ---------- L'épreuve ----------
  {
    id: 'd1',
    theme: 'deroule',
    jury: false,
    q: "Combien de temps dure l'entretien oral ?",
    opts: [
      { t: '10 minutes', ok: false, why: "C'est trop court : l'entretien dure deux fois plus." },
      { t: '20 minutes', ok: true, why: "C'est la durée fixée par le document officiel de l'ARS." },
      { t: '30 minutes', ok: false, why: "30 minutes, c'est la durée de chaque sous-épreuve écrite, pas de l'oral." },
      { t: '45 minutes', ok: false, why: "Beaucoup trop long : l'entretien dure 20 minutes." },
    ],
    tip: 'Prévois une présentation de 2 à 3 minutes : le reste du temps sert aux questions du jury.',
  },
  {
    id: 'd2',
    theme: 'deroule',
    jury: false,
    q: "Comment l'oral est-il noté ?",
    opts: [
      {
        t: 'Sur 20, et une note inférieure à 8/20 est éliminatoire',
        ok: true,
        why: "C'est la règle : l'oral et l'écrit sont chacun notés sur 20, et sous 8/20 à l'un des deux, la candidature est éliminée.",
      },
      { t: 'Sur 20, et une note inférieure à 10/20 est éliminatoire', ok: false, why: 'Le seuil éliminatoire est 8/20, pas 10/20.' },
      { t: 'Sur 10, et une note inférieure à 5/10 est éliminatoire', ok: false, why: "L'oral est noté sur 20." },
      {
        t: "Il n'est pas noté : le jury donne seulement un avis",
        ok: false,
        why: "L'oral est bien noté sur 20 et compte pour la moitié du total.",
      },
    ],
  },
  {
    id: 'd3',
    theme: 'deroule',
    jury: false,
    q: "Sur quoi s'appuie l'entretien ?",
    opts: [
      {
        t: "Sur le dossier déposé à l'inscription : CV, lettre de candidature, diplômes, attestations",
        ok: true,
        why: "Le jury s'appuie sur ton dossier pour apprécier ton expérience, ton projet et tes motivations.",
      },
      {
        t: "Sur un texte d'actualité tiré au sort",
        ok: false,
        why: "Ce n'est pas le format de l'oral FPC : il porte sur ton expérience et ton projet.",
      },
      { t: 'Sur ta copie de rédaction', ok: false, why: "La rédaction est évaluée séparément, à l'écrit." },
      {
        t: 'Sur un cas clinique à résoudre',
        ok: false,
        why: "On n'attend pas de connaissances techniques de soins : c'est l'objet de la formation.",
      },
    ],
    tip: "Relis ton dossier avant l'entretien : chaque ligne de ton CV et de ta lettre peut donner lieu à une question.",
  },
  {
    id: 'd4',
    theme: 'deroule',
    jury: false,
    q: 'Quelle pièce du dossier sert à exposer ton projet professionnel ?',
    opts: [
      {
        t: 'La lettre de candidature',
        ok: true,
        why: 'Le document officiel précise que la lettre de candidature expose le projet professionnel.',
      },
      { t: 'Le curriculum vitae', ok: false, why: 'Le CV présente ton parcours, mais ne développe pas ton projet.' },
      { t: "L'attestation employeur", ok: false, why: "Elle prouve ton expérience, elle n'explique pas ton projet." },
      { t: "La copie de la pièce d'identité", ok: false, why: "Elle sert seulement à t'identifier." },
    ],
  },
  {
    id: 'd5',
    theme: 'deroule',
    jury: false,
    q: "L'oral peut-il avoir lieu avant l'épreuve écrite du 9 décembre ?",
    opts: [
      {
        t: "Oui : les entretiens ont lieu du 16 novembre au 8 janvier, et il n'y a pas d'épreuve d'admissibilité",
        ok: true,
        why: "C'est écrit dans le calendrier officiel. Il faut donc être prêt pour l'oral dès mi-novembre.",
      },
      {
        t: "Non : il faut d'abord réussir l'écrit",
        ok: false,
        why: "Il n'y a pas d'épreuve d'admissibilité : l'oral peut précéder l'écrit.",
      },
      { t: 'Seulement pour les aides-soignants', ok: false, why: 'Le calendrier est le même pour tous les candidats FPC.' },
      { t: 'Seulement si le dossier est incomplet', ok: false, why: "La date dépend de ta convocation, pas de l'état de ton dossier." },
    ],
  },
  {
    id: 'd6',
    theme: 'deroule',
    jury: false,
    q: 'Que faut-il obtenir au total pour être admis ?',
    opts: [
      {
        t: "Au moins 20/40, sans note inférieure à 8/20 à l'oral ou à l'écrit",
        ok: true,
        why: "C'est la règle du document officiel. Ensuite, le classement décide de l'IFSI où tu es affecté.",
      },
      { t: 'Au moins 24/40', ok: false, why: 'Le minimum est 20/40.' },
      { t: "Au moins 10/20 à l'oral seulement", ok: false, why: "L'admission dépend du total oral + écrit." },
      { t: 'Au moins 30/40', ok: false, why: 'Le minimum est 20/40, même si une meilleure note améliore ton classement.' },
    ],
  },
  {
    id: 'd7',
    theme: 'deroule',
    jury: false,
    q: "Le jury évalue ta façon de t'exprimer. Qu'est-ce que cela veut dire concrètement ?",
    opts: [
      {
        t: 'Ordonner tes idées et argumenter de façon cohérente',
        ok: true,
        why: "C'est l'objectif cité par le document officiel : s'exprimer et ordonner ses idées pour argumenter.",
      },
      {
        t: 'Employer le plus de vocabulaire médical possible',
        ok: false,
        why: "Le jargon n'impressionne pas le jury s'il n'est pas maîtrisé. La clarté compte plus.",
      },
      {
        t: 'Parler le plus longtemps possible',
        ok: false,
        why: 'Des réponses trop longues donnent une impression de manque de structure.',
      },
      {
        t: 'Réciter une présentation apprise par cœur',
        ok: false,
        why: 'Le jury repère vite un texte récité, et cela empêche un vrai échange.',
      },
    ],
  },
  // ---------- Ton parcours ----------
  {
    id: 'p1',
    theme: 'parcours',
    jury: true,
    q: 'Pouvez-vous vous présenter ?',
    opts: [
      {
        t: "Une présentation de 2 à 3 minutes : qui je suis, mon parcours en informatique et ce que j'y ai développé, ce qui a fait naître mon projet, où j'en suis aujourd'hui.",
        ok: true,
        why: 'Structurée, courte et orientée vers ton projet : le jury a un fil à suivre et des pistes pour ses questions.',
      },
      {
        t: 'Je raconte toute ma carrière année par année depuis le lycée.',
        ok: false,
        why: 'Trop long et sans fil conducteur : le jury veut comprendre ton projet, pas ta chronologie complète.',
      },
      {
        t: "Je donne mon nom, je dis que je veux être infirmier et j'attends les questions.",
        ok: false,
        why: 'Trop court : tu laisses passer ta meilleure occasion de montrer ton projet.',
      },
      {
        t: "Je commence par ce que je n'aimais pas dans mon ancien travail.",
        ok: false,
        why: "Démarrer sur du négatif donne l'image d'une fuite plutôt que d'un projet.",
      },
    ],
    tip: 'Prépare une trame, pas un texte : quelques mots-clés par étape suffisent.',
  },
  {
    id: 'p2',
    theme: 'parcours',
    jury: true,
    q: "Pourquoi quitter l'informatique ?",
    opts: [
      {
        t: "J'ai apprécié ce métier, en particulier l'aide aux utilisateurs. Mais je veux un métier tourné vers l'accompagnement des personnes, et ce projet s'est construit progressivement.",
        ok: true,
        why: "Tu valorises ton passé, tu fais le lien avec ton projet et tu montres qu'il est réfléchi.",
      },
      {
        t: "L'informatique ne m'intéressait plus, j'en avais assez des écrans.",
        ok: false,
        why: 'Cela ressemble à une fuite. Le jury veut savoir vers quoi tu vas, pas ce que tu quittes.',
      },
      {
        t: "Le secteur infirmier recrute, c'est plus sûr pour l'emploi.",
        ok: false,
        why: "C'est un argument réel, mais seul il ne montre aucune motivation pour le soin.",
      },
      {
        t: 'Mon ancien employeur ne reconnaissait pas mon travail.',
        ok: false,
        why: 'Critiquer un employeur donne une mauvaise image, quelle que soit la réalité.',
      },
    ],
  },
  {
    id: 'p3',
    theme: 'parcours',
    jury: true,
    q: 'Que vous apporte votre expérience en collectivité pour ce métier ?',
    opts: [
      {
        t: "L'écoute des agents, l'explication claire à des personnes non spécialistes, le respect des procédures et le travail en équipe. Par exemple… (situation vécue)",
        ok: true,
        why: 'Tu identifies des compétences transférables au soin et tu les prouves par un exemple.',
      },
      {
        t: 'Rien, ce sont deux mondes complètement différents.',
        ok: false,
        why: "Tu te prives d'un atout : ton expérience contient des compétences utiles.",
      },
      {
        t: 'Je sais réparer les ordinateurs du service.',
        ok: false,
        why: "Compétence technique sans lien avec le soin : ce n'est pas ce que le jury cherche.",
      },
      {
        t: "Je maîtrise l'informatique, et le dossier patient est informatisé : c'est l'essentiel du métier.",
        ok: false,
        why: "C'est un plus, mais réduire le métier à l'informatique montre une vision faussée du soin.",
      },
    ],
    tip: 'Prépare 2 ou 3 situations concrètes de ton parcours que tu pourras raconter en 1 minute chacune.',
  },
  {
    id: 'p4',
    theme: 'parcours',
    jury: true,
    q: "Votre parcours n'a rien à voir avec la santé. Pensez-vous vraiment être à votre place ?",
    opts: [
      {
        t: "Je réponds calmement : je pars de zéro sur les savoirs de soins, c'est le rôle de la formation. J'apporte des compétences transférables et j'ai fait des démarches pour découvrir le métier.",
        ok: true,
        why: "Le jury teste ta réaction à la déstabilisation. Rester posé et argumenter, c'est exactement ce qu'il attend.",
      },
      {
        t: 'Je me vexe un peu et je réponds que mon parcours vaut bien celui des autres.',
        ok: false,
        why: "Une réaction défensive est mal perçue dans un métier où l'on gère des situations tendues.",
      },
      {
        t: 'Je reconnais que vous avez sans doute raison.',
        ok: false,
        why: 'Tu abandonnes ton projet au premier doute : le jury ne peut pas te suivre.',
      },
      {
        t: 'Je change de sujet pour parler de mes qualités.',
        ok: false,
        why: "Esquiver la question donne l'impression que tu n'as pas de réponse.",
      },
    ],
  },
  {
    id: 'p5',
    theme: 'parcours',
    jury: true,
    q: 'Avez-vous été en contact avec le milieu du soin ?',
    opts: [
      {
        t: "J'ai accompagné ma mère lors de ses hospitalisations et j'ai échangé avec les infirmiers libéraux qui la soignaient, avec des infirmiers en réanimation, aux urgences et en médecine, et dans des IFSI. Puis je dis ce que j'en ai retenu.",
        ok: true,
        why: "C'est ton vrai parcours : concret, honnête, et suivi d'une réflexion. C'est ce qui rend ta motivation crédible.",
      },
      {
        t: "J'invente un stage pour paraître plus crédible.",
        ok: false,
        why: "Le jury pose des questions de détail : un mensonge se repère vite et ruine l'entretien.",
      },
      { t: 'Non, mais je regarde beaucoup de séries médicales.', ok: false, why: 'Les séries donnent une image déformée du métier.' },
      {
        t: 'Non, je découvrirai le métier en formation.',
        ok: false,
        why: "Le jury veut voir que ton choix est éclairé avant d'entrer en formation.",
      },
    ],
    tip: "Termine par ce que tu en as retenu sur le métier : c'est ce que le jury cherche derrière cette question.",
  },
  {
    id: 'p6',
    theme: 'parcours',
    jury: true,
    q: "Je vois que vous êtes électricien en intérim. Pouvez-vous m'expliquer ce passage ?",
    opts: [
      {
        t: "Après mon CDD en mairie, j'ai pris une mission d'intérim sur des chantiers. J'y ai appris la sécurité, la vigilance et le travail en équipe, des réflexes utiles en soins, et cette période a confirmé mon projet.",
        ok: true,
        why: 'Tu expliques simplement, tu valorises ce que tu y as appris et tu fais le lien avec ton projet.',
      },
      {
        t: "J'évite le sujet et j'espère que le jury passe à autre chose.",
        ok: false,
        why: 'Tout ce qui est sur ton CV peut être questionné : prépare-toi.',
      },
      {
        t: "C'était juste alimentaire, en attendant autre chose.",
        ok: false,
        why: "Même si c'est en partie vrai, dit comme ça, tu dévalorises ton expérience au lieu de montrer ce qu'elle t'a apporté.",
      },
      {
        t: "Je m'excuse longuement d'avoir changé plusieurs fois de domaine.",
        ok: false,
        why: "Pas besoin de t'excuser : explique et valorise.",
      },
    ],
  },
  // ---------- Tes motivations ----------
  {
    id: 'm1',
    theme: 'motivation',
    jury: true,
    q: 'Pourquoi voulez-vous devenir infirmier ?',
    opts: [
      {
        t: 'Une motivation personnelle et concrète, appuyée sur une expérience ou des échanges, et reliée à des aspects précis du métier : la relation au patient, les soins, le travail en équipe.',
        ok: true,
        why: 'Le jury veut une motivation personnelle, argumentée et ancrée dans la réalité du métier.',
      },
      {
        t: "J'aime aider les gens.",
        ok: false,
        why: "Sincère, mais trop vague : beaucoup de métiers permettent d'aider. Pourquoi celui-ci ?",
      },
      {
        t: "Pour la sécurité de l'emploi et le salaire.",
        ok: false,
        why: 'Ce ne peut pas être ta motivation principale aux yeux du jury.',
      },
      {
        t: 'Parce que les études de médecine sont trop longues.',
        ok: false,
        why: "Cela présente le métier d'infirmier comme un choix par défaut : à éviter absolument.",
      },
    ],
    tip: "C'est LA question à préparer. Construis ta réponse autour d'un déclic, de ce que tu as découvert du métier et de ce qui te correspond.",
  },
  {
    id: 'm2',
    theme: 'motivation',
    jury: true,
    q: 'Pourquoi maintenant ?',
    opts: [
      {
        t: "Mon projet a mûri. Je me suis renseigné et j'ai organisé ma situation, notamment le financement et l'organisation personnelle, pour m'engager dans trois ans de formation.",
        ok: true,
        why: 'Tu montres que le moment est choisi et préparé, pas subi.',
      },
      {
        t: "J'ai perdu mon emploi, il faut bien que je trouve quelque chose.",
        ok: false,
        why: "Le jury entend un choix par défaut. Même si c'est un déclencheur, mets en avant le projet.",
      },
      { t: "Je ne sais pas trop, c'est arrivé comme ça.", ok: false, why: "Cela laisse penser que ton projet n'est pas réfléchi." },
      { t: 'Parce que les inscriptions étaient ouvertes.', ok: false, why: 'Aucun argument sur ton projet.' },
    ],
  },
  {
    id: 'm3',
    theme: 'motivation',
    jury: true,
    q: "Pourquoi infirmier plutôt qu'aide-soignant ?",
    opts: [
      {
        t: "Je connais la différence de rôle : l'infirmier a un rôle propre, applique les prescriptions médicales et assume des responsabilités d'évaluation et de coordination des soins. C'est ce niveau de responsabilité qui m'attire, et je respecte le rôle de l'aide-soignant.",
        ok: true,
        why: 'Tu montres que tu connais les deux métiers et que ton choix est raisonné, sans dénigrer personne.',
      },
      {
        t: "Aide-soignant, c'est un métier moins intéressant.",
        ok: false,
        why: 'Tu travailleras en binôme avec des aides-soignants : dénigrer leur métier est rédhibitoire.',
      },
      { t: 'Je ne connais pas bien la différence.', ok: false, why: "Cela montre que tu ne t'es pas renseigné sur le métier." },
      { t: 'Parce que le salaire est plus élevé.', ok: false, why: "L'argument financier seul ne convainc pas le jury." },
    ],
  },
  {
    id: 'm4',
    theme: 'motivation',
    jury: true,
    q: 'Pourquoi avoir choisi la voie de la formation professionnelle continue ?',
    opts: [
      {
        t: 'Parce que je suis en reconversion avec une expérience professionnelle que je veux valoriser : cette voie est faite pour ce profil.',
        ok: true,
        why: "C'est exactement la raison d'être de la voie FPC selon le document officiel.",
      },
      { t: "Parce que l'écrit est plus facile que sur Parcoursup.", ok: false, why: 'Choisir par facilité donne une image peu engagée.' },
      {
        t: 'Pour que ma formation soit automatiquement financée.',
        ok: false,
        why: "C'est faux : le document officiel précise que la voie FPC ne garantit pas de prise en charge financière.",
      },
      {
        t: "Je ne savais pas qu'il existait une autre voie.",
        ok: false,
        why: 'Cela montre un manque de renseignement sur ton propre parcours.',
      },
    ],
  },
  {
    id: 'm5',
    theme: 'motivation',
    jury: true,
    q: "Qu'est-ce qui vous attire le plus dans ce métier ?",
    opts: [
      {
        t: "Un aspect précis, expliqué : par exemple accompagner un patient dans la durée ou l'éducation à la santé, et pourquoi cela me correspond.",
        ok: true,
        why: "Une réponse précise et personnelle est bien plus convaincante qu'une liste.",
      },
      { t: "Tout m'attire dans ce métier.", ok: false, why: 'Trop général : le jury ne sait pas ce qui te motive vraiment.' },
      {
        t: "Les urgences et l'adrénaline.",
        ok: false,
        why: "C'est une vision réductrice : la majorité des infirmiers ne travaillent pas aux urgences.",
      },
      {
        t: 'La reconnaissance et le prestige de la blouse blanche.',
        ok: false,
        why: "Le jury cherche une motivation tournée vers le patient, pas vers l'image.",
      },
    ],
  },
  {
    id: 'm6',
    theme: 'motivation',
    jury: true,
    q: "Que ferez-vous si vous n'êtes pas retenu cette année ?",
    opts: [
      {
        t: "Je repostulerai en renforçant mon projet, par exemple avec plus d'expérience de terrain. Mon projet est durable.",
        ok: true,
        why: "Tu montres que ton projet ne dépend pas d'une seule tentative.",
      },
      { t: "J'abandonnerai le projet.", ok: false, why: 'Cela fait douter de la solidité de ta motivation.' },
      {
        t: "Je ferai autre chose, j'ai plusieurs projets en parallèle.",
        ok: false,
        why: "Le jury peut penser que le soin n'est qu'une option parmi d'autres.",
      },
      { t: "Ce n'est pas possible, je dois être retenu.", ok: false, why: 'Une réponse trop rigide qui met la pression sur le jury.' },
    ],
  },
  // ---------- Connaissance du métier ----------
  {
    id: 'k1',
    theme: 'metier',
    jury: false,
    q: "Que désigne le « rôle propre » de l'infirmier ?",
    opts: [
      {
        t: "Les soins que l'infirmier décide et réalise de sa propre initiative, dans son champ de compétences (hygiène, confort, surveillance, prévention…)",
        ok: true,
        why: 'On distingue le rôle propre des soins réalisés sur prescription médicale.',
      },
      { t: 'Les soins réalisés uniquement sur prescription médicale', ok: false, why: "C'est l'autre volet du métier, le rôle prescrit." },
      { t: 'Les tâches administratives du service', ok: false, why: "Le rôle propre concerne des soins, pas l'administratif." },
      {
        t: "Les soins réalisés par l'aide-soignant",
        ok: false,
        why: "L'aide-soignant collabore aux soins relevant du rôle propre infirmier, sous sa responsabilité.",
      },
    ],
  },
  {
    id: 'k2',
    theme: 'metier',
    jury: false,
    q: 'Quelle affirmation sur le secret professionnel est juste ?',
    opts: [
      {
        t: "Il s'impose à l'infirmier comme à l'étudiant en soins infirmiers, pour tout ce qu'il voit ou apprend sur le patient",
        ok: true,
        why: 'Dès ton premier stage, tu seras tenu au secret professionnel.',
      },
      { t: 'Il ne concerne que les médecins', ok: false, why: 'Tous les professionnels de santé y sont soumis.' },
      {
        t: "On peut parler d'un patient à sa famille si on ne donne pas son nom",
        ok: false,
        why: 'Le secret couvre toute information sur le patient, nom ou pas.',
      },
      { t: "Il ne s'applique pas aux étudiants en stage", ok: false, why: 'Les étudiants y sont soumis aussi.' },
    ],
  },
  {
    id: 'k3',
    theme: 'metier',
    jury: false,
    q: "Avec qui l'infirmier travaille-t-il au quotidien ?",
    opts: [
      {
        t: 'Une équipe pluriprofessionnelle : médecins, aides-soignants, kinésithérapeutes, assistants sociaux… et les proches du patient',
        ok: true,
        why: 'Le travail en équipe est au cœur du métier : le jury y sera attentif.',
      },
      { t: 'Seul, il est autonome', ok: false, why: "L'infirmier a une autonomie, mais il travaille toujours en équipe." },
      { t: 'Uniquement avec les médecins', ok: false, why: "Vision trop étroite de l'équipe de soins." },
      { t: "Uniquement avec d'autres infirmiers", ok: false, why: "L'équipe de soins est pluriprofessionnelle." },
    ],
  },
  {
    id: 'k4',
    theme: 'metier',
    jury: true,
    q: 'Quelles sont, selon vous, les difficultés du métier ?',
    opts: [
      {
        t: 'Des difficultés réelles : horaires décalés et week-ends, charge physique et émotionnelle, confrontation à la souffrance et à la mort, responsabilités. Et comment je compte y faire face.',
        ok: true,
        why: 'Tu montres une vision réaliste et tu rassures le jury sur ta capacité à tenir.',
      },
      {
        t: "Il n'y en a pas vraiment quand on est motivé.",
        ok: false,
        why: 'Une vision idéalisée inquiète le jury : la réalité risque de te décourager.',
      },
      { t: 'Le salaire, essentiellement.', ok: false, why: "Réponse réductrice qui oublie l'essentiel." },
      {
        t: "Les patients difficiles, mais je ne m'en occuperai pas.",
        ok: false,
        why: 'Prendre soin de tous les patients fait partie du métier.',
      },
    ],
  },
  {
    id: 'k5',
    theme: 'metier',
    jury: false,
    q: 'Où un infirmier peut-il exercer ?',
    opts: [
      {
        t: "À l'hôpital, en clinique, en EHPAD, à domicile en libéral, en santé scolaire, en entreprise, en psychiatrie…",
        ok: true,
        why: "Les lieux d'exercice sont très variés. Citer cette diversité montre que tu t'es renseigné.",
      },
      { t: "Uniquement à l'hôpital", ok: false, why: "L'hôpital n'est qu'un des lieux d'exercice." },
      { t: 'Uniquement en libéral', ok: false, why: "Le libéral est une possibilité parmi beaucoup d'autres." },
      { t: "À l'hôpital et en pharmacie", ok: false, why: "La pharmacie n'est pas un lieu d'exercice infirmier habituel." },
    ],
  },
  {
    id: 'k6',
    theme: 'metier',
    jury: false,
    q: 'Quelle démarche est obligatoire pour exercer après le diplôme ?',
    opts: [
      {
        t: "S'inscrire à l'Ordre national des infirmiers",
        ok: true,
        why: "L'inscription à l'Ordre est obligatoire pour exercer la profession.",
      },
      {
        t: 'Réussir un concours de la fonction publique',
        ok: false,
        why: "Il n'est pas nécessaire pour exercer : on peut travailler en clinique, en libéral, etc.",
      },
      { t: 'Travailler deux ans comme aide-soignant', ok: false, why: 'Aucune obligation de ce type.' },
      { t: 'Aucune, le diplôme suffit', ok: false, why: "L'inscription à l'Ordre est aussi obligatoire." },
    ],
  },
  {
    id: 'k7',
    theme: 'metier',
    jury: false,
    q: "Qu'est-ce que l'éducation thérapeutique du patient ?",
    opts: [
      {
        t: "Aider un patient atteint d'une maladie chronique à acquérir des compétences pour gérer sa maladie et son traitement au quotidien",
        ok: true,
        why: "C'est une mission importante de l'infirmier, par exemple auprès des patients diabétiques.",
      },
      { t: 'Former les étudiants infirmiers en stage', ok: false, why: "C'est le tutorat, pas l'éducation thérapeutique." },
      {
        t: 'Expliquer une ordonnance une seule fois à la sortie',
        ok: false,
        why: "L'éducation thérapeutique est un accompagnement dans la durée.",
      },
      {
        t: 'Laisser le patient choisir seul son traitement',
        ok: false,
        why: "Le patient participe aux décisions, mais avec l'équipe soignante.",
      },
    ],
  },
  // ---------- Qualités et mises en situation ----------
  {
    id: 'q1',
    theme: 'qualites',
    jury: true,
    q: 'Comment gérez-vous le stress ?',
    opts: [
      {
        t: "Je raconte une situation réelle de stress, ce que j'ai fait concrètement (prioriser, demander de l'aide, rester calme) et ce que j'en ai appris.",
        ok: true,
        why: 'Un exemple vécu prouve ta capacité, là où une affirmation ne prouve rien.',
      },
      { t: 'Je ne suis jamais stressé.', ok: false, why: 'Peu crédible, et cela peut traduire un manque de conscience de soi.' },
      { t: 'Je gère très bien, ne vous inquiétez pas.', ok: false, why: 'Aucun élément concret pour le démontrer.' },
      {
        t: 'Le stress me paralyse, mais ça passera.',
        ok: false,
        why: 'Être honnête est bien, mais il faut montrer comment tu y fais face.',
      },
    ],
    tip: 'Méthode simple pour toutes les questions sur tes qualités : situation, action, résultat, ce que tu en retiens.',
  },
  {
    id: 'q2',
    theme: 'qualites',
    jury: true,
    q: 'Citez-moi une de vos qualités.',
    opts: [
      {
        t: 'Une qualité utile au métier, illustrée par un exemple vécu.',
        ok: true,
        why: 'Une seule qualité bien prouvée vaut mieux que cinq affirmées.',
      },
      { t: "J'en liste cinq d'affilée, sans exemple.", ok: false, why: 'Une liste sans preuve ne convainc pas.' },
      { t: "Par modestie, je dis que je n'en ai pas particulièrement.", ok: false, why: 'Le jury attend que tu saches te valoriser.' },
      {
        t: 'Une qualité sans rapport avec le soin, comme la créativité en design.',
        ok: false,
        why: 'Choisis une qualité qui sert ton projet.',
      },
    ],
  },
  {
    id: 'q3',
    theme: 'qualites',
    jury: true,
    q: 'Quel est votre principal défaut ?',
    opts: [
      {
        t: "Un vrai défaut, dont j'ai conscience, et ce que je fais pour progresser.",
        ok: true,
        why: 'Le jury évalue ta capacité à te remettre en question, une qualité clé pour un futur soignant.',
      },
      { t: 'Je suis trop perfectionniste.', ok: false, why: "Un défaut déguisé en qualité : le jury l'a entendu cent fois." },
      { t: "Je n'en ai pas.", ok: false, why: "Personne n'y croit, et cela montre un manque de recul." },
      {
        t: "Je suis souvent en retard, c'est comme ça.",
        ok: false,
        why: 'Un défaut incompatible avec le métier, présenté sans volonté de progresser.',
      },
    ],
  },
  {
    id: 'q4',
    theme: 'qualites',
    jury: true,
    q: "Un patient refuse son traitement et s'énerve. Que faites-vous ?",
    opts: [
      {
        t: "Je reste calme, je l'écoute pour comprendre son refus, je lui réexplique simplement, je respecte son droit de refuser et je transmets l'information à l'équipe et au médecin.",
        ok: true,
        why: 'Écoute, respect du consentement et travail en équipe : tout ce que le jury attend.',
      },
      {
        t: "Je lui donne quand même, c'est pour son bien.",
        ok: false,
        why: 'Le patient a le droit de refuser un soin : on ne le force pas.',
      },
      {
        t: "Je le laisse tranquille et je n'en parle à personne.",
        ok: false,
        why: "Il faut transmettre l'information : l'équipe et le médecin doivent savoir.",
      },
      { t: "Je lui dis qu'il sortira de l'hôpital s'il ne le prend pas.", ok: false, why: "Une menace est contraire à l'éthique du soin." },
    ],
  },
  {
    id: 'q5',
    theme: 'qualites',
    jury: true,
    q: "Comment réagiriez-vous face au décès d'un patient ?",
    opts: [
      {
        t: "Je reconnais que ce sera difficile. J'en parlerais avec l'équipe et je resterais présent pour les proches.",
        ok: true,
        why: "Une réponse lucide et humaine, qui montre que tu sais t'appuyer sur l'équipe.",
      },
      { t: 'Ça ne me touchera pas.', ok: false, why: "Peu crédible, et cela inquiète sur ta capacité d'empathie." },
      { t: 'Je pense que je quitterais le service.', ok: false, why: 'Cela fait douter de ta capacité à exercer ce métier.' },
      { t: "Je n'y ai jamais pensé.", ok: false, why: "C'est une réalité du métier : le jury attend que tu y aies réfléchi." },
    ],
  },
  {
    id: 'q6',
    theme: 'qualites',
    jury: true,
    q: "Vous constatez qu'un collègue s'est trompé dans un soin. Que faites-vous ?",
    opts: [
      {
        t: "La sécurité du patient passe d'abord : j'en parle à mon collègue et l'erreur est signalée selon les procédures du service, sans chercher de coupable.",
        ok: true,
        why: "Tu places la sécurité du patient en priorité, dans le respect de l'équipe.",
      },
      { t: 'Je ne dis rien pour éviter un conflit.', ok: false, why: 'Taire une erreur peut mettre le patient en danger.' },
      { t: 'Je le dénonce à la direction sans lui en parler.', ok: false, why: "Tu ignores le dialogue et l'esprit d'équipe." },
      {
        t: 'Je corrige moi-même sans rien dire.',
        ok: false,
        why: "L'erreur doit être connue pour surveiller le patient et éviter qu'elle se reproduise.",
      },
    ],
  },
  {
    id: 'q7',
    theme: 'qualites',
    jury: false,
    q: 'Laquelle de ces attitudes montre une écoute active ?',
    opts: [
      {
        t: 'Reformuler ce que dit la personne, poser des questions ouvertes, accepter les silences',
        ok: true,
        why: "Ce sont les techniques de base de l'écoute active, utiles avec les patients… et devant le jury.",
      },
      { t: 'Proposer rapidement une solution', ok: false, why: "Cela coupe souvent la personne avant qu'elle ait tout dit." },
      { t: 'Finir les phrases de la personne pour gagner du temps', ok: false, why: "C'est l'inverse de l'écoute." },
      { t: 'Hocher la tête en préparant sa réponse', ok: false, why: "On fait semblant d'écouter, ce que la personne ressent vite." },
    ],
  },
  // ---------- Suivre la formation ----------
  {
    id: 'f1',
    theme: 'formation',
    jury: true,
    q: 'Comment allez-vous vous organiser pour les cours et les stages ?',
    opts: [
      {
        t: "J'ai anticipé : organisation personnelle et familiale, transports vers les lieux de stage, financement, et du temps de travail personnel chaque semaine.",
        ok: true,
        why: "Tu montres que tu mesures l'investissement demandé et que tu t'y es préparé.",
      },
      { t: 'Je verrai le moment venu.', ok: false, why: 'Le jury veut un projet réfléchi, organisation comprise.' },
      {
        t: 'Je garderai mon emploi à temps plein en parallèle.',
        ok: false,
        why: 'Irréaliste avec les cours et les stages à temps plein : cela inquiète le jury.',
      },
      {
        t: 'Les stages, ce sera facile, je connais déjà le monde du travail.',
        ok: false,
        why: 'Les stages sont exigeants et évalués : il ne faut pas les sous-estimer.',
      },
    ],
  },
  {
    id: 'f2',
    theme: 'formation',
    jury: false,
    q: 'Comment la formation en soins infirmiers est-elle organisée ?',
    opts: [
      {
        t: "Trois ans qui alternent enseignements théoriques et stages en milieu de soins, et qui mènent au diplôme d'État",
        ok: true,
        why: "Connaître le rythme de la formation montre que tu sais dans quoi tu t'engages.",
      },
      { t: 'Deux ans de cours, sans stage', ok: false, why: 'La formation dure trois ans et les stages en sont une part essentielle.' },
      { t: 'Un an en alternance dans un hôpital', ok: false, why: 'La formation dure trois ans.' },
      { t: 'Trois ans de stages, sans cours', ok: false, why: 'Les enseignements théoriques sont indispensables.' },
    ],
  },
  {
    id: 'f3',
    theme: 'formation',
    jury: true,
    q: 'Comment comptez-vous financer votre formation ?',
    opts: [
      {
        t: "Je me suis renseigné sur les possibilités, comme la prise en charge régionale selon des critères, un employeur ou un organisme, ou l'autofinancement. Voici ma piste principale et mon plan B.",
        ok: true,
        why: 'Tu montres que ton projet est concret jusque dans son financement.',
      },
      {
        t: 'La voie FPC me garantit le financement.',
        ok: false,
        why: "Faux : le document officiel distingue la voie d'accès et le financement.",
      },
      { t: "Je n'y ai pas encore réfléchi.", ok: false, why: 'Une formation de trois ans sans financement prévu inquiète le jury.' },
      { t: 'Je verrai après la sélection.', ok: false, why: "Mieux vaut avoir des pistes dès l'entretien." },
    ],
    tip: "Demande à l'IFSI de Longjumeau les critères de la prise en charge régionale avant ton oral.",
  },
  {
    id: 'f4',
    theme: 'formation',
    jury: true,
    q: 'Comment réagirez-vous face à une difficulté, par exemple une mauvaise note ?',
    opts: [
      {
        t: "J'analyse mes erreurs, je demande de l'aide aux formateurs ou à d'autres étudiants et j'ajuste ma méthode de travail.",
        ok: true,
        why: 'Tu montres que tu sais rebondir et utiliser les ressources de la formation.',
      },
      { t: "Si c'est trop dur, j'arrêterai.", ok: false, why: 'Cela fait douter de ta persévérance.' },
      { t: 'Ce sera sûrement la faute du formateur.', ok: false, why: 'Rejeter la faute sur les autres est mal perçu.' },
      { t: "Je n'aurai pas de difficultés.", ok: false, why: 'Excès de confiance : tout étudiant rencontre des difficultés.' },
    ],
  },
  {
    id: 'f5',
    theme: 'formation',
    jury: true,
    q: 'Reprendre des études après plusieurs années, ça ne vous fait pas peur ?',
    opts: [
      {
        t: "J'ai conscience du rythme et je m'y prépare déjà, avec une méthode de travail et des révisions régulières. Mon expérience m'apporte aussi organisation et maturité.",
        ok: true,
        why: 'Lucidité et preuves concrètes : la préparation de la sélection est déjà une preuve.',
      },
      {
        t: "Non, je n'ai jamais eu de difficulté à l'école.",
        ok: false,
        why: "Le jury attend que tu mesures l'effort, pas que tu le nies.",
      },
      {
        t: "Si, beaucoup. Je ne sais pas si j'y arriverai.",
        ok: false,
        why: "L'honnêteté est bonne, mais il faut montrer comment tu vas y faire face.",
      },
      { t: 'Je réviserai seulement avant les examens.', ok: false, why: 'La formation demande un travail régulier.' },
    ],
  },
  {
    id: 'f6',
    theme: 'formation',
    jury: true,
    q: "Que savez-vous de l'institut où vous souhaitez entrer ?",
    opts: [
      {
        t: "Des éléments concrets : son groupement universitaire, la date de rentrée, et ce que j'ai appris en le visitant ou en échangeant avec des étudiants.",
        ok: true,
        why: 'Tu montres un vrai intérêt et une démarche active.',
      },
      { t: 'Rien de particulier, les instituts se ressemblent tous.', ok: false, why: 'Cela montre un manque de préparation.' },
      { t: "C'est le plus proche de chez moi, c'est tout.", ok: false, why: 'Un argument pratique, mais insuffisant seul.' },
      { t: "J'en ai vaguement entendu parler sur internet.", ok: false, why: 'Trop vague pour convaincre.' },
    ],
    tip: 'Pour Longjumeau : IFSI du Groupe Hospitalier Nord Essonne, groupement Université Paris-Saclay, rentrée en septembre 2027.',
  },
  {
    id: 'f7',
    theme: 'formation',
    jury: false,
    q: "Pendant les stages, l'étudiant en soins infirmiers…",
    opts: [
      {
        t: 'réalise progressivement des soins sous la responsabilité de professionnels, et ses compétences sont évaluées',
        ok: true,
        why: "Les stages sont un lieu d'apprentissage encadré et évalué.",
      },
      { t: 'observe seulement, sans réaliser de soins', ok: false, why: "L'étudiant participe aux soins, de façon progressive." },
      { t: 'travaille seul, comme un infirmier diplômé', ok: false, why: 'Il est toujours encadré par des professionnels.' },
      {
        t: 'choisit librement ses horaires',
        ok: false,
        why: 'Il suit les horaires du service, y compris parfois en soirée ou le week-end.',
      },
    ],
  },
];
