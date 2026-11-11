"use strict";
(() => {
 const title=document.querySelector('#pd-title');
 if(!title || !title.textContent.trim())return;
 const canonical=document.querySelector('link[rel="canonical"]');
 const url=canonical?canonical.href:location.href;
 const product=title.textContent.trim();
 const section=document.createElement('section');
 section.className='sf-questions';
 section.setAttribute('aria-labelledby','sf-questions-title');
 section.innerHTML=`<h2 id="sf-questions-title">Dúvidas sobre este produto?</h2>
 <p>De corinthiano para corinthiano: mande sua pergunta para a ShopFiel.</p>
 <form><label for="sf-question">O que você gostaria de saber?</label>
 <textarea id="sf-question" name="question" required minlength="5" maxlength="1000" rows="4" placeholder="Escreva sua dúvida sobre este produto…"></textarea>
 <p class="sf-question-note">Ao continuar, o WhatsApp será aberto. Toque em enviar lá para concluir. Sua pergunta não será publicada automaticamente.</p>
 <button type="submit">Enviar pergunta pelo WhatsApp ↗</button></form>
 <a class="sf-direct-whatsapp" target="_blank" rel="noopener noreferrer">Conversar direto no WhatsApp ↗</a>
 <h3>Perguntas e respostas</h3><div class="sf-public-questions" aria-live="polite"><p>Ainda não há perguntas respondidas publicadas para este produto.</p></div>
 <p class="sf-question-note">Perguntas recebidas pelo WhatsApp podem ser publicadas aqui após sua autorização e revisão da ShopFiel, sem telefone ou dados pessoais. Compra, frete, estoque e pagamento são tratados no marketplace.</p>`;
 const linkFor=text=>'https://wa.me/5519997424462?text='+encodeURIComponent(text);
 const intro='Olá, ShopFiel! Tenho uma dúvida sobre '+product+'\n'+url;
 section.querySelector('.sf-direct-whatsapp').href=linkFor(intro);
 section.querySelector('form').addEventListener('submit',event=>{
  event.preventDefault();
  const input=section.querySelector('textarea');
  if(input.value.trim().length<5){input.setCustomValidity('Escreva sua pergunta com pelo menos 5 caracteres.');input.reportValidity();return;}
  input.setCustomValidity('');
  window.open(linkFor(intro+'\n\nMinha pergunta: '+input.value.trim()),'_blank','noopener,noreferrer');
 });
 section.querySelector('textarea').addEventListener('input',event=>event.target.setCustomValidity(''));
 const details=document.querySelector('.pd-details');
 if(details)details.after(section);else title.closest('main').append(section);
 fetch(new URL('./data/perguntas-produtos.json',document.baseURI)).then(response=>{if(!response.ok)throw Error('questions');return response.json();}).then(data=>{
  const entries=data[new URL(url).pathname];
  if(!Array.isArray(entries)||!entries.length)return;
  const container=section.querySelector('.sf-public-questions');
  container.replaceChildren();
  for(const entry of entries){
   if(!entry || typeof entry.question!=='string'||typeof entry.answer!=='string')continue;
   const article=document.createElement('article');
   const question=document.createElement('h4');question.textContent=entry.question;
   const answer=document.createElement('p');answer.textContent='ShopFiel: '+entry.answer;
   article.append(question,answer);container.append(article);
  }
 }).catch(()=>{});
})();
