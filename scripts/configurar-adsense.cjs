// Run after generating blog pages: node scripts/configurar-adsense.cjs
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const client='ca-pub-8680178625613620';
const snippet=`<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}" crossorigin="anonymous"></script>`;
for(const file of fs.readdirSync(path.join(root,'blog')).filter(f=>f.endsWith('.html'))){
 const target=path.join(root,'blog',file);let html=fs.readFileSync(target,'utf8');
 if(!html.includes('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'))fs.writeFileSync(target,html.replace('</head>',snippet+'</head>'));
}
const home=path.join(root,'index.html');let html=fs.readFileSync(home,'utf8');
if(!html.includes('name="google-adsense-account"'))fs.writeFileSync(home,html.replace('</head>',`<meta name="google-adsense-account" content="${client}"></head>`));
fs.writeFileSync(path.join(root,'ads.txt'),'google.com, pub-8680178625613620, DIRECT, f08c47fec0942fa0\n');
