# Prépa sélection IFSI (React)

Application d'entraînement à la sélection IFSI, voie formation professionnelle continue (Île-de-France) : oral entre le 16 novembre 2026 et le 8 janvier 2027, écrit le 9 décembre 2026.

- **Accueil** : double compte à rebours (oral et écrit), bandeau « Priorité à l'oral », progression par thème et historique.
- **Calculs** : exercices générés à l'infini sur sept thèmes, dont « Concours+ » (9 types de problèmes plus difficiles, avec le piège signalé), correction pas à pas et séries chronométrées de 12 questions en 30 minutes.
- **Rédaction** : 15 sujets sanitaires et sociaux. À l'ouverture, un sujet est tiré au hasard parmi ceux pas encore faits ; on peut aussi le choisir dans la liste (✓ = déjà fait). À la fin d'un sujet, « Sujet suivant » enchaîne sur un autre sujet au hasard, jusqu'à avoir fait le tour des 15. Trois modes :
  - « QCM : la meilleure copie » : 4 réponses rédigées et notées par question, puis la copie modèle ;
  - « QCM : la méthode » : 6 étapes de construction d'une copie ;
  - « Écrire ma copie » : chrono de 30 minutes, copie à grands carreaux, correction notée sur 20.
- **Examen blanc** : rédaction puis calculs enchaînés, avec une estimation de la note d'écrit.
- **Oral** :
  - « Réponds comme devant le jury » : 13 questions personnelles, chrono avec durée conseillée, dictée au micro, correction sur 10 ;
  - entretien blanc de 20 minutes avec Claude en jury, puis bilan noté sur 20 ;
  - « Mes réponses personnelles » : les trames construites à partir de la lettre et du CV ;
  - QCM de 40 questions sur 6 thèmes et fiche mémo.

## Lancer l'app sur ton ordinateur

Il faut [Node.js](https://nodejs.org) version 18 ou plus récente.

```bash
npm install
npm run dev
```

Ouvre ensuite l'adresse affichée dans le terminal (en général http://localhost:5173). Chaque modification d'un fichier de `src/` s'affiche immédiatement dans le navigateur.

## Organisation du code

```
src/
  App.jsx                 onglets et double compte à rebours
  main.jsx                point d'entrée React
  styles.css              couleurs, polices et mise en page (thème clair et sombre)
  hooks/
    useTimer.js           compte à rebours réutilisable
  data/
    sujets.json           les 15 sujets : thème, titre, texte, questions
    qcm-redaction.json    pour chaque sujet : les copies notées et le QCM de méthode
  lib/
    dates.js              dates clés (oral, écrit) et calcul des jours restants
    generators.js         générateurs d'exercices de calcul (dont Concours+) et vérification des réponses
    subjects.js           lit la liste des sujets dans data/sujets.json
    subjectPicker.js      choix du sujet au hasard (d'abord ceux pas encore faits) et sujets terminés
    redactionQcm.js       chargement des QCM de rédaction, et consignes pour Claude (claude.ai)
    oralQuestions.js      questions du QCM de l'oral
    oralProfil.js         ton profil (lettre et CV) et les trames de tes 13 réponses personnelles
    oralPrompts.js        consignes envoyées à Claude pour l'oral (correction, entretien, bilan)
    claude.js             accès à Claude et correction des rédactions
    storage.js            progression enregistrée dans le navigateur
    format.js             nombres et heures à la française, hasard
  components/
    Home.jsx              accueil, progression par thème, historique
    CalcPage.jsx          onglet Calculs (entraînement libre + série)
    CalcFree.jsx          une question à la fois
    Series.jsx            série chronométrée
    SeriesResult.jsx      correction d'une série
    RedactionPage.jsx     onglet Rédaction : choix entre les trois modes
    RedactionCopiesQcm.jsx  QCM « la meilleure copie »
    RedactionMethodeQcm.jsx QCM « la méthode »
    RedactionWrite.jsx    écrire sa copie et la faire corriger
    Editor.jsx            sujet + copie + chrono
    Correction.jsx        correction par Claude
    SelfEval.jsx          grille d'autoévaluation
    SubjectCard.jsx       affichage d'un sujet
    ExamPage.jsx          examen blanc
    OralPage.jsx          onglet Oral : assemble les outils ci-dessous, QCM, fiche mémo
    OralLibre.jsx         « Réponds comme devant le jury »
    Entretien.jsx         entretien blanc et bilan
    MesReponses.jsx       trames des réponses personnelles
    Mic.jsx               bouton de dictée au micro
```

Pour ajouter une question à l'oral, ajoute un objet dans `src/lib/oralQuestions.js` : 4 options, une seule avec `ok: true`, et une explication `why` pour chacune.

Pour ajouter un sujet de rédaction, ajoute-le dans `src/data/sujets.json`, puis ajoute ses copies et son QCM de méthode dans `src/data/qcm-redaction.json`, sous le même `id` (même format que les autres sujets).
Pour ajouter un type de calcul, ajoute une fonction dans le thème voulu de l'objet `GEN` de `src/lib/generators.js` : elle doit renvoyer `{ q, ans, unit, steps }`.

## Ce qui utilise Claude

Les QCM de rédaction des 15 sujets sont intégrés à l'application (`src/data/`) : ils fonctionnent partout, sans réseau ni Claude. Sur claude.ai, un bouton permet en plus de demander à Claude de nouvelles copies.

La correction des rédactions, la correction des réponses orales, l'entretien blanc et son bilan utilisent Claude via `window.claude`, qui n'existe que lorsque la page est publiée comme artifact sur claude.ai.
En local (`npm run dev`), ces fonctions affichent une solution de remplacement (grille d'autoévaluation, trame de réponse). Tout le reste fonctionne.

La dictée utilise la reconnaissance vocale du navigateur (Chrome, Edge, Safari). Si elle n'est pas disponible, l'app conseille le micro du clavier du téléphone.

## Mettre en forme le code

```bash
npx prettier --write "src/**/*.{js,jsx,css}"
```

## Construire la page en ligne

```bash
npm run build:artifact
```

Cette commande regroupe toute l'app dans un seul fichier, `artifact.html`, prêt à être publié comme artifact sur claude.ai.
Pour une mise en ligne classique (hébergeur web), utilise `npm run build` : le site est produit dans `dist/`.
