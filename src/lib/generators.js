// Générateurs d'exercices de calcul. Chaque générateur renvoie :
// { q: énoncé, ans: réponse, unit, kind: 'num' | 'time', tol: tolérance, steps: [méthode] }
// Pour kind 'time', ans est un nombre de minutes depuis minuit.

import { R, pick, shuffle, clean, f, gcd, hm, dur } from './format.js';

export const CATS = {
  pct: 'Pourcentages',
  prop: 'Proportionnalité',
  conv: 'Conversions',
  duree: 'Durées et horaires',
  debit: 'Débits et dosages',
  ops: 'Opérations',
  plus: 'Concours+',
};

function convGen(units) {
  let i, j, v, a;
  do {
    i = R(0, units.length - 1);
    j = R(0, units.length - 1);
    v = pick([0.05, 0.25, 0.5, 1.2, 2.5, 4, 12.5, 35, 250, 500, 750, 1500]);
    a = clean((v * units[i][1]) / units[j][1]);
  } while (i === j || Math.abs(i - j) > 2 || a < 0.001 || a > 1e6);
  const [fu, fv] = units[i];
  const [tu, tv] = units[j];
  const steps =
    fv > tv
      ? [`1 ${fu} = ${f(fv / tv)} ${tu}`, `${f(v)} × ${f(fv / tv)} = ${f(a)} ${tu}`]
      : [`1 ${tu} = ${f(tv / fv)} ${fu}`, `${f(v)} ÷ ${f(tv / fv)} = ${f(a)} ${tu}`];
  return { q: `Convertis ${f(v)} ${fu} en ${tu}.`, ans: a, unit: tu, steps };
}

