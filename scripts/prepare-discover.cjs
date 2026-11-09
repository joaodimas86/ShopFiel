// Preserve editorial text, image content, publication dates and affiliate destinations.
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const root=path.resolve(__dirname,'..'),origin='https://www.shopfiel.com.br';
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const write=(p,s)=>fs.writeFileSync(path.join(root,p),s.trimEnd()+'\n');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plain=s=>s.replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').trim();
function attrs(tag){return Object.fromEntries([...tag.matchAll(/([\w:-]+)=["']([^"']*)["']/g)].map(m=>[m[1],m[2]]));}
function meta(s,key,value,property=false){const name=property?'property':'name';s=s.replace(new RegExp('<meta\\s+[^>]*'+name+'=["\']'+key+'["\'][^>]*>','gi'),'');return s.replace('</head>',`<meta ${name}="${key}" content="${esc(value)}"></head>`);}
const nav='<nav class="sf-editorial-links" aria-label="Transparência editorial"><a href="../sobre-editorial.html">Sobre e autoria</a><a href="../politica-editorial.html">Política editorial</a><a href="../contato.html">Contato e correções</a><a href="../transparencia.html">Afiliados e imagens</a></nav>';
const pages={
 'sobre-editorial.html':['Sobre a Arquibancada Fiel e sua autoria','<p>A Arquibancada Fiel é o blog publicado pela Shop Fiel, uma vitrine independente de produtos e conteúdo para torcedores do Corinthians. Não tem vínculo oficial com o Sport Club Corinthians Paulista.</p><h2>Quem assina os textos</h2><p>As matérias assinadas “Shop Fiel” têm autoria institucional da publicação. Essa assinatura não identifica um jornalista individual. Notícias, análises de torcedor e guias de compra devem ser identificados conforme sua natureza.</p><p>O site combina conteúdo editorial e uma vitrine de afiliados. Consulte nossa política de transparência para entender as indicações comerciais.</p>'],
 'politica-editorial.html':['Política editorial','<p>Esta é a política adotada para o blog da Shop Fiel. A existência desta página não certifica retrospectivamente a apuração de cada matéria antiga.</p><h2>Apuração e fontes</h2><p>Notícias devem citar fontes acessíveis e, sempre que possível, documentos e canais oficiais. Rumores, previsões e opiniões devem ser apresentados como tais. Uma manchete ou um resumo em buscador não substitui a leitura e conferência da fonte. Não devemos reproduzir integralmente textos de outros veículos.</p><h2>Datas e atualizações</h2><p>A data de publicação identifica a edição original. Atualizações que mudem informações devem trazer data e explicação da mudança; ajustes de apresentação não transformam uma notícia antiga em nova. Quando o horário original não estiver documentado, informamos apenas a data.</p><h2>Correções</h2><p>Para apontar um erro, envie o endereço da matéria, o trecho questionado e uma fonte verificável pelo canal indicado em Contato. Correções factuais devem ser registradas na própria matéria. O recebimento de uma solicitação não significa que a informação foi confirmada.</p><h2>Automação e revisão</h2><p>Ferramentas de automação podem auxiliar na organização de pautas e na preparação técnica. Elas não substituem a verificação humana de fatos, autoria, datas e direitos de imagem antes de uma publicação.</p>'],
 'contato.html':['Contato e correções','<p>O canal público divulgado pela Shop Fiel é o perfil <a href="https://www.instagram.com/shopfiel/" rel="noopener noreferrer" target="_blank">@shopfiel no Instagram</a>. Use as mensagens desse perfil para assuntos editoriais, correções e solicitações relacionadas a imagens.</p><p>Informe a URL da página, o trecho ou arquivo envolvido e, quando disponível, documentos ou links que ajudem a verificar a solicitação. Não envie dados pessoais de pagamento.</p><p>Compras, pagamentos, entregas e devoluções são tratados diretamente com o vendedor e o marketplace onde a compra foi concluída.</p>'],
 'transparencia.html':['Transparência: afiliados e imagens','<h2>Como a Shop Fiel funciona</h2><p>A Shop Fiel é uma vitrine independente de afiliados. Links de produtos podem gerar comissão em compras elegíveis. A compra ocorre no marketplace; a Shop Fiel não recebe o pagamento, não envia os produtos e não processa devoluções.</p><p>Preços, estoque, frete, autenticidade e condições devem ser confirmados no anúncio. Valores de referência datados não representam ofertas em tempo real. A indicação de um produto não comprova sua autenticidade ou licenciamento.</p><h2>Imagens e direitos</h2><p>As fotos e artes atuais foram mantidas. A Shop Fiel ainda não documentou, nesta revisão, a autorização de reutilização de todas as imagens do blog. Uma imagem acessível na internet não constitui, por si só, comprovação de licença. Citar a fonte ou o fotógrafo também não substitui a autorização necessária.</p><p>A política editorial exige registrar origem, autor, licença ou autorização e eventuais restrições antes de novas publicações. Titulares podem solicitar análise, crédito, correção ou retirada pelo canal de contato. A resolução de uma solicitação depende da avaliação do material e da documentação.</p>']
};
for(const [file,[title,body]] of Object.entries(pages))write(file,`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="index,follow,max-image-preview:large"><title>${title} | Shop Fiel</title><meta name="description" content="${title}: informações da Shop Fiel e do blog Arquibancada Fiel."><link rel="canonical" href="${origin}/${file}"><link rel="stylesheet" href="./style.css"><link rel="stylesheet" href="./blog/blog.css"></head><body class="bl-page"><main class="sf-policy"><a href="./blog/index.html">← Arquibancada Fiel</a><h1>${title}</h1>${body}<p>Política publicada em <time datetime="2026-11-09">9 de novembro de 2026</time>.</p>${nav.replaceAll('../','./')}</main></body></html>`);
async function run(){
 const sharp=require('sharp');const report=[];fs.mkdirSync(path.join(root,'assets/blog/optimized'),{recursive:true});
 const imageCache=new Map();
 async function image(src,base){
  const u=new URL(src.replaceAll('&amp;','&'),base);let rel;
  if(u.origin===origin)rel=decodeURIComponent(u.pathname.slice(1));
  else if(u.hostname==='raw.githubusercontent.com'&&u.pathname.startsWith('/joaodimas86/ShopFiel/main/'))rel=decodeURIComponent(u.pathname.slice('/joaodimas86/ShopFiel/main/'.length));
  else return null;
  const local=path.resolve(root,rel);if(!local.startsWith(root+path.sep)||!fs.existsSync(local)||/\.svg$/i.test(rel))return null;
  if(imageCache.has(rel))return imageCache.get(rel);
  const m=await sharp(local).metadata();let optimized=rel;
  // No enlargement, cropping or content changes. Keep originals in the repository.
  if(!rel.startsWith('assets/blog/optimized/')){
   optimized='assets/blog/optimized/'+createHash('sha256').update(rel).digest('hex').slice(0,14)+'.webp';
   await sharp(local,{failOn:"none"}).rotate().resize({width:1600,withoutEnlargement:true}).webp({quality:84}).toFile(path.join(root,optimized));
  }
  const o=await sharp(path.join(root,optimized)).metadata();
  const result={original:rel,path:optimized,width:o.width,height:o.height,originalWidth:m.width,bytes:fs.statSync(path.join(root,optimized)).size,rights:'Não comprovados nesta auditoria'};imageCache.set(rel,result);return result;
 }
 for(const file of fs.readdirSync(path.join(root,'blog')).filter(f=>f.endsWith('.html'))){
  const canonical=origin+'/blog/'+file;let s=read('blog/'+file);const article=file!=='index.html';
  const h1=plain((s.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)||[])[1]||'Arquibancada Fiel');
  const schemas=[];s=s.replace(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi,(tag,raw)=>{const data=JSON.parse(raw);schemas.push(...(Array.isArray(data)?data:[data]));return '';});
  const a=schemas.find(x=>['NewsArticle','BlogPosting','Article'].includes(x['@type']));
  const published=a?.datePublished||(s.match(/<time[^>]*datetime="([^"]+)"/)||[])[1];
  s=s.replace(/<link\s+rel="canonical"[^>]*>/gi,'').replace('</head>',`<link rel="canonical" href="${canonical}"></head>`);
  s=meta(s,'robots','index,follow,max-image-preview:large');s=meta(s,'og:url',canonical,true);
  let cover=null;let bodyStart=s.indexOf('<body');let head=s.slice(0,bodyStart),body=s.slice(bodyStart),n=0;
  const tags=[...body.matchAll(/<img\b[^>]*>/gi)];
  for(const match of tags){const at=attrs(match[0]);if(!at.src||/logo|brand|favicon/i.test(at.src+' '+(at.class||'')))continue;
   const im=await image(at.src,canonical);if(!im)continue;if(!cover)cover=im;
   let tag=match[0].replace(/\s(?:src|width|height|loading|decoding|fetchpriority)="[^"]*"/g,'');
   tag=tag.replace(/>$/,` src="../${esc(im.path)}" width="${im.width}" height="${im.height}" decoding="async" loading="${n===0?'eager':'lazy'}"${n===0?' fetchpriority="high"':''}>`);body=body.replace(match[0],tag);n++;
  }
  s=head+body;
  const oldImage=attrs((head.match(/<meta[^>]*property="og:image"[^>]*>/)||[])[0]||'').content;
  if(article&&oldImage)cover=await image(oldImage,canonical)||cover;
  if(file==='presentes-para-corinthianos.html'&&!cover){
   const catalog=JSON.parse(read('data/shopee-links-pendentes.json')).links;
   const product=catalog.find(p=>p.id==='SHP-009');
   cover=await image('../'+product.images[0],canonical);
   s=s.replace(/(<h1[^>]*>[\s\S]*?<\/h1>)/i,'$1'+`<figure><img src="../${cover.path}" width="${cover.width}" height="${cover.height}" alt="Kit de churrasco do catálogo, exemplo de presente para corinthianos" decoding="async" loading="eager" fetchpriority="high"><figcaption>Imagem de produto do catálogo; confirme itens incluídos e condições no anúncio.</figcaption></figure>`);
  }
  if(cover){const url=origin+'/'+cover.path;s=meta(s,'og:image',url,true);s=meta(s,'og:image:width',cover.width,true);s=meta(s,'og:image:height',cover.height,true);s=meta(s,'og:image:alt',h1,true);s=meta(s,'twitter:card','summary_large_image');s=meta(s,'twitter:image',url);}
  if(article){
   if(!published)throw Error('Publication date missing: '+file);
   // Prefer documented day precision over an unsupported noon timestamp.
   s=meta(s,'article:published_time',published,true);
   const author={ '@type':'Organization',name:'Shop Fiel',url:origin+'/sobre-editorial.html'};
   const schema={...(a||{}),'@context':'https://schema.org','@type':a?.['@type']||'BlogPosting','@id':canonical+'#artigo',headline:h1,mainEntityOfPage:{'@type':'WebPage','@id':canonical},url:canonical,inLanguage:'pt-BR',datePublished:published,author,publisher:{'@type':'Organization',name:'Shop Fiel',url:origin+'/'},isAccessibleForFree:true};
   if(cover)schema.image={ '@type':'ImageObject',url:origin+'/'+cover.path,width:cover.width,height:cover.height};
   const description=attrs((s.match(/<meta[^>]*name="description"[^>]*>/)||[])[0]||'').content;if(description)schema.description=description;
   const i=schemas.indexOf(a);if(i>=0)schemas[i]=schema;else schemas.push(schema);
   // A consistent institutional byline on pages with and without an existing byline.
   const byline=`<p class="sf-editorial-byline">Por <a rel="author" href="../sobre-editorial.html">Shop Fiel</a> · Publicado em <time datetime="${esc(published)}">${esc(published.slice(0,10).split('-').reverse().join('/'))}</time></p>`;
   s=s.replace(/<p class="sf-editorial-byline">[\s\S]*?<\/p>/g,'');
   s=s.replace(/(<h1[^>]*>[\s\S]*?<\/h1>)/i,'$1'+byline);
   s=s.replace(/<p class="(?:bl-byline|sf-byline)"[^>]*>[\s\S]*?<\/p>/gi,'');
  }
  s=s.replace(/<nav class="sf-editorial-links"[\s\S]*?<\/nav>/g,'').replace('</body>',nav+'</body>');
  if(schemas.length)s=s.replace('</head>','<script type="application/ld+json">'+JSON.stringify(schemas).replace(/</g,'\\u003c')+'</script></head>');
  write('blog/'+file,s);report.push({page:'blog/'+file,published:published||null,cover,largeImage:!!cover&&cover.width>=1200,rightsVerified:false});
 }
 let sitemap=read('sitemap.xml');for(const file of [...Object.keys(pages),...report.map(p=>p.page)]){const url=origin+'/'+file;if(!sitemap.includes('<loc>'+url+'</loc>'))sitemap=sitemap.replace('</urlset>',`  <url><loc>${url}</loc></url>\n</urlset>`);}write('sitemap.xml',sitemap);
 let index=read('blog/index.html').replace(/<section id="sf-blog-archive"[\s\S]*?<\/section>/g,'');
 const missing=report.filter(p=>p.page!=='blog/index.html'&&!index.includes('./'+path.basename(p.page)));
 if(missing.length)index=index.replace('</main>','<section id="sf-blog-archive" class="wrap" style="padding:32px 20px"><h2>Mais matérias da Arquibancada Fiel</h2><ul>'+missing.map(p=>{const name=plain(read(p.page).match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)[1]);return `<li><a href="./${path.basename(p.page)}">${esc(name)}</a></li>`;}).join('')+'</ul></section></main>');
 write('blog/index.html',index);
 fs.mkdirSync(path.join(root,'reports'),{recursive:true});write('reports/discover-audit.json',JSON.stringify({auditedOn:'2026-11-09',scope:'Technical audit; Google index status and image rights not verified',pages:report},null,2));
 console.log(JSON.stringify({pages:report.length,largeImages:report.filter(p=>p.largeImage).length,smallImages:report.filter(p=>!p.largeImage).map(p=>p.page),rightsVerified:0}));
}
run().catch(e=>{console.error(e);process.exit(1)});
