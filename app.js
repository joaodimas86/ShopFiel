"use strict";
/* Fiel Shop — vitrine estática de afiliados. Sem checkout próprio. */
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const make = (tag,klass,value) => {
  const element=document.createElement(tag);
  if(klass)element.className=klass;
  if(value!==undefined)element.textContent=value;
  return element;
};
const affiliateUrl = url => typeof url==="string"&&/^https:\/\/s\.shopee\.com\.br\/[A-Za-z0-9]+$/.test(url);
const money = n => Number(n).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const searchTerm = text => String(text||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const isIdentified = product => product&&product.status==="identified"&&product.product_name&&affiliateUrl(product.url);
const unavailable = product => product.availability==="out_of_stock";
const state={items:[],season:[],category:"casuais",query:"",sort:"featured",loaded:false};
const collections={
 "camisas-atuais":{kicker:"LANÇAMENTOS · TEMPORADA 2026/27",title:"CAMISAS",accent:"ATUAIS.",description:"Modelos da temporada para conhecer. As ofertas ainda estão em conferência; esta coleção não tem links de compra ativos."},
 "casuais":{kicker:"ROUPAS PARA O DIA A DIA",title:"MODA",accent:"CASUAL.",description:"Camisetas, polos e moletons para levar o Timão para qualquer lugar."},
 "historicas":{kicker:"TRADIÇÃO QUE NÃO ACABA",title:"CAMISAS",accent:"HISTÓRICAS.",description:"Modelos retrô e homenagens às temporadas e momentos que marcaram a Fiel."},
 "souvenirs":{kicker:"PRESENTES PARA A FIEL",title:"SOUVENIRS",accent:"& ACESSÓRIOS.",description:"Copos, capinhas, bandeiras, itens para casa e presentes para torcedores."}
};

function productVisual(product,season){
 const name=searchTerm(product.product_name||product.name||"");
 const category=season?"camisas-atuais":product.category_id;
 let kind="shirt";
 if(/moletom|casaco|blusa de frio/.test(name))kind="hoodie";
 else if(/polo/.test(name))kind="polo";
 else if(/copo|taca|taça|caneca/.test(name))kind="cup";
 else if(/capa|capinha|celular/.test(name))kind="phone";
 else if(/bandeira/.test(name))kind="flag";
 else if(/chinelo/.test(name))kind="slide";
 else if(/cobertor|manta/.test(name))kind="blanket";
 else if(/churrasco|faca|tabua|tábua|garfo/.test(name))kind="knife";
 const art=make("div","shop-visual");
 art.setAttribute("role","img");
 art.setAttribute("aria-label","Ilustração genérica; não é fotografia do produto.");
 art.dataset.kind=kind;
 const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
 svg.setAttribute("viewBox","0 0 260 285");
 svg.setAttribute("aria-hidden","true");
 const shapes={
 shirt:'<path d="M69 73 104 52l16 6h20l16-6 35 21 32 41-29 26-19-17v115H85V123l-19 17-29-26Z" fill="#eaeae8" stroke="#333" stroke-width="3"/><path d="M112 57q18 25 36 0" fill="none" stroke="#333" stroke-width="4"/><path d="M92 85v143m19-158v158m38-158v158m20-143v143" stroke="#222" stroke-opacity=".27" stroke-width="10"/>',
 polo:'<path d="M72 75l32-23 18 8h16l18-8 32 23 29 42-29 22-16-15v114H88V124l-16 15-29-22Z" fill="#ededeb" stroke="#222" stroke-width="3"/><path d="m104 54 25 32 27-32-13 42-13-10-14 10Z" fill="#333"/><path d="M130 86v50" stroke="#222" stroke-width="3"/><circle cx="135" cy="109" r="2.5" fill="#222"/>',
 hoodie:'<path d="M86 74 103 45h55l18 29 39 37-26 32-20-18v115H91V125l-20 18-26-32Z" fill="#dededb" stroke="#222" stroke-width="3"/><path d="M103 45c-7 29 5 50 27 64 23-14 36-36 28-64-9-12-43-12-55 0Z" fill="#888" stroke="#222" stroke-width="3"/><path d="M112 174h36l9 44h-54Z" fill="none" stroke="#222" stroke-width="3"/>',
 cup:'<path d="M100 54h66l-10 158c-2 30-44 30-46 0Z" fill="#eee" stroke="#222" stroke-width="4"/><path d="M100 79h66" stroke="#777" stroke-width="7"/><path d="M112 194h42m-25 42v17m-35 4h71" stroke="#222" stroke-width="4" fill="none"/><path d="M114 108h38" stroke="#222" stroke-width="2"/><text x="132" y="157" font-size="25" font-weight="900" text-anchor="middle" fill="#222">FS</text>',
 phone:'<rect x="85" y="35" width="92" height="215" rx="17" fill="#2b2b2b" stroke="#999" stroke-width="5"/><rect x="94" y="54" width="76" height="180" rx="6" fill="#555"/><circle cx="109" cy="76" r="10" fill="#111" stroke="#bbb" stroke-width="2"/><circle cx="133" cy="76" r="10" fill="#111" stroke="#bbb" stroke-width="2"/><text x="131" y="170" font-size="37" font-weight="900" text-anchor="middle" fill="#eee">FS</text>',
 flag:'<path d="M68 29v235" stroke="#333" stroke-width="7"/><path d="M72 39q31-14 61 0t67 0v160q-33 14-67 0t-61 0Z" fill="#ddd" stroke="#333" stroke-width="3"/><path d="M104 32v167m63-165v165" stroke="#303030" stroke-width="27" opacity=".85"/>',
 slide:'<path d="M60 164q30 0 74 11l62 19q10 8 5 21-3 9-21 12H80q-20 0-33-15-7-13 13-48Z" fill="#333" stroke="#888" stroke-width="4"/><path d="M68 155q57-49 107-7l17 42q-45-31-118-6Z" fill="#ccc" stroke="#333" stroke-width="4"/><text x="125" y="173" font-size="24" font-weight="900" text-anchor="middle" fill="#222">FS</text>',
 blanket:'<path d="M66 58h137v168H66Z" fill="#eee" stroke="#222" stroke-width="4"/><path d="M91 58h28v168H91zm65 0h28v168h-28z" fill="#292929"/><path d="M67 227q60-11 136 0" fill="none" stroke="#555" stroke-width="4"/><text x="140" y="155" font-size="23" font-weight="900" text-anchor="middle" fill="#ccc">FIEL</text>',
 knife:'<path d="M50 209 167 86q31-30 44-9 9 15-19 39L75 229q-10 8-20-2t-5-18Z" fill="#ededed" stroke="#222" stroke-width="4"/><path d="M50 210 104 160" stroke="#252525" stroke-width="17" stroke-linecap="round"/><rect x="55" y="52" width="157" height="11" rx="5" fill="#555"/><path d="M63 66v83m133-83v64" stroke="#aaa" stroke-width="5"/>'
 };
 svg.innerHTML=shapes[kind];
 art.append(svg);
 art.append(make("span","visual-watermark",category==="souvenirs"?"PARA PRESENTEAR":"DE TORCEDOR PARA TORCEDOR"));
 return art;
}

function snapshotDetails(product){
 const snapshot=product.price_snapshot;
 if(!snapshot)return null;
 const amount=snapshot.amount_brl??snapshot.pix_brl;
 if(typeof amount!=="number")return null;
 let qualifier=snapshot.type||"";
 if(!qualifier&&snapshot.pix_brl!==undefined)qualifier="Pix na captura";
 if(qualifier==="menor preço da faixa")qualifier="menor valor entre variações";
 const wrap=make("div","shop-snapshot");
 wrap.append(make("strong","shop-snapshot-amount",money(amount)));
 const description=make("span","shop-snapshot-label","Valor visto em 15/10");
 if(qualifier)description.textContent+=" · "+qualifier;
 wrap.append(description);
 return wrap;
}
function actualProductCard(product){
 const out=unavailable(product);
 const card=make("article","shop-card"+(out?" is-unavailable":""));
 card.dataset.code=product.id;
 const media=make("div","shop-card-media");
 media.append(productVisual(product,false));
 media.append(make("span","shop-card-badge",out?"ESGOTADO NA CAPTURA":"SHOPEE"));
 const body=make("div","shop-card-body");
 body.append(make("span","shop-card-eyebrow",product.id+" · "+(collections[product.category_id]?.title||"FIEL SHOP")));
 body.append(make("h3","shop-card-title",product.product_name));
 const price=snapshotDetails(product);
 if(price)body.append(price);
 else body.append(make("p","shop-card-price-note","Consulte o valor atualizado no anúncio"));
 if(out){
   body.append(make("p","shop-stock-note","Produto esgotado na captura de 15/10/2026."));
   const disabled=make("span","shop-card-action unavailable-action","SEM ESTOQUE NA CONFERÊNCIA");
   body.append(disabled);
 }else{
   const link=make("a","shop-card-action","VER NA SHOPEE ↗");
   link.href=product.url;
   link.target="_blank";
   link.rel="noopener noreferrer sponsored nofollow";
   link.setAttribute("aria-label","Ver anúncio de "+product.product_name+" na Shopee");
   body.append(link);
 }
 card.append(media,body);
 return card;
}
function seasonCard(product){
 const card=make("article","shop-card season-card");
 const media=make("div","shop-card-media");
 media.append(productVisual({name:product.name,category_id:"camisas-atuais"},true));
 media.append(make("span","shop-card-badge","2026/27"));
 const body=make("div","shop-card-body");
 body.append(make("span","shop-card-eyebrow",(product.audience||"").toUpperCase()+" · MODELO REFERÊNCIA"));
 body.append(make("h3","shop-card-title",product.name));
 body.append(make("p","shop-card-price-note","Oferta ainda não associada a um anúncio"));
 body.append(make("span","shop-card-action unavailable-action","EM PREPARAÇÃO"));
 card.append(media,body);
 return card;
}
function filteredProducts(){
 const season=state.category==="camisas-atuais";
 const source=season?state.season:state.items.filter(p=>p.category_id===state.category&&isIdentified(p));
 const query=searchTerm(state.query).trim();
 let values=source.filter(p=>searchTerm((p.product_name||p.name||"")+" "+(p.id||"")).includes(query));
 if(state.sort==="az")values=values.sort((a,b)=>(a.product_name||a.name).localeCompare(b.product_name||b.name,"pt-BR"));
 if(state.sort==="za")values=values.sort((a,b)=>(b.product_name||b.name).localeCompare(a.product_name||a.name,"pt-BR"));
 if(!season&&state.sort==="featured")values=values.sort((a,b)=>Number(unavailable(a))-Number(unavailable(b)));
 return values;
}
function updateCategoryCounts(){
 const counts={
   "camisas-atuais":state.season.length,
   "casuais":state.items.filter(p=>p.category_id==="casuais"&&isIdentified(p)).length,
   "historicas":state.items.filter(p=>p.category_id==="historicas"&&isIdentified(p)).length,
   "souvenirs":state.items.filter(p=>p.category_id==="souvenirs"&&isIdentified(p)).length
 };
 $$("[data-category-count]").forEach(node=>{
   const id=node.getAttribute("data-category-count");
   node.textContent=id==="camisas-atuais"?(counts[id]+" MODELOS · SEM OFERTAS"):(counts[id]+" PRODUTOS");
 });
}
function renderCollection(){
 const area=$("#featured-products"),empty=$("#collection-empty"),counter=$("#collection-count");
 if(!area)return;
 if(!state.loaded){
   area.replaceChildren(make("p","shop-loading","Carregando nossa seleção..."));
   empty.hidden=true;
   return;
 }
 const results=filteredProducts();
 counter.textContent=results.length+" "+(results.length===1?"item":"itens");
 area.replaceChildren(...results.map(p=>state.category==="camisas-atuais"?seasonCard(p):actualProductCard(p)));
 area.hidden=results.length===0;
 empty.hidden=results.length!==0;
 if(!results.length){
   $("#collection-empty-title").textContent=state.query?"Nenhum produto encontrado nesta coleção.":"Estamos preparando esta seleção.";
   $("#collection-empty-description").textContent=state.query?"Tente outro termo ou explore uma categoria diferente.":"Em breve, novos itens para a Fiel. Consulte nossas outras categorias.";
 }
}
function selectCollection(category){
 if(!collections[category])return;
 state.category=category;
 state.query="";
 state.sort="featured";
 $("#product-search").value="";
 $("#product-sort").value="featured";
 const selected=collections[category];
 $("#collection-kicker").textContent=selected.kicker;
 const heading=$("#collection-title");
 heading.replaceChildren(document.createTextNode(selected.title+" "),make("span","",selected.accent));
 $("#collection-description").textContent=selected.description;
 $("#catalog-disclaimer").textContent=category==="camisas-atuais"?
 "Coleção editorial: modelos ilustrados sem ofertas ou links de compra confirmados.":
 "Valores vistos em capturas de 15/10/2026, sujeitos a mudanças. O vendedor confirma preço, disponibilidade, tamanhos e autenticidade. Compra feita na Shopee.";
 $$("[data-category-target]").forEach(a=>{
   const active=a.dataset.categoryTarget===category;
   a.classList.toggle("is-selected",active);
   if(active)a.setAttribute("aria-current","true");else a.removeAttribute("aria-current");
 });
 renderCollection();
}
document.addEventListener("click",event=>{
 const nav=event.target.closest("[data-category-target]");
 if(nav)selectCollection(nav.dataset.categoryTarget);
});
$("#product-search").addEventListener("input",event=>{state.query=event.target.value;renderCollection();});
$("#product-sort").addEventListener("change",event=>{state.sort=event.target.value;renderCollection();});
$("#menu-button").addEventListener("click",()=>{
 const menu=$("#mobile-nav");
 menu.hidden=!menu.hidden;
 $("#menu-button").setAttribute("aria-expanded",String(!menu.hidden));
});
$("#mobile-nav").addEventListener("click",event=>{
 if(event.target.closest("a")){
   $("#mobile-nav").hidden=true;
   $("#menu-button").setAttribute("aria-expanded","false");
 }
});
$("#year").textContent=new Date().getFullYear();

async function init(){
 try{
   const routes=["./data/shopee-links-pendentes.json","./data/vitrine-mantos-2026.json"];
   const [catalog,collection]=await Promise.all(routes.map(async path=>{
     const response=await fetch(path,{cache:"no-store"});
     if(!response.ok)throw Error("Falha ao carregar "+path);
     return response.json();
   }));
   state.items=(catalog.links||[]).filter(isIdentified);
   state.season=(collection.products||[]).filter(p=>p.category_id==="camisas-atuais");
   state.loaded=true;
   updateCategoryCounts();
   selectCollection("casuais");
 }catch(error){
   console.error(error);
   state.loaded=true;
   $("#featured-products").replaceChildren(make("p","shop-error","Não foi possível carregar a seleção agora. Atualize a página para tentar novamente."));
   $("#collection-count").textContent="Indisponível";
 }
}
init();
