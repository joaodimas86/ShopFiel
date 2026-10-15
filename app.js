"use strict";
const $=s=>document.querySelector(s);
const valid=(url,market)=>market==="shopee"?/^https:\/\/s\.shopee\.com\.br\/[A-Za-z0-9]+$/.test(url):/^https:\/\/meli\.la\/[A-Za-z0-9]+$/.test(url);
let items=[];
const isVerified=x=>x.status==="verified"&&Boolean(x.product_name&&x.verified_at);
const isIdentified=x=>Boolean(x.product_name)&&["identified","verified"].includes(x.status);
const label=x=>isIdentified(x)?x.product_name:"Referência "+x.id;
const company=x=>x.marketplace==="shopee"?"Shopee":"Mercado Livre";
const el=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text!=null)node.textContent=text;return node;};
function card(item){
 const a=el("article","card");
 const media=el("button","card-media");media.type="button";media.dataset.id=item.id;
 const art=el("div","art-bg theme-"+(Number(item.id.replace(/\D/g,""))%4));
 art.append(el("span","art-number",item.id),el("span","art-symbol","✳"),el("span","art-caption","PRODUTO EM CONFERÊNCIA"));
 media.append(el("span","chip",company(item)),art);
 const info=el("div","card-info");
 info.append(el("div","card-kicker",isIdentified(item)?"PRODUTO IDENTIFICADO":"DADOS EM CONFERÊNCIA"));
 const title=el("button","card-title",label(item));title.type="button";title.dataset.id=item.id;
 const price=el("p","card-price",item.price_brl!=null&&isVerified(item)?Number(item.price_brl).toLocaleString("pt-BR",{style:"currency",currency:"BRL"}):"Preço no parceiro");
 const more=el("button","card-more","VER DETALHES ↗");more.type="button";more.dataset.id=item.id;
 info.append(title,price,more);a.append(media,info);return a;
}
function render(){
 const q=$("#search").value.toLocaleLowerCase("pt-BR").trim();
 let result=items.filter(x=>(x.id+" "+(x.product_name||"")+" "+company(x)).toLocaleLowerCase("pt-BR").includes(q));
 if($("#sort").value==="recent")result=result.slice().reverse();
 if($("#sort").value==="verified")result=result.slice().sort((a,b)=>Number(isIdentified(b))-Number(isIdentified(a)));
 $("#products").replaceChildren(...result.map(card));
 $("#result-count").textContent=result.length+" registro(s) encontrado(s)";
 $("#empty").hidden=result.length>0;
}
function show(id){
 const x=items.find(p=>p.id===id);if(!x)return;
 $("#detail-code").textContent=x.id+" · "+company(x);
 $("#detail-title").textContent=label(x);
 $("#detail-status").textContent=isIdentified(x)?"PRODUTO IDENTIFICADO · CONFIRA PREÇO E ORIGINALIDADE":"IDENTIFICAÇÃO PENDENTE";
 $("#detail-explain").textContent="Confira o nome exato, as fotos, o preço, o vendedor e as condições na plataforma antes de comprar.";
 $("#detail-price").textContent="Consulte preço e disponibilidade na plataforma.";
 const art=el("div","art-bg detail-art-inner");art.append(el("span","art-number",x.id),el("span","art-symbol","✳"));
 $("#detail-visual").replaceChildren(art);
 const link=$("#shopee-link");
 link.href=x.url;
 link.textContent="VER NO "+company(x).toUpperCase()+" ↗";
 const active=$(".active-deal strong");active.textContent=company(x);
 if(x.marketplace==="mercado_livre"){
  $("#detail-status").textContent="LINK NÃO COMISSIONADO · PRODUTO EM CONFERÊNCIA";
  $("#detail-explain").textContent="Sua afiliação no Mercado Livre ainda está pendente. Este é apenas um link de consulta, sem comissão confirmada. Verifique produto, vendedor e condições na plataforma.";
 }
 $("#item-dialog").showModal();
}
async function load(){
 try{
 const sources=[["./data/shopee-links-pendentes.json","shopee"],["./data/mercado-livre-links-pendentes.json","mercado_livre"]];
 const responses=await Promise.all(sources.map(async ([url,market])=>{const r=await fetch(url,{cache:"no-store"});if(!r.ok)throw Error("Falha ao carregar "+market);const j=await r.json();return j.links||[];}));
 items=responses.flat().filter(x=>x&&valid(String(x.url||""),x.marketplace)&&/^((SHP)|(ML))-\d{3}$/.test(String(x.id)));
 $("#count-badge").textContent=items.length+" LINKS REGISTRADOS";
 render();
 renderSelectedCollection();
 }catch(err){
 console.error(err);
 $("#count-badge").textContent="INDISPONÍVEL";
 $("#result-count").textContent="Erro ao carregar o catálogo.";
 $("#empty").hidden=false;
 $("#empty").textContent="Não foi possível carregar o catálogo. Tente atualizar a página.";
 }
}
document.addEventListener("click",e=>{const b=e.target.closest("[data-id]");if(b)show(b.dataset.id)});
$("#search").addEventListener("input",render);
$("#sort").addEventListener("change",render);
$("#close-dialog").addEventListener("click",()=>$("#item-dialog").close());
$("#item-dialog").addEventListener("click",e=>{if(e.target===e.currentTarget)e.currentTarget.close()});
$("#menu-button").addEventListener("click",()=>{const m=$("#mobile-nav");m.hidden=!m.hidden;$("#menu-button").setAttribute("aria-expanded",String(!m.hidden))});
$("#mobile-nav").addEventListener("click",e=>{if(e.target.closest("a")){$("#mobile-nav").hidden=true;$("#menu-button").setAttribute("aria-expanded","false")}});
$("#year").textContent=new Date().getFullYear();
load();


