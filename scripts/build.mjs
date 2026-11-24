import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const profile = JSON.parse(fs.readFileSync(path.join(root, 'content/profile.json'), 'utf8'));
const projects = JSON.parse(fs.readFileSync(path.join(root, 'content/projects.json'), 'utf8'));
const cv = JSON.parse(fs.readFileSync(path.join(root, 'content/cv.json'), 'utf8'));
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const month = new Date(profile.updated + 'T12:00:00Z').toLocaleDateString('en-US', {month:'long',year:'numeric',timeZone:'UTC'});
const cvMonth = new Date(cv.updated + 'T12:00:00Z').toLocaleDateString('en-US', {month:'long',year:'numeric',timeZone:'UTC'});
const write = (file, text) => { const target=path.join(root,file); fs.mkdirSync(path.dirname(target),{recursive:true}); fs.writeFileSync(target,text); };
const href = url => {
  if (!/^(https:\/\/|mailto:|\/?[A-Za-z0-9#_.-])/.test(url) || /[<>"']/.test(url)) throw new Error('Invalid URL: ' + url);
  return esc(url);
};
if (!Array.isArray(projects) || !projects.length) throw new Error('At least one project is required.');
if (new Set(projects.map(p=>p.id)).size !== projects.length) throw new Error('Duplicate project ID.');
for (const p of projects) if (!/^[a-z0-9-]+$/.test(p.id)) throw new Error('Use lowercase project IDs.');

function shell({title, description=profile.bio, body, prefix='', canonical='', current=''}) {
  const home = prefix || './';
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#f8f7f3"><link rel="canonical" href="${esc(profile.url+'/'+canonical)}">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(profile.url+'/'+canonical)}">
<link rel="icon" href="${prefix}assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="${prefix}assets/site.css">
</head><body><a class="skip" href="#main">Skip to content</a><div class="wrap">
<header class="nav"><a class="brand" href="${home}" aria-label="Hyogi Kim home"><span aria-hidden="true">hk</span>Hyogi Kim</a>
<nav class="navlinks" aria-label="Main navigation"><a href="${home}#about">About</a><a href="${home}#research">Research</a><a class="contact-nav" href="${home}#contact">Contact</a><a class="cvlink" href="${prefix}cv.html"${current==='cv'?' aria-current="page"':''}>CV ↗</a></nav></header>
${body}
<footer class="footer"><span>© ${profile.updated.slice(0,4)} ${esc(profile.name)} · ${esc(profile.affiliation)}</span><span>Updated ${esc(current==='cv' ? cvMonth : month)} &nbsp;·&nbsp; <a href="${href(profile.github)}">GitHub ↗</a></span></footer>
</div></body></html>\n`;
}

const artwork = `<svg class="memory-art" viewBox="0 0 270 155" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#bccab1" stroke-width="1"><path d="M32 32 126 77 35 123M32 77h94m0 0 107-42m-107 42h107m-107 0 107 43"/><circle cx="126" cy="77" r="39"/><circle cx="126" cy="77" r="53" stroke-dasharray="2 5"/></g><g fill="#f8f7f3" stroke="#829a76" stroke-width="1.3"><circle cx="32" cy="32" r="5"/><circle cx="32" cy="77" r="5"/><circle cx="35" cy="123" r="5"/><circle cx="233" cy="35" r="5"/><circle cx="233" cy="77" r="5"/><circle cx="233" cy="120" r="5"/></g><circle cx="126" cy="77" r="21" fill="#315947"/><path d="M118 77h16m-8-8v16" stroke="#eff1e9" stroke-width="1.3"/></svg>`;
const projectRows = projects.map((p,i)=>`<article class="project"><span class="project-num" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><div><div class="project-top"><h3><a href="projects/${p.id}.html">${esc(p.title)}</a></h3><span class="status">${esc(p.status)}</span></div><p>${esc(p.summary)}</p><div class="project-foot"><div class="tags">${p.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div><a class="read" href="projects/${p.id}.html" aria-label="Read about ${esc(p.title)}">Read project <span aria-hidden="true">↗</span></a></div></div></article>`).join('\n');
write('index.html',shell({title:profile.name+' — AI Memory & Continual Learning',body:`<main id="main"><section class="hero" aria-labelledby="name"><div><p class="eyebrow"><span class="dot" aria-hidden="true"></span>${esc(profile.affiliation)} · Computer science & AI</p><h1 id="name">${esc(profile.name)}</h1><p class="korean" lang="ko">${esc(profile.name_ko)}</p><p class="lead">${esc(profile.headline)}</p><p class="intro">${esc(profile.bio)}</p><div class="hero-links"><a href="mailto:${esc(profile.email)}">Email</a><a href="${href(profile.github)}">GitHub</a><a href="assets/Hyogi_Kim_CV.pdf">Download CV</a></div></div><aside class="interest-box" aria-label="Research interests"><h2>Research interests</h2>${artwork}${profile.interests.map((x,i)=>`<div class="interest-word"><span>${esc(x)}</span><span>0${i+1}</span></div>`).join('')}</aside></section><section class="section" id="research"><div class="section-heading"><h2>Selected work</h2><span class="note">Research & engineering</span></div><p class="research-intro">${esc(profile.focus)}</p>${projectRows}</section><section class="section" id="about"><div class="section-heading"><h2>Background</h2><span class="note">Learning through building</span></div><div class="about-grid"><div><h3>${esc(profile.affiliation)}</h3><p>${esc(profile.field)}</p><p>My work connects model design with implementation and deployment. I am interested in understanding both how learning systems represent experience and how those systems behave in practice.</p><a class="read arrow" href="cv.html">View curriculum vitae</a></div><div>${profile.skills.map(s=>`<div class="skill"><h3>${esc(s.label)}</h3><p>${esc(s.text)}</p></div>`).join('')}</div></div></section><section class="section contact" id="contact"><div><h2>Let’s talk research.</h2><p>I welcome conversations about AI memory, continual learning, and robot learning.</p></div><a class="button" href="mailto:${esc(profile.email)}">${esc(profile.email)} <span aria-hidden="true">↗</span></a></section></main>`}));

fs.mkdirSync(path.join(root,'projects'),{recursive:true});
const expected = new Set(projects.map(p=>p.id+'.html'));
for(const file of fs.readdirSync(path.join(root,'projects'))) if(file.endsWith('.html') && !expected.has(file)) fs.unlinkSync(path.join(root,'projects',file));
for(const p of projects) write('projects/'+p.id+'.html',shell({title:p.title+' — '+profile.name,description:p.summary,prefix:'../',canonical:'projects/'+p.id+'.html',body:`<main id="main" class="detail"><a class="back" href="../#research">← All selected work</a><div><span class="status">${esc(p.status)}</span><h1>${esc(p.title)}</h1><p class="subtitle">${esc(p.subtitle)}</p><div class="tags">${p.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div><p class="role"><strong>My role</strong> &nbsp; ${esc(p.role)}</p></div><p class="question">${esc(p.question)}</p>${p.sections.map(s=>`<section><h2>${esc(s.title)}</h2>${s.text?`<p>${esc(s.text)}</p>`:''}${s.items?`<ul>${s.items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}</section>`).join('')}${p.code?`<a class="button" href="${href(p.code)}">View code on GitHub ↗</a>`:''}<section><a class="read" href="../#research">← Back to selected work</a></section></main>`}));

write('cv.html',shell({title:'CV — '+profile.name,current:'cv',canonical:'cv.html',description:cv.interests,body:`<main id="main" class="detail"><a class="back" href="./">← Back to home</a><div class="cv-header"><div><p class="eyebrow">Curriculum vitae</p><h1>${esc(profile.name)}</h1><p class="subtitle">${esc(profile.affiliation)} · ${esc(profile.field)}</p><p><a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a> &nbsp;·&nbsp; <a href="${href(profile.github)}">GitHub</a></p></div><div class="cv-actions"><a class="button" href="assets/Hyogi_Kim_CV.pdf">Download PDF ↗</a><button class="button secondary" id="print-cv" type="button">Print</button></div></div><section class="cv-section"><h2>Education</h2><div class="cv-entry"><h3>${esc(cv.institution)}</h3><p>${esc(cv.education)} · ${esc(cv.location)}</p></div></section>
<section class="cv-section"><h2>Research interests</h2><p>${esc(cv.interests)}</p></section>
<section class="cv-section"><h2>Selected research and projects</h2>${cv.projects.map(p=>`<article class="cv-entry"><h3>${p.url ? `<a href="${href(p.url)}">${esc(p.title)}</a>` : esc(p.title)}</h3><p class="small">${esc(p.role)} · ${esc(p.date)}${p.report ? ` · <a href="${href(p.report)}">Technical report ↗</a>` : ''}</p><ul>${p.cv.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></article>`).join('')}</section>
<section class="cv-section"><h2>Patent and honors</h2><ul>${cv.honors.map(h=>`<li><strong>${esc(h.title)}</strong>${h.detail ? ' · '+esc(h.detail) : ''}${h.date ? ' · '+esc(h.date) : ''}</li>`).join('')}</ul></section>
<section class="cv-section"><h2>Technical skills</h2><p>${esc(cv.skills)}</p></section><p class="small">Updated ${esc(cvMonth)}</p></main><script src="assets/cv.js" defer></script>`}));
write('404.html',shell({title:'Page not found — '+profile.name,body:'<main id="main" class="error-page"><p class="eyebrow">404</p><h1>This page has moved.</h1><p><a href="/">Return to Hyogi Kim’s homepage →</a></p></main>'}));
write('robots.txt',`User-agent: *\nAllow: /\nSitemap: ${profile.url}/sitemap.xml\n`);
write('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['','cv.html',...projects.map(p=>'projects/'+p.id+'.html')].map(p=>`<url><loc>${esc(profile.url+'/'+p)}</loc><lastmod>${p==='cv.html' ? cv.updated : profile.updated}</lastmod></url>`).join('')}</urlset>\n`);

const tex = value => String(value).replace(/[&%$#_{}]/g,c=>'\\'+c).replace(/·/g,'$\\cdot$').replace(/[–—]/g,'--').replace(/[‘’]/g,"'").replace(/[“”]/g,'"');
write('cv/Hyogi_Kim_CV.tex',String.raw`\documentclass[10pt,a4paper]{article}
\usepackage[margin=18mm]{geometry}
\usepackage[T1]{fontenc}
\usepackage[utf8]{inputenc}
\usepackage{helvet}
\renewcommand{\familydefault}{\sfdefault}
\usepackage{xcolor}
\definecolor{accent}{HTML}{254F43}
\usepackage[colorlinks=true,urlcolor=accent]{hyperref}
\usepackage{enumitem}
\usepackage{titlesec}
\pagestyle{empty}
\setlength{\parindent}{0pt}
\setlength{\parskip}{4pt}
\titleformat{\section}{\large\color{accent}}{}{0em}{}[\titlerule]
\titlespacing*{\section}{0pt}{8pt}{4pt}
\setlist[itemize]{leftmargin=14pt,itemsep=1pt,topsep=2pt,parsep=0pt}
\begin{document}
{\Huge ${tex(profile.name)}}\hfill {\small Updated ${tex(cvMonth)}}\\[5pt]
${tex(profile.affiliation)} $\cdot$ ${tex(profile.field)}\\
\href{mailto:${profile.email}}{${tex(profile.email)}} $\cdot$ \href{${profile.github}}{GitHub} $\cdot$ \href{${profile.url}}{${tex(profile.url.replace('https://',''))}}
\section{Education}
\textbf{${tex(cv.institution)}}\\
${tex(cv.education)} \hfill ${tex(cv.location)}
\section{Research interests}
${tex(cv.interests)}
\section{Selected research and projects}
${cv.projects.map(p=>String.raw`\textbf{${tex(p.title)}}\hfill {\small ${tex(p.date)}}\\
{\small ${tex(p.role)}${p.report ? String.raw` $\cdot$ \href{${p.report}}{Technical report}` : ''}}
\begin{itemize}
${p.cv.map(x=>'\\item '+tex(x)).join('\n')}
\end{itemize}`).join('\n')}
\section{Patent and honors}
${cv.honors.map(h=>String.raw`\textbf{${tex(h.title)}}${h.detail ? ' $\\cdot$ '+tex(h.detail) : ''}${h.date ? ' \\hfill '+tex(h.date) : ''}\\`).join('\n')}
\section{Technical skills}
${tex(cv.skills)}
\end{document}
`);
console.log(`Built homepage, CV, ${projects.length} project pages, and PDF source.`);
