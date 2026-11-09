from pathlib import Path

out = Path(__file__).parent / 'dist'

def field(name,label,typ='text',required=True,full=False,extra=''):
    return f'<label class="field {"full" if full else ""}"><span>{label}{" *" if required else ""}</span><input name="{name}" type="{typ}" {"required" if required else ""} {extra}></label>'

def page(title,kind,intro,aside,fields):
    return f'''<!doctype html><html lang="it-CH"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{title} | ATLS</title><meta name="description" content="{intro}"><meta name="theme-color" content="#f7f3eb"><link rel="icon" href="assets/logo.png"><link rel="stylesheet" href="style.css"><script defer src="config.js"></script><script defer src="app.js"></script></head><body><a class="skip" href="#formulario">Vai al formulario</a><header class="form-header"><a href="index.html"><img src="assets/logo.png" alt="ATLS — pagina iniziale"></a><a href="index.html">← Torna al sito</a></header><main class="wrap form-layout"><aside class="form-aside"><p class="eyebrow">ASSOCIAZIONE TICINESE DI LOTTA SVIZZERA</p><h1>{title}</h1><p>{intro}</p>{aside}</aside><form id="formulario" class="form-card" data-atls-form="{kind}"><h2>La tua richiesta</h2><p class="form-note">I campi contrassegnati con * sono obbligatori.</p>{fields}<label class="honeypot" aria-hidden="true">Sito web<input name="website" tabindex="-1" autocomplete="off"></label><label class="consent"><input type="checkbox" name="consenso" value="Confermato" required><span>Confermo i dati inseriti e acconsento al loro utilizzo da parte dell’ATLS per gestire questa richiesta. Ho letto l’<a href="privacy.html" target="_blank" rel="noopener">informativa sulla privacy</a>. *</span></label><button class="button" type="submit">Prepara l’email ↗</button><p class="form-note" data-mode-note>Potrai controllare e inviare la richiesta dal tuo programma di posta. Nessun messaggio parte automaticamente.</p><div class="form-result" role="status" aria-live="polite" tabindex="-1" hidden></div></form></main><footer class="footer wrap"><span>© 2026 ATLS</span><div class="footer-links"><a href="mailto:info@lottasvizzera.ch">info@lottasvizzera.ch</a><a href="privacy.html">Privacy e crediti</a></div></footer></body></html>'''

member = '<fieldset><legend>Come desideri aderire? *</legend><label class="choice"><input type="radio" name="tipo_membro" value="Membro passivo" checked>Membro passivo · da 20 CHF</label><label class="choice"><input type="radio" name="tipo_membro" value="Sostenitore">Sostenitore · da 50 CHF</label></fieldset><div class="form-grid">'
member += field('cognome','Cognome',extra='autocomplete="family-name" maxlength="100"')
member += field('nome','Nome',extra='autocomplete="given-name" maxlength="100"')
member += field('via','Via e numero',full=True,extra='autocomplete="street-address" maxlength="180"')
member += field('cap','CAP',extra='autocomplete="postal-code" maxlength="12"')
member += field('luogo','Luogo',extra='autocomplete="address-level2" maxlength="120"')
member += field('nascita','Data di nascita','date',False,extra='autocomplete="bday"')
member += field('natel','Natel','tel',False,extra='autocomplete="tel" maxlength="40"')
member += field('telefono','Telefono fisso','tel',False,extra='maxlength="40"')
member += field('email','Email','email',extra='autocomplete="email" maxlength="180"')
member += field('quota','Contributo annuale (CHF)','number',extra='min="20" max="100000" step="1" value="20"')
member += field('data','Data della richiesta','date',extra='data-today')
member += field('firma','Nome e cognome per conferma',full=True,extra='maxlength="200"')
member += '<p class="form-note field full">Il nome digitato conferma la tua richiesta online. Se preferisci firmare il modulo originale, <a href="assets/documenti/iscrizione-membri.pdf" target="_blank" rel="noopener">scarica il PDF</a> e invialo alla segreteria.</p></div>'
aside = '<div class="aside-note"><h3>Un piccolo gesto,<br>una grande partecipazione.</h3><p>Da 20 CHF all’anno ricevi l’invito all’assemblea e rimani aggiornato sulla lotta svizzera. Il tuo contributo sostiene la pratica e la diffusione di questo sport in Ticino.</p><p>La segreteria ti ricontatterà per completare l’adesione e indicarti come versare il contributo.</p></div><div class="aside-note"><span class="eyebrow">IL TUO RIFERIMENTO</span><p>Ruth Crotta · Segretaria e cassiera<br><a href="mailto:crotta@bluewin.ch">crotta@bluewin.ch</a><br><a href="tel:+41796969179">+41 79 696 91 79</a></p></div>'
(out/'iscrizione.html').write_text(page('Entra a far parte<br><em>dell’ATLS.</em>','membership','Non serve entrare nel cerchio per sostenere la lotta svizzera. Diventa membro passivo o sostenitore.',aside,member).replace('<title>Entra a far parte<br><em>dell’ATLS.</em> | ATLS</title>','<title>Diventa membro | ATLS</title>'),encoding='utf-8')

event='<div class="form-grid">'
event+=field('evento','Nome / tipo di evento',full=True,extra='maxlength="180" placeholder="Es. festa di paese, fiera, giornata sportiva"')
event+=field('data_evento','Data dell’evento','date')
event+=field('orario','Orario indicativo',extra='maxlength="80" placeholder="Es. 14:00–17:00"')
event+=field('luogo_evento','Luogo e indirizzo',full=True,extra='maxlength="250"')
event+=field('durata','Durata desiderata',extra='maxlength="80" placeholder="Es. 2 ore, mezza giornata"')
event+=field('pubblico','Pubblico previsto',required=False,extra='maxlength="120" placeholder="Es. 50 persone, famiglie"')
event+='<label class="field full"><span>Informazioni e richieste *</span><textarea name="informazioni" required maxlength="4000" placeholder="Descrivi l’evento, lo spazio disponibile e ciò che vorresti proporre."></textarea></label>'
event+=field('nome','Nome del contatto',extra='autocomplete="given-name" maxlength="100"')
event+=field('cognome','Cognome del contatto',extra='autocomplete="family-name" maxlength="100"')
event+=field('telefono','Telefono','tel',extra='autocomplete="tel" maxlength="40"')
event+=field('email','Email','email',extra='autocomplete="email" maxlength="180"')
event+='</div>'
aside='<img src="assets/eventi.webp" alt="Il tappetone gonfiabile ATLS"><div class="aside-note"><h3>Raccontaci la tua idea.</h3><p>Indica data, luogo e durata: valuteremo insieme la disponibilità e la formula più adatta. La richiesta non costituisce una prenotazione.</p><p><a href="mailto:info@lottasvizzera.ch">info@lottasvizzera.ch</a></p></div>'
(out/'evento.html').write_text(page('La lotta svizzera<br><em>al tuo evento.</em>','event','Dimostrazioni, prove e un tappetone gonfiabile per far conoscere il nostro sport a feste e fiere.',aside,event).replace('<title>La lotta svizzera<br><em>al tuo evento.</em> | ATLS</title>','<title>Richiedi un evento | ATLS</title>'),encoding='utf-8')
