// Sujets de rédaction sanitaire et sociale (textes rédigés pour l'entraînement).
// Pour ajouter un sujet : copier un objet { id, theme, title, doc, qs } et changer son contenu.
// doc: null pour un sujet de réflexion sans texte.

export const SUBJ = [
  {
    id: 'aidants',
    theme: 'Vieillissement',
    title: 'Les aidants, des soignants invisibles',
    doc: `Des millions de personnes accompagnent au quotidien un proche âgé, malade ou en situation de handicap. Toilette, repas, rendez-vous médicaux, présence la nuit : ces aidants familiaux assurent une grande partie de l'accompagnement à domicile, souvent sans formation et en plus de leur travail. Beaucoup disent manquer de temps pour eux-mêmes et repoussent leurs propres soins. L'épuisement de l'aidant est aujourd'hui reconnu comme un risque pour sa santé, mais aussi pour la personne aidée, dont le maintien à domicile peut alors être remis en cause.`,
    qs: [
      `Quel est le problème principal soulevé par ce texte ?`,
      `Quelles peuvent être les conséquences de l'épuisement d'un aidant, pour lui et pour la personne aidée ?`,
      `Selon vous, quel rôle l'infirmier peut-il jouer auprès des aidants ? Argumentez.`,
    ],
  },
  {
    id: 'deserts',
    theme: 'Accès aux soins',
    title: 'Trouver un médecin',
    doc: `Dans certains territoires, obtenir un rendez-vous chez un médecin généraliste demande plusieurs semaines, et de nombreux habitants n'ont plus de médecin traitant. Les urgences hospitalières accueillent alors des patients dont la situation aurait pu être prise en charge en ville. Pour répondre à ces difficultés, les pouvoirs publics misent notamment sur les maisons de santé pluriprofessionnelles, la télémédecine et l'élargissement des missions de certains professionnels, dont les infirmiers en pratique avancée.`,
    qs: [
      `À partir du texte, expliquez ce que l'on appelle un « désert médical ».`,
      `Quelles sont les conséquences de ces difficultés d'accès aux soins sur le système de santé ?`,
      `L'élargissement du rôle des infirmiers vous semble-t-il une réponse adaptée ? Argumentez.`,
    ],
  },
  {
    id: 'vaccin',
    theme: 'Prévention',
    title: 'Le doute vaccinal',
    doc: `La vaccination a permis de faire reculer, et parfois de faire disparaître, des maladies autrefois très meurtrières. Pourtant, une partie de la population exprime aujourd'hui des doutes : peur des effets indésirables, méfiance envers les laboratoires ou les autorités, informations contradictoires sur les réseaux sociaux. Les professionnels de santé restent cependant parmi les interlocuteurs en qui le public a le plus confiance.`,
    qs: [
      `Quelles sont les raisons de l'hésitation vaccinale évoquées dans le texte ?`,
      `Comment un soignant peut-il répondre aux doutes d'un patient sur la vaccination ? Donnez des exemples concrets.`,
    ],
  },
  {
    id: 'jeunes',
    theme: 'Santé mentale',
    title: 'La santé mentale des jeunes',
    doc: `Anxiété, troubles du sommeil, isolement : les professionnels observent depuis plusieurs années une dégradation de la santé mentale des adolescents et des jeunes adultes. Les services de pédopsychiatrie sont saturés et les délais pour obtenir un rendez-vous se comptent parfois en mois. Parler de sa souffrance psychique reste difficile, par peur d'être jugé ou de ne pas être pris au sérieux.`,
    qs: [
      `Dégagez les idées principales de ce texte.`,
      `Pourquoi est-il difficile pour un jeune de demander de l'aide ?`,
      `Quelles actions de prévention pourraient être menées auprès des jeunes ? Justifiez vos propositions.`,
    ],
  },
  {
    id: 'violence',
    theme: 'Conditions de travail',
    title: 'Violences envers les soignants',
    doc: `Insultes, menaces, parfois agressions physiques : les signalements de violences envers les soignants augmentent. Elles surviennent souvent aux urgences, dans un contexte d'attente longue, d'angoisse et d'incompréhension. Ces violences ont des conséquences sur la santé des professionnels et contribuent à rendre certains métiers moins attractifs.`,
    qs: [
      `Quelles sont les causes possibles de ces violences d'après le texte ?`,
      `Quelles peuvent en être les conséquences pour les soignants et pour la qualité des soins ?`,
      `Comment un infirmier peut-il prévenir ou apaiser une situation de tension ? Argumentez.`,
    ],
  },
  {
    id: 'finvie',
    theme: 'Fin de vie',
    title: 'Les soins palliatifs',
    doc: `Les soins palliatifs visent à soulager la douleur et les autres symptômes, et à accompagner la personne en fin de vie ainsi que ses proches. Ils ne concernent pas seulement les derniers jours : ils peuvent être proposés tôt dans l'évolution d'une maladie grave. Pourtant, l'accès à ces soins reste inégal selon les territoires, et la fin de vie fait régulièrement l'objet de débats de société.`,
    qs: [
      `Quels sont les objectifs des soins palliatifs présentés dans le texte ?`,
      `En quoi l'accompagnement des proches fait-il partie du soin ?`,
      `Selon vous, quelles qualités humaines un infirmier doit-il mobiliser auprès d'un patient en fin de vie ?`,
    ],
  },
  {
    id: 'sedentarite',
    theme: 'Prévention',
    title: 'Sédentarité et santé',
    doc: `Le manque d'activité physique et le temps passé assis devant les écrans augmentent, chez les enfants comme chez les adultes. Or la sédentarité favorise le surpoids, les maladies cardiovasculaires, le diabète et certains troubles psychologiques. Les campagnes de prévention se multiplient, mais changer ses habitudes de vie reste difficile, en particulier pour les personnes en situation de précarité.`,
    qs: [
      `Quel lien le texte établit-il entre mode de vie et santé ?`,
      `Pourquoi les campagnes de prévention ne suffisent-elles pas toujours ?`,
      `Proposez et justifiez deux actions de prévention qu'un infirmier pourrait mener.`,
    ],
  },
  {
    id: 'handicap',
    theme: 'Handicap',
    title: 'Se soigner avec un handicap',
    doc: `Se déplacer, accéder à un cabinet médical, comprendre une ordonnance : pour une personne en situation de handicap, ces démarches simples peuvent devenir des obstacles. Certaines renoncent à des soins courants, comme le dentiste ou les dépistages, faute d'équipements adaptés ou de professionnels formés. L'accès aux soins des personnes handicapées est pourtant un droit.`,
    qs: [
      `Quels obstacles à l'accès aux soins le texte met-il en évidence ?`,
      `Comment les établissements de santé pourraient-ils mieux accueillir les personnes en situation de handicap ? Argumentez.`,
    ],
  },
  {
    id: 'precarite',
    theme: 'Précarité',
    title: 'Renoncer à se soigner',
    doc: `Une consultation mal remboursée, une paire de lunettes, des soins dentaires : pour les personnes aux revenus modestes, certains soins sont repoussés, voire abandonnés. Le renoncement aux soins ne s'explique pas seulement par le coût : la complexité des démarches administratives, l'éloignement géographique ou la méfiance envers les institutions jouent aussi un rôle. Ces retards aggravent souvent l'état de santé et conduisent à des prises en charge plus lourdes.`,
    qs: [
      `Quelles sont les causes du renoncement aux soins évoquées dans le texte ?`,
      `Quelles en sont les conséquences pour la personne et pour la société ?`,
      `Quel peut être le rôle du soignant face à un patient en situation de précarité ?`,
    ],
  },
  {
    id: 'numerique',
    theme: 'Santé numérique',
    title: 'Le numérique au service du soin ?',
    doc: `Prise de rendez-vous en ligne, téléconsultation, dossier médical partagé, objets connectés : le numérique transforme l'organisation des soins. Il peut faciliter le suivi des patients à distance et faire gagner du temps aux professionnels. Mais il soulève aussi des questions : protection des données de santé, exclusion des personnes peu à l'aise avec les outils numériques, risque de déshumanisation de la relation de soin.`,
    qs: [
      `Présentez les avantages et les limites du numérique en santé évoqués dans le texte.`,
      `Le numérique peut-il remplacer la relation humaine dans le soin ? Argumentez votre réponse.`,
    ],
  },
  {
    id: 'antibio',
    theme: 'Santé publique',
    title: 'Les antibiotiques en danger',
    doc: `L'utilisation excessive ou inadaptée des antibiotiques favorise l'apparition de bactéries résistantes. Certaines infections deviennent ainsi plus difficiles, voire impossibles, à traiter. Les autorités de santé rappellent que les antibiotiques sont inefficaces contre les virus et qu'un traitement doit être pris en respectant la durée prescrite. L'hygiène des mains, à l'hôpital comme en ville, reste l'un des moyens les plus efficaces de limiter la transmission des bactéries.`,
    qs: [
      `Expliquez avec vos mots ce qu'est l'antibiorésistance d'après le texte.`,
      `Quels comportements permettent de limiter ce phénomène ?`,
      `Quel rôle le futur infirmier peut-il jouer dans cette lutte ?`,
    ],
  },
  {
    id: 'prendresoin',
    theme: 'Sujet de réflexion',
    title: 'Soigner ou prendre soin',
    doc: null,
    qs: [
      `« Soigner, ce n'est pas seulement traiter une maladie, c'est prendre soin d'une personne. » Que vous inspire cette affirmation ? Développez une réponse argumentée, appuyée sur des exemples.`,
    ],
  },
];
