"use strict";
document.querySelectorAll('[data-gallery-src]').forEach(button=>button.addEventListener('click',()=>{
 const image=document.querySelector('#pd-image img');
 if(!image)return;
 image.src=button.dataset.gallerySrc;
 image.alt=document.querySelector('h1').textContent+' — '+button.getAttribute('aria-label');
 document.querySelectorAll('[data-gallery-src]').forEach(item=>{
  const active=item===button;
  item.classList.toggle('is-active',active);
  item.setAttribute('aria-pressed',String(active));
 });
}));
