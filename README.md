# FootballManagerAI2026

Primo prototipo locale della visualizzazione partita 2D: **Bianchi contro Rossi**.

Richiede Node.js 20 o successivo, senza dipendenze da installare.

```sh
npm start
```

Aprire http://127.0.0.1:4173. `npm test` verifica una partita completa e le invarianti del motore.

## Funzioni

- Campo proporzionato a 105 × 68, 22 giocatori numerati, portieri e palla con scia.
- Passaggi, recuperi, tiri, gol, statistiche e cronaca generati dalla simulazione.
- Pausa (anche con Spazio), velocità 0.5× / 1× / 2× / 4× e riavvio.
- Mentalità e pressing dei Bianchi; selezione di un giocatore cliccando sul pallino.
- Due tempi con cambio campo automatico. Un secondo reale equivale a 12 secondi di partita a velocità 1×.

## Struttura e limiti

`engine.mjs` gestisce lo stato della simulazione, indipendente dall’interfaccia. `app.mjs` disegna il campo su Canvas e collega i controlli; `style.css` definisce l’interfaccia. `server.mjs` serve i file per lo sviluppo locale.

È una dimostrazione della vista partita, non ancora un motore calcistico realistico: passaggi e tiri usano probabilità semplificate; non sono implementati falli, fuorigioco, rimesse, sostituzioni, attributi individuali o campionati. Il possesso misura il tempo di controllo simulato. I portieri sono giallo e azzurro per distinguerli.