async function loadFeatured(){
 const holder=$("#featured-products");if(!holder)return;
 try{
  const response=await fetch("./data/vitrine-mantos-2026.json",{cache:"no-store"});
  if(!response.ok)throw Error("Coleção indisponível");
  const source=await response.json();
  const products=Array.isArray(source.products)?source.products:[];
  const fragment=document.createDocumentFragment();
  const shirt=(kit)=>{const light=kit==="I",fill=light?"#f5f5f4":"#232323",line=light?"#bcbcbc":"#dddddd";
   const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
   svg.setAttribute("viewBox","0 0 240 260");svg.setAttribute("aria-hidden","true");
   svg.innerHTML='<path d="M66 45 95 29h50l29 16 37 35-21 42-25-15v118H75V107L50 122 29 80Z" fill="'+fill+'" stroke="'+line+'" stroke-width="2"/>'+(light?'':'<path d="M84 35h13v188H84zm34 0h13v188h-13zm34 0h13v188h-13z" fill="#efefef"/>')+'<path d="M94 30q26 29 51 0" fill="none" stroke="'+line+'" stroke-width="5"/>';
   return svg;
  };
  for(const item of products){
   const card=el("article","feature-card");
   const media=el("div","feature-media");media.append(el("span","feature-chip","2026/27"),shirt(item.kit),el("small","feature-image-note","ILUSTRAÇÃO DE LAYOUT"));
   const content=el("div","feature-copy");content.append(el("small","feature-category","MANTOS SAGRADOS / "+(item.audience||"").toUpperCase()),el("h3","feature-name",item.name),el("p","feature-price","Ofertas em conferência"));
   const action=el("button","feature-action","VER INFORMAÇÕES ↗");action.type="button";action.addEventListener("click",()=>showFeature(item));
   content.append(action);card.append(media,content);fragment.append(card);
  }
  holder.replaceChildren(fragment);
 }catch(err){console.error(err);holder.textContent="Coleção temporariamente indisponível.";}
}
function showFeature(item){
 let dialog=$("#feature-dialog");
 if(!dialog){dialog=el("dialog","feature-dialog");dialog.id="feature-dialog";document.body.append(dialog);}
 dialog.replaceChildren();
 const close=el("button","feature-close","×");close.type="button";close.setAttribute("aria-label","Fechar informações");close.addEventListener("click",()=>dialog.close());
 const wrap=el("div","feature-dialog-content");wrap.append(el("small","feature-category","COLEÇÃO 2026/27"),el("h2","",item.name),el("p","","Estamos identificando anúncios correspondentes a este modelo nas plataformas parceiras. Nenhum preço ou link de compra foi associado ainda."),el("strong","","MERCADO LIVRE · SHOPEE · AMAZON"),el("p","","Assim que houver anúncios verificados, você poderá escolher onde finalizar a compra. A Fiel Shop é uma vitrine independente e não recebe pagamentos."));dialog.append(close,wrap);dialog.showModal();
}
loadFeatured();

