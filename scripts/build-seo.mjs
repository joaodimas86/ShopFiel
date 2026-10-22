import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const write=(p,s)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),s.trimEnd()+'\n');};
const origin='https://www.shopfiel.com.br';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const json=v=>JSON.stringify(v).replace(/</g,'\\u003c');
const valid=url=>/^https:\/\/(?:s\.shopee\.com\.br\/[A-Za-z0-9]+(?:\?share_channel_code=1)?|meli\.la\/[A-Za-z0-9]+)$/.test(url||'');
const products=['data/shopee-links-pendentes.json','data/mercado-livre-links-pendentes.json'].flatMap(p=>JSON.parse(read(p)).links).filter(p=>p.status==='identified'&&p.product_name&&valid(p.url));
const groups={
 'camisas-atuais':{slug:'camisas-corinthians',name:'Camisas do Corinthians',intro:'Explore camisas do Corinthians em diferentes cores e modelos. Compare fotos e características e confira medidas, procedência e condições no marketplace antes de comprar.'},
 historicas:{slug:'camisas-retro-corinthians',name:'Camisas retrô do Corinthians',intro:'Encontre camisas retrô do Corinthians e modelos inspirados em momentos da história do Timão. Confira a edição anunciada, os detalhes da peça e a tabela de medidas de cada vendedor.'},
 casuais:{slug:'roupas-corinthians',name:'Roupas do Corinthians',intro:'Camisetas, polos e roupas casuais do Corinthians para o dia a dia. Explore os modelos, compare cores e confira a composição e as medidas no anúncio.'},
 souvenirs:{slug:'presentes-corinthianos',name:'Presentes para corinthianos',intro:'Ideias de presentes para corinthianos: copos, acessórios, decoração e itens para casa. Veja os detalhes de cada produto e confirme dimensões e itens incluídos no marketplace.'}
};
function productHref(p){return './produtos/'+p.product_name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'-'+p.id.toLowerCase()+'.html';}
const categoryHref=id=>'./'+groups[id].slug+'/';
const url=p=>origin+'/'+p.replace(/^\.\//,'');
function dimensions(src){const b=fs.readFileSync(path.join(root,src));if(b.toString('ascii',0,4)!=='RIFF'||b.toString('ascii',8,12)!=='WEBP')throw Error('Imagem inválida: '+src);for(let o=12;o+8<b.length;){const type=b.toString('ascii',o,o+4),n=b.readUInt32LE(o+4),d=o+8;if(type==='VP8X')return [1+b.readUIntLE(d+4,3),1+b.readUIntLE(d+7,3)];if(type==='VP8 ')return [b.readUInt16LE(d+6)&16383,b.readUInt16LE(d+8)&16383];if(type==='VP8L'){const v=b.readUInt32LE(d+1);return [(v&16383)+1,((v>>>14)&16383)+1];}o=d+n+(n%2);}throw Error('Dimensões ausentes: '+src);}
function image(p,main=false){const src=p.images[0],[w,h]=dimensions(src);return '<div class="shop-visual shop-visual-photo"><img class="shop-product-image" src="'+esc(src)+'" alt="'+esc(p.product_name)+' — vista principal" width="'+w+'" height="'+h+'" '+(main?'fetchpriority="high" loading="eager"':'loading="lazy"')+' decoding="async"></div>';}
function card(p){return '<a class="shop-card shop-card-link" href="'+esc(productHref(p))+'"><div class="shop-card-media">'+image(p)+'</div><div class="shop-card-body"><h3 class="shop-card-title">'+esc(p.product_name)+'</h3><span class="shop-card-action">VER DETALHES ↗</span></div></a>';}
function normalized(s){return s.replaceAll('https://joaodimas86.github.io/ShopFiel',origin).replace(/https:\/\/shopfiel\.com\.br/g,origin).replace(/href="(?:\.\/)?index\.html\?categoria=([a-z-]+)#mantos"/g,(m,id)=>'href="'+categoryHref(id)+'"').replace(/href="#mantos" data-category-target="([a-z-]+)"/g,(m,id)=>'href="'+categoryHref(id)+'" data-category-target="'+id+'"');}
let home=normalized(read('index.html'));
home=home.replace(/<div id="featured-products" class="featured-grid" aria-live="polite">[\s\S]*?<\/div>\s*<p class="catalog-disclaimer"/, '<div id="featured-products" class="featured-grid" aria-live="polite">'+products.filter(p=>p.category_id==='casuais').map(card).join('')+'</div>\n  <p class="catalog-disclaimer"');
home=home.replace(/\.\/produto\.html\?id=((?:SHP|ML)-\d{3})/g,(m,id)=>productHref(products.find(p=>p.id===id)));
write('index.html',home);
for(const f of fs.readdirSync(path.join(root,'blog')).filter(p=>p.endsWith('.html'))){
 let article=normalized(read('blog/'+f));
 if(!article.includes('id="seo-collections"'))article=article.replace('<footer','<nav id="seo-collections" class="wrap pd-breadcrumb" aria-label="Explore produtos do Corinthians">'+Object.values(groups).map(g=>'<a href="../'+g.slug+'/">'+esc(g.name)+'</a>').join(' · ')+'</nav><footer');
 write('blog/'+f,article);
}
const template=read('produto.html');
const header=template.match(/<header[\s\S]*?<\/header>/)[0].replace(/href="\.\/index\.html#(?:catalogo|mantos)"/g,'href="./camisas-corinthians/"');
const footer=template.match(/<footer[\s\S]*?<\/footer>/)[0];
function shell(title,description,canonical,body,schema=[]){return '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base href="../"><meta name="robots" content="index,follow,max-image-preview:large"><title>'+esc(title)+'</title><meta name="description" content="'+esc(description)+'"><link rel="canonical" href="'+esc(canonical)+'"><meta property="og:type" content="website"><meta property="og:title" content="'+esc(title)+'"><meta property="og:description" content="'+esc(description)+'"><meta property="og:url" content="'+esc(canonical)+'"><link rel="stylesheet" href="./style.css?v=seo1"><link rel="stylesheet" href="./produto.css?v=seo1"><link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">'+(schema.length?'<script type="application/ld+json">'+json(schema)+'</script>':'')+'</head><body class="pd-page">'+header+'<main class="pd-main"><div class="wrap">'+body+'</div></main>'+footer+'</body></html>';}
function crumbs(items){return {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:items.map(([name,item],i)=>({'@type':'ListItem',position:i+1,name,item}))};}
function offerLink(o){return '<a class="pd-buy-cta" href="'+esc(o.url)+'" target="_blank" rel="sponsored nofollow noopener noreferrer">VER OFERTA '+(o.marketplace==='mercado_livre'?'NO MERCADO LIVRE':'NA SHOPEE')+' ↗</a>';}
for(const p of products){
 const canonical=url(productHref(p)),g=groups[p.category_id];
 const description=p.product_name+'. Veja fotos, detalhes e informações para escolher. Confira preço e disponibilidade no marketplace.';
 const facts=[...(p.highlights||[])];
 if(p.sizes_observed?.length)facts.push('Tamanhos observados no anúncio: '+p.sizes_observed.join(', ')+'. Confirme a tabela de medidas e a disponibilidade atual.');
 if(/oficial/i.test(p.product_name))facts.push('A expressão “oficial” faz parte da identificação do anúncio. A Shop Fiel não realizou autenticação independente; confira etiqueta e procedência com o vendedor.');
 const offers=[p,...(p.additional_offers||[])].filter(o=>valid(o.url)&&!['pending_new_link','out_of_stock'].includes(o.availability));
 const buy=['pending_new_link','out_of_stock'].includes(p.availability)?'<p class="pd-stock-note">'+(p.availability==='out_of_stock'?'Esgotado na última conferência.':'Link de compra em atualização.')+'</p>':offers.map(offerLink).join('');
 const snapshot=p.price_snapshot,amount=snapshot&&(snapshot.amount_brl??snapshot.pix_brl);
 const price=typeof amount==='number'&&snapshot.observed_on?'<p>Preço de referência: <strong>'+amount.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})+'</strong>, observado em '+esc(snapshot.observed_on.split('-').reverse().join('/'))+'. Não é preço ao vivo; confira condições, frete e disponibilidade no anúncio.</p>':'<p>Consulte preço e disponibilidade atuais no marketplace.</p>';
 const thumbs=p.images.map((src,i)=>'<button class="pd-thumb'+(i===0?' is-active':'')+'" type="button" data-gallery-src="'+esc(src)+'" aria-label="Ver foto '+(i+1)+' de '+p.images.length+'" aria-pressed="'+(i===0)+'"><img src="'+esc(src)+'" alt="" loading="lazy" width="96" height="96"></button>').join('');
 const body='<nav class="pd-breadcrumb" aria-label="Caminho do produto"><a href="./">Shop Fiel</a> / <a href="'+categoryHref(p.category_id)+'">'+esc(g.name)+'</a></nav><section class="pd-product" aria-labelledby="pd-title"><div><div class="pd-image" id="pd-image">'+image(p,true)+'</div><div class="pd-thumbnails">'+thumbs+'</div></div><div class="pd-purchase"><h1 id="pd-title">'+esc(p.product_name)+'</h1><p>'+esc(p.description)+'</p>'+price+buy+'<div class="pd-purchase-note"><strong>Compra concluída no marketplace indicado</strong><p>A Shop Fiel pode receber comissão pela indicação. Confirme medidas, material, autenticidade, preço, frete e estoque com o vendedor.</p></div></div></section><section class="pd-details"><div><h2>Detalhes do produto</h2><ul>'+facts.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul><p>Fotos ambientadas podem ilustrar sugestões de uso. Confira no anúncio quais itens estão incluídos.</p></div><aside><h2>Antes de comprar</h2><p>Compare medidas, cores e materiais. Confira as avaliações do vendedor e as condições atuais de entrega e devolução.</p><a href="'+categoryHref(p.category_id)+'">Ver '+esc(g.name.toLowerCase())+' ↗</a></aside></section><section><h2>Produtos relacionados</h2><div class="featured-grid">'+products.filter(x=>x.id!==p.id&&x.category_id===p.category_id).slice(0,3).map(card).join('')+'</div></section><script defer src="./gallery.js"></script>';
 const schema=[{'@context':'https://schema.org','@type':'Product','@id':canonical+'#produto',name:p.product_name,description:p.description,image:p.images.map(url),sku:p.id,url:canonical},crumbs([['Shop Fiel',origin+'/'],[g.name,url(categoryHref(p.category_id))],[p.product_name,canonical]])];
 write(productHref(p).slice(2),shell(p.product_name+' | Shop Fiel',description,canonical,body,schema));
}
for(const [id,g] of Object.entries(groups)){
 const items=products.filter(p=>p.category_id===id),canonical=url(categoryHref(id));
 const body='<nav class="pd-breadcrumb" aria-label="Navegação"><a href="./">Shop Fiel</a> / '+esc(g.name)+'</nav><h1>'+esc(g.name)+'</h1><p>'+esc(g.intro)+'</p><nav class="pd-breadcrumb" aria-label="Outras categorias">'+Object.entries(groups).map(([key,x])=>'<a href="'+categoryHref(key)+'">'+esc(x.name)+'</a>').join(' · ')+'</nav><p>'+items.length+' produtos selecionados. A compra é concluída no marketplace; podemos receber comissão pela indicação.</p><div class="featured-grid">'+items.map(card).join('')+'</div><p><a href="./blog/como-escolher-tamanho-camisa-de-futebol.html">Guia de tamanhos</a> · <a href="./blog/camisas-retro-corinthians.html">Guia de camisas retrô</a> · <a href="./blog/presentes-para-corinthianos.html">Ideias de presentes</a></p>';
 write(g.slug+'/index.html',shell(g.name+' | Shop Fiel',g.intro,canonical,body,[crumbs([['Shop Fiel',origin+'/'],[g.name,canonical]]),{'@context':'https://schema.org','@type':'CollectionPage',name:g.name,url:canonical,mainEntity:{'@type':'ItemList',itemListElement:items.map((p,i)=>({'@type':'ListItem',position:i+1,url:url(productHref(p)),name:p.product_name}))}}]));
}
write('robots.txt','User-agent: *\nAllow: /\n\nSitemap: '+origin+'/sitemap.xml');
const urls=[origin+'/',...fs.readdirSync(path.join(root,'blog')).filter(p=>p.endsWith('.html')).map(p=>origin+'/blog/'+p),...Object.keys(groups).map(id=>url(categoryHref(id))),...products.map(p=>url(productHref(p)))];
write('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(u=>'  <url><loc>'+esc(u)+'</loc></url>').join('\n')+'\n</urlset>');
write('data/seo-urls.json',JSON.stringify(Object.fromEntries(products.map(p=>[p.id,productHref(p)])),null,2));
console.log('Geradas '+products.length+' fichas, '+Object.keys(groups).length+' categorias e '+urls.length+' URLs no sitemap.');
