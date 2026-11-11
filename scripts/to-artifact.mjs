// Transforme le build monofichier (dist-artifact/index.html) en page publiable comme artifact
// claude.ai : la plateforme ajoute elle-même <!doctype>, <html>, <head> et <body>.
import { readFileSync, writeFileSync } from 'node:fs';

const html = readFileSync('dist-artifact/index.html', 'utf8');
const pick = (re) => [...html.matchAll(re)].map((m) => m[0]).join('\n');

const title = pick(/<title>[\s\S]*?<\/title>/g);
const links = pick(/<link[^>]*fonts\.(googleapis|gstatic)\.com[^>]*>/g);
const styles = pick(/<style[^>]*>[\s\S]*?<\/style>/g);
const scripts = pick(/<script[^>]*>[\s\S]*?<\/script>/g);

const out = [title, links, styles, '<div id="root"></div>', scripts].join('\n');
writeFileSync('artifact.html', out);
console.log(`artifact.html écrit (${Math.round(out.length / 1024)} Ko)`);
