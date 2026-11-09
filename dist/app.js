'use strict';
const config=window.ATLS_CONFIG||{};
const menuButton=document.querySelector('.menu-toggle');
const navigation=document.querySelector('#navigation');
function closeMenu(){navigation?.classList.remove('open');menuButton?.setAttribute('aria-expanded','false')}
menuButton?.addEventListener('click',()=>{const open=navigation.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open))});
navigation?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();menuButton?.focus()}});
const archive=document.querySelector('#documents-archive');
if(archive&&/^https:\/\//.test(config.documentsUrl||''))archive.href=config.documentsUrl;
document.querySelectorAll('[data-today]').forEach(el=>el.value=new Intl.DateTimeFormat('sv-SE').format(new Date()));
const form=document.querySelector('form[data-atls-form]');
if(form){
 const result=form.querySelector('.form-result');
 const submit=form.querySelector('button[type=submit]');
 const modeNote=form.querySelector('[data-mode-note]');
 if(config.emailMode==='server'&&config.formEndpoint){submit.textContent='Invia la richiesta ↗';modeNote.textContent='La richiesta viene inviata all’ATLS. Riceverai un riscontro ai contatti indicati.'}
 form.querySelectorAll('input[name=tipo_membro]').forEach(r=>r.addEventListener('change',()=>{const amount=form.elements.quota;amount.min=r.value==='Sostenitore'?'50':'20';amount.value=amount.min}));
 function show(message){result.hidden=false;result.replaceChildren();const p=document.createElement('p');p.textContent=message;result.append(p);result.focus();return result}
 form.addEventListener('submit',async e=>{
  e.preventDefault();if(!form.reportValidity())return;
  if(form.elements.website?.value)return;
  const values=Object.fromEntries(new FormData(form));
  const type=form.dataset.atlsForm;
  const labels={tipo_membro:'Tipo di adesione',cognome:'Cognome',nome:'Nome',via:'Via e numero',cap:'CAP',luogo:'Luogo',nascita:'Data di nascita',natel:'Natel',telefono:'Telefono',email:'Email',quota:'Contributo annuale CHF',data:'Data della richiesta',firma:'Nome digitato per conferma',evento:'Evento',data_evento:'Data evento',orario:'Orario indicativo',luogo_evento:'Luogo e indirizzo evento',durata:'Durata desiderata',pubblico:'Partecipanti / pubblico previsto',informazioni:'Informazioni e richieste',consenso:'Consenso al trattamento per questa richiesta'};
  const subject=type==='membership'?'ATLS — Richiesta di adesione':'ATLS — Richiesta evento: '+values.evento;
  const body=Object.entries(values).filter(([k])=>labels[k]).map(([k,v])=>`${labels[k]}: ${v||'—'}`).join('\n');
  const recipient=type==='membership'?(config.membershipEmail||'crotta@bluewin.ch'):(config.infoEmail||'info@lottasvizzera.ch');
  const mailto=`mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  if(config.emailMode==='server'&&config.formEndpoint){
   submit.disabled=true;
   try{const res=await fetch(config.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...values,type}),signal:AbortSignal.timeout(20000)});const data=await res.json();if(!res.ok||!data.ok)throw Error(data.message||'Invio non riuscito');show('La richiesta è stata affidata al servizio email. Grazie! L’ATLS ti risponderà ai contatti indicati.');form.reset()}
   catch{const box=show('Non è stato possibile completare l’invio. I tuoi dati sono ancora nel formulario. Puoi inviare la richiesta tramite il tuo programma di posta.');const a=document.createElement('a');a.href=mailto;a.textContent='Apri l’email compilata ↗';box.append(a)}
   finally{submit.disabled=false}
  }else{
   const box=show('La tua richiesta è pronta. Apri l’email compilata, controlla i dati e premi Invia nel tuo programma di posta. Il formulario non ha ancora inviato nulla.');
   const a=document.createElement('a');a.href=mailto;a.textContent='Apri l’email compilata ↗';box.append(a);
   const copy=document.createElement('button');copy.type='button';copy.className='button';copy.style.marginTop='16px';copy.textContent='Copia il testo';copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(`A: ${recipient}\nOggetto: ${subject}\n\n${body}`);copy.textContent='Testo copiato'}catch{copy.textContent='Seleziona il testo qui sotto';const t=document.createElement('textarea');t.value=body;t.style.width='100%';box.append(t);t.select()}});box.append(document.createElement('br'),copy);
  }
 });
}