const GEN = {
  pct: [
    () => {
      let t, p, a;
      do {
        t = pick([120, 160, 240, 350, 480, 600, 800, 1250]);
        p = pick([5, 10, 12, 15, 20, 25, 30, 35, 40, 45, 60, 75]);
        a = (t * p) / 100;
      } while (!Number.isInteger(a));
      return {
        q: `Un service a accueilli ${f(t)} patients cette année. ${p} % d'entre eux avaient plus de 75 ans. Combien de patients cela représente-t-il ?`,
        ans: a,
        unit: 'patients',
        steps: [`${p} % de ${f(t)} = ${f(t)} × ${p} ÷ 100`, `= ${f(a)} patients`],
      };
    },
    () => {
      const x = pick([40, 60, 80, 120, 150, 250, 320]);
      const p = pick([10, 15, 20, 25, 30]);
      const up = Math.random() < 0.5;
      const d = clean((x * p) / 100);
      const a = clean(up ? x + d : x - d);
      return {
        q: `Un tensiomètre électronique coûte ${f(x)} €. Son prix ${up ? 'augmente' : 'baisse'} de ${p} %. Quel est son nouveau prix ?`,
        ans: a,
        unit: '€',
        steps: [
          `${up ? 'Hausse' : 'Baisse'} : ${f(x)} × ${p} ÷ 100 = ${f(d)} €`,
          `Nouveau prix : ${f(x)} ${up ? '+' : '−'} ${f(d)} = ${f(a)} €`,
          `Raccourci : ${f(x)} × ${f(1 + (up ? p : -p) / 100)} = ${f(a)} €`,
        ],
      };
    },
    () => {
      const t = pick([40, 50, 80, 120, 200, 250, 400]);
      let p, part;
      do {
        p = pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 55, 60, 65, 70, 75, 80, 85]);
        part = (t * p) / 100;
      } while (!Number.isInteger(part));
      return {
        q: `Sur ${t} candidats inscrits en FPC, ${part} sont aides-soignants. Quel pourcentage des candidats cela représente-t-il ?`,
        ans: p,
        unit: '%',
        steps: ['Pourcentage = partie ÷ total × 100', `${part} ÷ ${t} × 100 = ${p} %`],
      };
    },
  ],
  prop: [
    () => {
      const u = pick([1.2, 1.5, 2.4, 2.6, 3.5, 4.2]);
      const n1 = R(3, 8);
      const n2 = R(9, 15);
      const t1 = clean(u * n1);
      const a = clean(u * n2);
      return {
        q: `${n1} boîtes de compresses stériles coûtent ${f(t1)} €. Combien coûtent ${n2} boîtes ?`,
        ans: a,
        unit: '€',
        steps: [`Prix d'une boîte : ${f(t1)} ÷ ${n1} = ${f(u)} €`, `Prix de ${n2} boîtes : ${f(u)} × ${n2} = ${f(a)} €`],
      };
    },
    () => {
      let n, d, t, a;
      do {
        d = pick([4, 5, 8, 10]);
        n = R(1, d - 1);
        t = pick([240, 320, 400, 480, 560, 640, 800, 960]);
        a = (t * n) / d;
      } while (!Number.isInteger(a) || gcd(n, d) !== 1);
      return {
        q: `Un hôpital compte ${t} lits. Les ${n}/${d} de ces lits sont en médecine. Combien y a-t-il de lits de médecine ?`,
        ans: a,
        unit: 'lits',
        steps: [`${n}/${d} de ${t} = ${t} ÷ ${d} × ${n}`, `= ${f(t / d)} × ${n} = ${a} lits`],
      };
    },
    () => {
      let dose, kg, pr, day;
      do {
        dose = pick([10, 15, 20, 25, 30]);
        kg = pick([12, 18, 24, 30, 36, 48, 60]);
        pr = pick([2, 3, 4]);
        day = dose * kg;
      } while (day % pr);
      const a = day / pr;
      return {
        q: `La prescription est de ${dose} mg/kg/jour, répartis en ${pr} prises. Le patient pèse ${kg} kg. Quelle dose donner à chaque prise ?`,
        ans: a,
        unit: 'mg',
        steps: [`Dose par jour : ${dose} × ${kg} = ${day} mg`, `Dose par prise : ${day} ÷ ${pr} = ${a} mg`],
      };
    },
  ],
  conv: [
    () =>
      convGen([
        ['kg', 1e6],
        ['g', 1e3],
        ['mg', 1],
        ['µg', 1e-3],
      ]),
    () =>
      convGen([
        ['L', 1000],
        ['dL', 100],
        ['cL', 10],
        ['mL', 1],
      ]),
    () => {
      const h = pick([0.4, 0.75, 1.25, 1.5, 1.75, 2.25, 2.5, 2.75, 3.2]);
      const a = clean(h * 60);
      return {
        q: `Combien de minutes y a-t-il dans ${f(h)} h ?`,
        ans: a,
        unit: 'min',
        steps: ['1 h = 60 min', `${f(h)} × 60 = ${f(a)} min`, `Soit ${dur(a)}`],
      };
    },
  ],
  duree: [
    () => {
      const s = R(84, 240) * 5;
      const d = R(4, 66) * 5;
      const e = s + d;
      const mid = s + Math.floor(d / 60) * 60;
      return {
        kind: 'time',
        q: `Une perfusion débute à ${hm(s)} et dure ${dur(d)}. À quelle heure se termine-t-elle ?`,
        ans: e % 1440,
        unit: '',
        ph: 'ex. 17h25',
        steps: [
          d >= 60 ? `${hm(s)} + ${Math.floor(d / 60)} h = ${hm(mid)}` : `On part de ${hm(s)}`,
          `${hm(mid)} + ${d % 60} min = ${hm(e)}`,
          "Rappel : 60 min = 1 h, on reporte l'heure.",
        ],
      };
    },
    () => {
      const s = R(72, 168) * 5;
      const d = R(12, 90) * 5;
      const e = s + d;
      return {
        q: `Un aide-soignant commence son service à ${hm(s)} et le termine à ${hm(e)}. Combien de temps a-t-il travaillé ? Réponds en minutes.`,
        ans: d,
        unit: 'min',
        steps: [`De ${hm(s)} à ${hm(e)} : ${dur(d)}`, `${Math.floor(d / 60)} × 60 + ${d % 60} = ${d} min`],
      };
    },
  ],
  debit: [
    () => {
      let v, h, a;
      do {
        v = pick([250, 500, 1000, 1500, 2000]);
        h = pick([2, 4, 5, 8, 10, 12, 24]);
        a = v / h;
      } while (!Number.isInteger(a));
      return {
        q: `Une perfusion de ${f(v)} mL doit passer en ${h} h. Quel est le débit en mL/h ?`,
        ans: a,
        unit: 'mL/h',
        steps: ['Débit = volume ÷ durée', `${f(v)} ÷ ${h} = ${f(a)} mL/h`],
      };
    },
    () => {
      const v = pick([500, 1000, 1500]);
      const h = pick([4, 6, 8, 12, 24]);
      const ex = (v * 20) / (h * 60);
      const a = Math.round(ex);
      return {
        q: `Une perfusion de ${f(v)} mL doit passer en ${h} h avec un perfuseur standard (1 mL = 20 gouttes). Quel est le débit en gouttes par minute ? Arrondis à l'unité.`,
        ans: a,
        tol: 1,
        unit: 'gouttes/min',
        steps: [
          `Nombre de gouttes : ${f(v)} × 20 = ${f(v * 20)}`,
          `Durée en minutes : ${h} × 60 = ${h * 60} min`,
          `${f(v * 20)} ÷ ${h * 60} ≈ ${f(Math.round(ex * 100) / 100)}, soit ${a} gouttes/min`,
        ],
      };
    },
    () => {
      const mg = pick([100, 200, 250, 500, 1000]);
      const vol = pick([2, 5, 10, 20]);
      const k = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75]);
      const need = clean(mg * k);
      const a = clean(vol * k);
      return {
        q: `Une ampoule de ${vol} mL contient ${f(mg)} mg de produit. Quel volume faut-il prélever pour obtenir ${f(need)} mg ?`,
        ans: a,
        unit: 'mL',
        steps: [`Concentration : ${f(mg)} ÷ ${vol} = ${f(mg / vol)} mg/mL`, `Volume : ${f(need)} ÷ ${f(mg / vol)} = ${f(a)} mL`],
      };
    },
  ],
  ops: [
    () => {
      const t = R(0, 2);
      if (t === 0) {
        const a = pick([4.25, 3.75, 12.5, 2.8, 6.4, 0.35]);
        const b = R(6, 24);
        const r = clean(a * b);
        const ip = Math.floor(a);
        const dp = clean(a - ip);
        return {
          q: `Calcule : ${f(a)} × ${b}`,
          ans: r,
          unit: '',
          steps: ip
            ? [`${f(a)} × ${b} = (${ip} × ${b}) + (${f(dp)} × ${b})`, `= ${ip * b} + ${f(dp * b)} = ${f(r)}`]
            : [`${f(a)} × ${b} = ${f(r)}`],
        };
      }
      if (t === 1) {
        const b = R(3, 9);
        const r = clean(R(12, 95) / 10);
        const a = clean(r * b);
        return {
          q: `Calcule : ${f(a)} ÷ ${b}`,
          ans: r,
          unit: '',
          steps: [`${f(a)} ÷ ${b} = ${f(r)}`, `Vérification : ${f(r)} × ${b} = ${f(a)}`],
        };
      }
      const a = R(800, 2500);
      const b = clean(R(10000, 60000) / 100);
      const r = clean(a - b);
      return {
        q: `Calcule : ${f(a)} − ${f(b)}`,
        ans: r,
        unit: '',
        steps: [`${f(a)} − ${f(b)} = ${f(r)}`, `Vérification : ${f(r)} + ${f(b)} = ${f(a)}`],
      };
    },
    () => {
      const n = pick([3, 4, 5]);
      const vals = Array.from({ length: n }, () => clean(R(362, 392) / 10));
      const s = clean(vals.reduce((x, y) => x + y, 0));
      const a = Math.round((s / n) * 100) / 100;
      return {
        q: `Températures relevées chez un patient : ${vals.map(f).join(' ; ')} °C. Quelle est la température moyenne ? Arrondis au centième.`,
        ans: a,
        tol: 0.011,
        unit: '°C',
        steps: [`Somme : ${vals.map(f).join(' + ')} = ${f(s)}`, `Moyenne : ${f(s)} ÷ ${n} ≈ ${f(a)} °C`],
      };
    },
  ],
  // Concours+ : problèmes plus difficiles, chaque correction signale le piège classique.
  plus: [
    () => {
      let w, d, w2, a;
      do {
        w = pick([4, 6, 8, 9, 10, 12]);
        d = pick([6, 8, 9, 10, 12, 15, 18]);
        w2 = pick([3, 4, 5, 6, 8, 9, 12, 15, 18]);
        a = (w * d) / w2;
      } while (w2 === w || !Number.isInteger(a));
      return {
        q: `${w} infirmiers mettent ${d} heures pour réaliser l'inventaire de la pharmacie du service. Combien d'heures faudrait-il à ${w2} infirmiers travaillant au même rythme ?`,
        ans: a,
        unit: 'h',
        steps: [
          'Attention : proportionnalité inverse (plus de personnes = moins de temps).',
          `Travail total : ${w} × ${d} = ${w * d} heures de travail`,
          `Avec ${w2} infirmiers : ${w * d} ÷ ${w2} = ${f(a)} h`,
        ],
      };
    },
    () => {
      let d, v, m;
      do {
        v = pick([30, 40, 45, 50, 60, 72, 80, 90]);
        d = R(6, 60);
        m = (d / v) * 60;
      } while (!Number.isInteger(m) || m < 5);
      return {
        q: `Une ambulance parcourt ${d} km à la vitesse moyenne de ${v} km/h. Combien de minutes dure le trajet ?`,
        ans: m,
        unit: 'min',
        steps: ['Temps = distance ÷ vitesse', `${d} ÷ ${v} = ${f(d / v)} h`, `${f(d / v)} × 60 = ${f(m)} min`],
      };
    },
    () => {
      const p = pick([40, 60, 80, 120, 150, 200, 250]),
        a = pick([10, 20, 25, 30]),
        b = pick([10, 20, 25, 30]),
        x = clean(p * (1 + a / 100)),
        y = clean(x * (1 - b / 100)),
        r = Math.round(y * 100) / 100;
      return {
        q: `Un fauteuil roulant coûte ${f(p)} €. Son prix augmente de ${a} %, puis baisse de ${b} %. Quel est son prix final ?`,
        ans: r,
        tol: 0.011,
        unit: '€',
        steps: [
          `Après la hausse : ${f(p)} × ${f(1 + a / 100)} = ${f(x)} €`,
          `Après la baisse : ${f(x)} × ${f(1 - b / 100)} = ${f(r)} €`,
          a === b
            ? 'Piège : une hausse puis une baisse du même pourcentage ne ramènent pas au prix de départ.'
            : 'On applique chaque pourcentage au nouveau prix, pas au prix de départ.',
        ],
      };
    },
    () => {
      const o0 = pick([40, 50, 60, 80, 120, 150, 200, 240]),
        t = pick([10, 20, 25, 50]),
        x = clean(o0 * (1 + t / 100));
      return {
        q: `Après une augmentation de ${t} %, un appareil coûte ${f(x)} €. Quel était son prix avant l'augmentation ?`,
        ans: o0,
        unit: '€',
        steps: [
          `Le nouveau prix vaut ${100 + t} % de l'ancien : ancien × ${f(1 + t / 100)} = ${f(x)}`,
          `Ancien prix : ${f(x)} ÷ ${f(1 + t / 100)} = ${f(o0)} €`,
          `Piège : retirer ${t} % de ${f(x)} ne donne pas le bon résultat.`,
        ],
      };
    },
    () => {
      const n = [R(6, 18), R(6, 18), R(6, 18)],
        c = shuffle([1, 2, 3, 4]).slice(0, 3),
        sum = n[0] * c[0] + n[1] * c[1] + n[2] * c[2],
        cs = c[0] + c[1] + c[2],
        m = Math.round((sum / cs) * 100) / 100;
      return {
        q: `Un étudiant obtient ${n[0]}/20 (coefficient ${c[0]}), ${n[1]}/20 (coefficient ${c[1]}) et ${n[2]}/20 (coefficient ${c[2]}). Quelle est sa moyenne ? Arrondis au centième.`,
        ans: m,
        tol: 0.011,
        unit: '/20',
        steps: [
          `Total des points : ${n[0]} × ${c[0]} + ${n[1]} × ${c[1]} + ${n[2]} × ${c[2]} = ${sum}`,
          `Total des coefficients : ${c[0]} + ${c[1]} + ${c[2]} = ${cs}`,
          `Moyenne : ${sum} ÷ ${cs} ≈ ${f(m)}/20`,
        ],
      };
    },
    () => {
      let c1, c2, v2, v1;
      do {
        c1 = pick([5, 10, 20, 25, 50]);
        c2 = pick([1, 2, 2.5, 4, 5, 10]);
        v2 = pick([100, 200, 250, 500, 1000]);
        v1 = (c2 * v2) / c1;
      } while (c2 >= c1 || !Number.isInteger(v1 * 10));
      return {
        q: `On veut préparer ${f(v2)} mL d'une solution à ${f(c2)} % à partir d'une solution mère à ${c1} %. Quel volume de solution mère faut-il prélever ?`,
        ans: clean(v1),
        unit: 'mL',
        steps: [
          'Formule de dilution : C1 × V1 = C2 × V2',
          `V1 = C2 × V2 ÷ C1 = ${f(c2)} × ${f(v2)} ÷ ${c1}`,
          `V1 = ${f(v1)} mL (on complète ensuite avec ${f(v2 - v1)} mL de diluant)`,
        ],
      };
    },
    () => {
      let d, w, n, c, v;
      do {
        d = pick([10, 15, 20, 25, 30, 40, 50]);
        w = pick([12, 16, 18, 20, 24, 30, 36, 40]);
        n = pick([2, 3, 4]);
        c = pick([5, 10, 20, 25, 40, 50]);
        v = (d * w) / n / c;
      } while (!Number.isInteger(v * 10) || v < 0.5);
      return {
        q: `Prescription : ${d} mg/kg/jour en ${n} prises, pour un enfant de ${w} kg. Le sirop est dosé à ${c} mg/mL. Quel volume donner à chaque prise ?`,
        ans: clean(v),
        unit: 'mL',
        steps: [
          `Dose par jour : ${d} × ${w} = ${d * w} mg`,
          `Dose par prise : ${d * w} ÷ ${n} = ${f((d * w) / n)} mg`,
          `Volume : ${f((d * w) / n)} ÷ ${c} = ${f(v)} mL`,
        ],
      };
    },
    () => {
      let r, m, v;
      do {
        r = pick([40, 60, 80, 90, 100, 120, 150, 160, 200]);
        m = R(5, 20) * 15;
        v = (r * m) / 60;
      } while (!Number.isInteger(v));
      return {
        q: `Une perfusion de ${f(v)} mL doit passer en ${dur(m)}. Quel est le débit en mL/h ?`,
        ans: r,
        unit: 'mL/h',
        steps: [
          `Durée en heures : ${m} min ÷ 60 = ${f(m / 60)} h`,
          `Débit : ${f(v)} ÷ ${f(m / 60)} = ${f(r)} mL/h`,
          m % 60
            ? `Piège : ${dur(m)} = ${f(m / 60)} h, et non ${Math.floor(m / 60)},${m % 60} h.`
            : 'Pense à convertir la durée en heures avant de diviser.',
        ],
      };
    },
    () => {
      const b = pick([24, 36, 45, 48, 60, 75]),
        st = R(150, 900),
        k = Math.floor(st / b),
        rest = st - k * b;
      return {
        q: `Un service consomme ${b} boîtes de gants par semaine. Il en reste ${st} en stock. Pendant combien de semaines complètes le stock suffira-t-il ?`,
        ans: k,
        unit: 'semaines',
        steps: [
          `${st} ÷ ${b} ≈ ${f(Math.round((st / b) * 100) / 100)}`,
          `On ne garde que les semaines complètes : ${k} semaines`,
          `Il restera ${rest} boîte${rest > 1 ? 's' : ''}, pas assez pour une semaine de plus.`,
        ],
      };
    },
  ],
};

