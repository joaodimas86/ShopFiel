const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),origin='https://www.shopfiel.com.br';
const report=JSON.parse(read('reports/discover-audit.json'));
const sitemap=read('sitemap.xml'),index=read('blog/index.html');
const schemas=s=>[...s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>JSON.parse(m[1]));
const affiliate=s=>[...s.matchAll(/href="(https:\/\/(?:s\.shopee\.com\.br|meli\.la)[^"]+)"/g)].map(m=>m[1]).sort();
let baseline=true;try{cp.execFileSync('git',['cat-file','-e','e6a57de^{commit}'],{cwd:root,stdio:'ignore'});}catch{baseline=false;}
for(const p of report.pages){const s=read(p.page),url=origin+'/'+p.page;
 assert.ok(sitemap.includes('<loc>'+url+'</loc>'),p.page+' missing sitemap');
 assert.equal((s.match(/rel="canonical"/g)||[]).length,1);
 assert.ok(s.includes('rel="canonical" href="'+url+'"'));
 assert.ok(s.includes('index,follow,max-image-preview:large'));
 assert.ok(!/noindex|nofollow(?=[,\s]*["'])/.test(s.match(/<meta[^>]*name="robots"[^>]*>/)[0]));
 assert.equal((s.match(/class="sf-editorial-links"/g)||[]).length,1);
 if(p.page!=='blog/index.html'){
  assert.ok(index.includes('./'+path.basename(p.page)),p.page+' orphan');
  const a=schemas(s).find(x=>['NewsArticle','BlogPosting','Article'].includes(x['@type']));
  assert.ok(a&&a.datePublished&&a.author.url===origin+'/sobre-editorial.html');
  assert.ok(s.includes('datetime="'+a.datePublished+'"'));assert.equal(a.mainEntityOfPage['@id'],url);
  assert.ok(!a.dateModified||a.dateModified>=a.datePublished);
  assert.ok(a.image&&s.includes('property="og:image" content="'+a.image.url+'"'));
  assert.equal(a.image.width,p.cover.width);assert.equal(a.image.height,p.cover.height);
 }
 if(baseline){const before=cp.execFileSync('git',['show','e6a57de:'+p.page],{cwd:root,encoding:'utf8'});assert.deepEqual(affiliate(s),affiliate(before),p.page+' affiliate URLs changed');
  const old=schemas(before).find(x=>['NewsArticle','BlogPosting','Article'].includes(x['@type']));
  if(old)assert.equal(p.published,old.datePublished,p.page+' publication date changed');
 }
}
console.log(`OK: ${report.pages.length} blog pages; sitemap, canonical, robots, authors, dates, image metadata, internal links and affiliate destinations.`);
console.log('Image size and rights remain explicit audit findings, not claimed as passing.');
