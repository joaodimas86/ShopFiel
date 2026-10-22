import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const origin='https://www.shopfiel.com.br';
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const urls=[...read('sitemap.xml').matchAll(/<loc>(.*?)<\/loc>/g)].map(x=>x[1]);
assert.equal(urls.length,new Set(urls).size);
let links=0,images=0,products=0;
for(const url of urls){
 assert.ok(url.startsWith(origin+'/'));
 const rel=new URL(url).pathname.slice(1),file=rel.endsWith('/')||!rel?rel+'index.html':rel;
 const html=read(file);
 assert.ok(!/noindex/.test(html),file+' bloqueado');
 assert.equal((html.match(/<h1[\s>]/g)||[]).length,1,file+' precisa de um H1');
 assert.ok(html.includes('rel="canonical" href="'+url+'"'),file+' canonical');
 assert.ok(!html.includes('joaodimas86.github.io'),file+' domínio antigo');
 const base=html.includes('<base href="../">')?origin+'/':url;
 for(const m of html.matchAll(/(?:href|src)="([^"<>]+)"/g)){
  const href=m[1].replaceAll('&amp;','&');
  if(href.startsWith('#'))continue;
  const target=new URL(href,base);
  if(target.origin!==origin)continue;
  const name=decodeURIComponent(target.pathname.slice(1));
  const destination=path.join(root,name.endsWith('/')||!name?name+'index.html':name);
  assert.ok(fs.existsSync(destination),file+' link ausente '+href);links++;
 }
 for(const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){
  const data=JSON.parse(m[1]);
  if(Array.isArray(data))for(const item of data)if(item['@type']==='Product'){
   products++;assert.equal(item.url,url);assert.ok(item.image.length);assert.ok(!item.offers,'Preço histórico não deve virar oferta atual');
  }
 }
 if(file.startsWith('produtos/')){
  assert.ok(/fetchpriority="high" loading="eager"/.test(html));
  assert.ok(/width="\d+" height="\d+"/.test(html));
  for(const m of html.matchAll(/<a[^>]+href="https:\/\/(?:s\.shopee\.com\.br|meli\.la)[^"]*"[^>]*>/g))assert.ok(m[0].includes('sponsored nofollow'));
  images+=(html.match(/<img /g)||[]).length;
 }
}
assert.equal(products,34);
assert.ok(read('robots.txt').includes(origin+'/sitemap.xml'));
console.log('OK: '+urls.length+' URLs, '+products+' produtos, '+links+' referências locais e '+images+' elementos de imagem nas fichas.');
