'use strict';
const config=window.ATLS_CONFIG||{};
const isGerman=document.documentElement.lang.toLowerCase().startsWith('de');
const words=isGerman?{
 serverSubmit:'Anfrage senden ↗',serverNote:'Die Anfrage wird an die ATLS gesendet. Du erhältst eine Antwort über die angegebenen Kontaktdaten.',
 membershipSubject:'ATLS — Beitrittsanfrage',eventSubject:'ATLS — Anlassanfrage: ',failed:'Senden nicht möglich',
 sent:'Die Anfrage wurde dem E-Mail-Dienst übergeben. Vielen Dank! Die ATLS antwortet dir über die angegebenen Kontaktdaten.',
 fallback:'Die Anfrage konnte nicht gesendet werden. Deine Angaben stehen weiterhin im Formular. Du kannst sie über dein E-Mail-Programm senden.',
 open:'Vorbereitete E-Mail öffnen ↗',ready:'Deine Anfrage ist bereit. Öffne die vorbereitete E-Mail, prüfe die Angaben und sende sie in deinem E-Mail-Programm. Das Formular hat noch nichts versendet.',
 copy:'Text kopieren',copied:'Text kopiert',select:'Text unten markieren',to:'An',subject:'Betreff',empty:'—'
}:{
 serverSubmit:'Invia la richiesta ↗',serverNote:'La richiesta viene inviata all’ATLS. Riceverai un riscontro ai contatti indicati.',
 membershipSubject:'ATLS — Richiesta di adesione',eventSubject:'ATLS — Richiesta evento: ',failed:'Invio non riuscito',
 sent:'La richiesta è stata affidata al servizio email. Grazie! L’ATLS ti risponderà ai contatti indicati.',
 fallback:'Non è stato possibile completare l’invio. I tuoi dati sono ancora nel formulario. Puoi inviare la richiesta tramite il tuo programma di posta.',
 open:'Apri l’email compilata ↗',ready:'La tua richiesta è pronta. Apri l’email compilata, controlla i dati e premi Invia nel tuo programma di posta. Il formulario non ha ancora inviato nulla.',
 copy:'Copia il testo',copied:'Testo copiato',select:'Seleziona il testo qui sotto',to:'A',subject:'Oggetto',empty:'—'
};
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
 if(config.emailMode==='server'&&config.formEndpoint){submit.textContent=words.serverSubmit;modeNote.textContent=words.serverNote}
 form.querySelectorAll('input[name=tipo_membro]').forEach(r=>r.addEventListener('change',()=>{const amount=form.elements.quota;amount.min=r.value==='Sostenitore'?'50':'20';amount.value=amount.min}));
 function show(message){result.hidden=false;result.replaceChildren();const p=document.createElement('p');p.textContent=message;result.append(p);result.focus();return result}
 form.addEventListener('submit',async e=>{
  e.preventDefault();if(!form.reportValidity())return;
  if(form.elements.website?.value)return;
  const values=Object.fromEntries(new FormData(form));
  const type=form.dataset.atlsForm;
  const labels=isGerman?{tipo_membro:'Art der Mitgliedschaft',cognome:'Nachname',nome:'Vorname',via:'Strasse und Hausnummer',cap:'PLZ',luogo:'Ort',nascita:'Geburtsdatum',natel:'Mobiltelefon',telefono:'Telefon',email:'E-Mail',quota:'Jahresbeitrag CHF',data:'Datum der Anfrage',firma:'Name zur Bestätigung',evento:'Anlass',data_evento:'Datum des Anlasses',orario:'Ungefähre Uhrzeit',luogo_evento:'Ort und Adresse des Anlasses',durata:'Gewünschte Dauer',pubblico:'Erwartete Teilnehmendenzahl',informazioni:'Informationen und Wünsche',consenso:'Einwilligung zur Bearbeitung dieser Anfrage'}:{tipo_membro:'Tipo di adesione',cognome:'Cognome',nome:'Nome',via:'Via e numero',cap:'CAP',luogo:'Luogo',nascita:'Data di nascita',natel:'Natel',telefono:'Telefono',email:'Email',quota:'Contributo annuale CHF',data:'Data della richiesta',firma:'Nome digitato per conferma',evento:'Evento',data_evento:'Data evento',orario:'Orario indicativo',luogo_evento:'Luogo e indirizzo evento',durata:'Durata desiderata',pubblico:'Partecipanti / pubblico previsto',informazioni:'Informazioni e richieste',consenso:'Consenso al trattamento per questa richiesta'};
  const subject=type==='membership'?words.membershipSubject:words.eventSubject+values.evento;
  const body=Object.entries(values).filter(([k])=>labels[k]).map(([k,v])=>`${labels[k]}: ${v||words.empty}`).join('\n');
  const recipient=type==='membership'?(config.membershipEmail||'crotta@bluewin.ch'):(config.infoEmail||'info@lottasvizzera.ch');
  const mailto=`mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  if(config.emailMode==='server'&&config.formEndpoint){
   submit.disabled=true;
   try{const res=await fetch(config.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...values,type,language:isGerman?'de':'it'}),signal:AbortSignal.timeout(20000)});const data=await res.json();if(!res.ok||!data.ok)throw Error(data.message||words.failed);show(words.sent);form.reset()}
   catch{const box=show(words.fallback);const a=document.createElement('a');a.href=mailto;a.textContent=words.open;box.append(a)}
   finally{submit.disabled=false}
  }else{
   const box=show(words.ready);
   const a=document.createElement('a');a.href=mailto;a.textContent=words.open;box.append(a);
   const copy=document.createElement('button');copy.type='button';copy.className='button';copy.style.marginTop='16px';copy.textContent=words.copy;copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(`${words.to}: ${recipient}\n${words.subject}: ${subject}\n\n${body}`);copy.textContent=words.copied}catch{copy.textContent=words.select;const t=document.createElement('textarea');t.value=body;t.style.width='100%';box.append(t);t.select()}});box.append(document.createElement('br'),copy);
  }
 });
}
