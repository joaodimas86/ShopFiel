"use strict";
/* Fiel Shop — detalhes de produto. Os links originais de afiliado vêm somente do catálogo JSON. */
const $ = selector => document.querySelector(selector);
const make = (tag,klass,value) => {
  const element=document.createElement(tag);
  if(klass)element.className=klass;
  if(value!==undefined)element.textContent=value;
  return element;
};
const searchTerm = text => String(text||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const affiliateUrl = url => typeof url==="string" && /^https:\/\/s\.shopee\.com\.br\/[A-Za-z0-9]+$/.test(url);
const money = n => Number(n).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const categories={
  "casuais":"Moda Casual",
  "historicas":"Camisas Históricas",
  "souvenirs":"Souvenirs e Acessórios",
  "camisas-atuais":"Camisas Atuais"
};
const categoryHref = id => "./index.html?categoria="+encodeURIComponent(id)+"#mantos";

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


function priceBlock(product){
  const box=$("#pd-price");
  box.replaceChildren();
  const snapshot=product.price_snapshot;
  const amount=snapshot && (snapshot.amount_brl??snapshot.pix_brl);
  if(typeof amount==="number" && Number.isFinite(amount)){
    box.append(make("span","pd-price-overline","REFERÊNCIA DE PREÇO · NÃO É VALOR AO VIVO"));
    box.append(make("strong","pd-price-value",money(amount)));
    const qualifier=snapshot.type|| (snapshot.pix_brl!==undefined?"Pix na captura":"");
    box.append(make("small","pd-price-foot","Valor visto em 15/10/2026"+(qualifier?" · "+qualifier:"")+". Preço, cupons e frete podem mudar."));
  }else{
    box.append(make("span","pd-price-overline","CONSULTE O PREÇO ATUAL"));
    box.append(make("strong","pd-price-placeholder","VALOR NA SHOPEE"));
    box.append(make("small","pd-price-foot","O vendedor informa o preço e as condições atualizadas."));
  }
}
function buyBlock(product){
  const box=$("#pd-buy-area");
  box.replaceChildren();
  if(product.availability==="out_of_stock"){
    box.append(make("div","pd-buy-disabled","ESGOTADO NA ÚLTIMA CONFERÊNCIA"));
    box.append(make("p","pd-stock-note","Anúncio marcado como esgotado na captura de 15/10/2026. A disponibilidade atual precisa ser consultada no marketplace."));
    return;
  }
  if(!affiliateUrl(product.url)){
    box.append(make("div","pd-buy-disabled","LINK DE COMPRA EM CONFERÊNCIA"));
    return;
  }
  const link=make("a","pd-buy-cta","COMPRAR NA SHOPEE ↗");
  link.href=product.url;
  link.target="_blank";
  link.rel="noopener noreferrer sponsored nofollow";
  link.setAttribute("aria-label","Comprar "+product.product_name+" na Shopee, em nova aba");
  box.append(link);
  box.append(make("p","pd-affiliate-note","Você será direcionado à Shopee pelo link de indicação da Fiel Shop."));
}
function checklist(product){
  const name=searchTerm(product.product_name);
  if(/capinha|capa para|samsung/.test(name))return [
    "Selecione o modelo exato do celular e confira a compatibilidade.",
    "Verifique cor, acabamento, material e proteção informados pelo vendedor.",
    "Confirme preço, frete, disponibilidade e política de devolução no anúncio."
  ];
  if(product.category_id==="casuais"||product.category_id==="historicas")return [
    "Confira a tabela de medidas e selecione o tamanho adequado.",
    "Verifique material, cores, estampa e itens incluídos na compra.",
    "Confirme preço, frete, disponibilidade e informações do vendedor."
  ];
  return [
    "Confira dimensões, material e os itens incluídos no anúncio.",
    "Leia as avaliações do produto e as informações do vendedor.",
    "Confirme preço, frete, disponibilidade e opções de entrega."
  ];
}
function relatedProducts(current,products){
  const candidates=products.filter(p=>p.id!==current.id&&p.status==="identified"&&p.category_id===current.category_id&&affiliateUrl(p.url)).slice(0,3);
  const container=$("#pd-related"),section=$("#pd-related-section");
  container.replaceChildren();
  section.hidden=!candidates.length;
  for(const item of candidates){
    const card=make("a","pd-related-card");
    card.href="./produto.html?id="+encodeURIComponent(item.id);
    card.setAttribute("aria-label","Ver detalhes de "+item.product_name);
    const figure=make("div","pd-related-image");
    figure.append(productVisual(item,false));
    card.append(figure,make("span","pd-related-category",categories[item.category_id]||"Fiel Shop"),make("h3","pd-related-name",item.product_name),make("span","pd-related-more","VER DETALHES ↗"));
    container.append(card);
  }
}
function showError(message){
  $("#pd-message").textContent=message;
  $("#pd-message").replaceChildren(document.createTextNode(message));
  const link=make("a","pd-error-link","VOLTAR À FIEL SHOP ↗");
  link.href="./index.html#catalogo";
  $("#pd-message").append(link);
  $("#pd-detail").hidden=true;
}
function renderProduct(product,allProducts){
  const category=categories[product.category_id]||"Fiel Shop";
  const categoryLink=categoryHref(product.category_id);
  const breadcrumb=$("#pd-breadcrumb-category");
  breadcrumb.textContent=category;
  breadcrumb.href=categoryLink;
  $("#pd-breadcrumb-current").textContent=product.product_name;
  $("#pd-eyebrow").textContent=product.id+" · "+category.toUpperCase()+" · SHOPEE";
  $("#pd-title").textContent=product.product_name;
  $("#pd-summary").textContent=product.description||"Um produto selecionado pela Fiel Shop. Confira informações e variações no anúncio da Shopee.";
  $("#pd-long-description").textContent=product.description||"Produto disponível para consulta no anúncio do vendedor.";
  const highlights=$("#pd-highlights");
  highlights.replaceChildren();
  for(const detail of (product.highlights||[]))highlights.append(make("li","",detail));
  $("#pd-checklist").replaceChildren(...checklist(product).map(line=>make("li","",line)));
  const figure=$("#pd-image");
  figure.replaceChildren(productVisual(product,false));
  figure.dataset.category=product.category_id||"";
  $("#pd-return-category").href=categoryLink;
  priceBlock(product);
  buyBlock(product);
  relatedProducts(product,allProducts);
  document.title=product.product_name+" | Fiel Shop";
  const desc=$('meta[name="description"]');
  if(desc)desc.setAttribute("content",(product.description||product.product_name).slice(0,155));
  $("#pd-message").hidden=true;
  $("#pd-detail").hidden=false;
}
async function init(){
  const id=new URLSearchParams(window.location.search).get("id");
  if(!id||!/^SHP-\d{3}$/.test(id)){
    showError("Produto não encontrado. Volte à vitrine e escolha um item.");
    return;
  }
  try{
    const response=await fetch("./data/shopee-links-pendentes.json",{cache:"no-store"});
    if(!response.ok)throw Error("Não foi possível carregar o catálogo.");
    const payload=await response.json();
    const products=Array.isArray(payload.links)?payload.links:[];
    const product=products.find(p=>p.id===id&&p.status==="identified"&&p.product_name&&affiliateUrl(p.url));
    if(!product){showError("Este produto não está disponível na vitrine no momento.");return;}
    renderProduct(product,products);
  }catch(error){
    console.error("Fiel Shop: falha ao abrir produto",error);
    showError("Não foi possível carregar o produto agora. Tente novamente.");
  }
}
init();
