# Nuovo sito ATLS · novembre 2026

Sito italiano responsive in HTML, CSS e JavaScript, con immagini ATLS ottimizzate e percorso culturale in sei capitoli.

## Anteprima

Da questa cartella: `python -m http.server 4187 --directory dist`, poi aprire http://localhost:4187.

La versione Sites è privata e usa la modalità `compose`: i formulari preparano il messaggio, il visitatore lo verifica e lo invia con il proprio programma email. Non viene dichiarato un invio automatico.

## Pubblicazione su Hostpoint / hosting PHP

Il pacchetto `output/ATLS-sito-nuovo-Hostpoint.zip` contiene i file da caricare nella cartella pubblica del dominio. Il pacchetto imposta `emailMode: 'server'` e l’endpoint `api/forms.php`.

Requisiti: PHP 8.1+ con funzione `mail()` configurata per il dominio. L’endpoint valida i dati, limita le richieste, evita destinatari arbitrari e invia le adesioni a `crotta@bluewin.ch`, gli eventi a `info@lottasvizzera.ch`. Va verificata la ricezione di una richiesta di prova dopo il caricamento. La consegna reale non è stata testata da questo ambiente; PHP non è installato nel runtime locale.

Se il servizio email non è configurato, il sito mostra l’errore e propone il messaggio compilato. Non mostra un falso invio riuscito. Per usare sempre la posta del visitatore impostare `emailMode: 'compose'` nel file `config.js`.

## Documenti e aggiornamenti

- Per OneDrive: inserire l’URL di condivisione della cartella in `documentsUrl` in `dist/config.js`. Fino ad allora il collegamento Archivio apre l’archivio ufficiale esistente.
- Contenuti, statistiche, comitato, partner: `dist/index.html`.
- Aggiungere partner duplicando un elemento `.partner-logo`, con logo, nome, descrizione e URL reali; aggiornare il conteggio in Chi siamo.
- Formulari: `build-forms.py` genera `dist/iscrizione.html` e `dist/evento.html`.
- Cultura: `dist/cultura.html` e `dist/cultura.css`.
- L’endpoint PHP è mantenuto fuori dal pacchetto statico Sites e viene aggiunto solo all’archivio per hosting PHP.

## Fonti e dati

- Sito ufficiale lottasvizzera.ch: contatti, palestra, accesso, Cetra.
- Indirizzo verificato sul sito CMFG Arena: Via Ciossa 5, 6806 Sigirino (https://cmfgarena.ch/it/Contatti).
- Dossier partner ATLS: identità e comitato (6 persone).
- Utente: 10 attivi, 7 giovani, 20 CHF quota minima.
- Assemblea 2025 nel rapporto annuale 2026: 251 membri passivi; rapporto presidente 2026: un membro d’onore (Edi Ritter).
- Partner esistente verificato: Cetra Alimentari SA. Nessuna proposta commerciale viene presentata come accordo concluso.
- Formulario originale nella cartella membri: campi anagrafici, tipo adesione e conferma.
- Pannelli culturali: PDF finale DEF04 della consegna grafica; storia ticinese separata dai sei capitoli.
- Foto Ämmeten: archivio 2026; ritratti e altre immagini dal materiale ATLS.

## Cosa manca per l’esercizio sul dominio

1. Caricamento del pacchetto su hosting PHP e test reale dell’invio/ricezione.
2. URL della cartella OneDrive, quando disponibile.
3. Eventuali nuovi loghi e schede partner.

Il sito attuale e i precedenti progetti nella cartella non sono stati modificati.