/* Navegação por categorias. Os links pendentes ainda não são classificados automaticamente. */
const collections = Object.freeze({
  "camisas-atuais":{kicker:"LANÇAMENTOS · TEMPORADA 2026/27",title:"CAMISAS",accent:"ATUAIS.",description:"Conheça os uniformes da temporada. As imagens são ilustrativas e as ofertas serão liberadas após conferirmos cada anúncio."},
  "casuais":{kicker:"VESTUÁRIO · DIA A DIA",title:"MODA",accent:"CASUAL.",description:"Camisetas, polos e roupas para torcer em qualquer ocasião.",empty:"Moda casual em preparação",note:"Os produtos desta seção serão exibidos depois que identificarmos e conferirmos os respectivos anúncios."},
  "historicas":{kicker:"HISTÓRIA · TRADIÇÃO",title:"CAMISAS",accent:"HISTÓRICAS.",description:"Uniformes clássicos, camisas retrô e modelos de outras temporadas.",empty:"Camisas históricas em preparação",note:"Vamos incluir modelos antigos e retrô conforme confirmarmos procedência e disponibilidade."},
  "souvenirs":{kicker:"PRESENTES · ACESSÓRIOS",title:"SOUVENIRS",accent:"& ACESSÓRIOS.",description:"Produtos para presentear e levar a paixão por futebol além da arquibancada.",empty:"Souvenirs e acessórios em preparação",note:"Esta categoria receberá produtos assim que identificarmos os links e verificarmos as informações."}
});
let currentCollection = "camisas-atuais";
function selectCollection(key){
 const selected=collections[key];if(!selected)return;
 currentCollection=key;
 $("#collection-kicker").textContent=selected.kicker;
 const heading=$("#collection-title");heading.replaceChildren(document.createTextNode(selected.title+" "),el("span","",selected.accent));
 $("#collection-description").textContent=selected.description;
 renderSelectedCollection();
 document.querySelectorAll("[data-category-target]").forEach(link=>{
  const active=link.dataset.categoryTarget===key;
  link.classList.toggle("is-selected",active);
  if(active)link.setAttribute("aria-current","true");else link.removeAttribute("aria-current");
 });
}
function renderSelectedCollection(){
 const key=currentCollection;
 const grid=$("#featured-products"),empty=$("#collection-empty");
 if(!grid||!empty)return;
 if(key==="camisas-atuais"){
   grid.hidden=false;empty.hidden=true;
   if(grid.dataset.collectionMode==="catalog-items"){
     grid.dataset.collectionMode="season-items";
     loadFeatured();
   }
   return;
 }
 const found=items.filter(x=>x.category_id===key&&isIdentified(x)&&valid(x.url,x.marketplace));
 if(!found.length){
   grid.hidden=true;empty.hidden=false;
   const selected=collections[key];
   $("#collection-empty-title").textContent=selected.empty;
   $("#collection-empty-description").textContent=selected.note;
   return;
 }
 grid.hidden=false;empty.hidden=true;
 grid.dataset.collectionMode="catalog-items";
 const fragment=document.createDocumentFragment();
 for(const item of found){
   const product=el("article","feature-card");
   const visual=el("div","feature-media lifestyle-product-media");
   const art=el("div","casual-swatch");
   art.append(el("span","casual-swatch-monogram","FIEL"),el("span","casual-swatch-label","IMAGEM DO PRODUTO EM CONFERÊNCIA"));
   visual.append(el("span","feature-chip",company(item)),art);
   const details=el("div","feature-copy");
   details.append(el("small","feature-category","MODA CASUAL · "+item.id),el("h3","feature-name",item.product_name),el("p","feature-price","Consulte o preço atualizado no parceiro"));
   const action=el("a","feature-action","VER NA "+company(item).toUpperCase()+" ↗");
   action.href=item.url;action.target="_blank";action.rel="nofollow sponsored noopener noreferrer";
   details.append(action);product.append(visual,details);fragment.append(product);
 }
 grid.replaceChildren(fragment);
}
document.addEventListener("click",event=>{
 const trigger=event.target.closest("[data-category-target]");
 if(trigger)selectCollection(trigger.dataset.categoryTarget);
});
selectCollection("camisas-atuais");