// Tire une question au hasard parmi les thèmes donnés.
export function gen(cats) {
  const cat = pick(cats);
  const o = pick(GEN[cat])();
  return { kind: 'num', tol: 0.001, ...o, cat };
}

// Série équilibrée : chaque thème revient autant que possible.
export function makeSeriesQuestions(count = 12) {
  const cats = Object.keys(CATS);
  let list = [];
  while (list.length < count) list.push(...shuffle(cats));
  return list.slice(0, count).map((c) => gen([c]));
}

// true = juste, false = faux, null = réponse illisible.
export function check(o, raw) {
  raw = String(raw || '').trim();
  if (!raw) return null;
  if (o.kind === 'time') {
    const m = raw.match(/(\d{1,2})\s*[hH:]\s*(\d{1,2})?/);
    if (!m) return null;
    return (Number(m[1]) * 60 + Number(m[2] || 0)) % 1440 === o.ans;
  }
  const s = raw
    .replace(/\s/g, '')
    .replace(',', '.')
    .replace(/[^\d.-]/g, '');
  const n = parseFloat(s);
  if (Number.isNaN(n)) return null;
  return Math.abs(n - o.ans) <= o.tol;
}

export const fmtAns = (o) => (o.kind === 'time' ? hm(o.ans) : `${f(o.ans)}${o.unit ? ' ' + o.unit : ''}`);
