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

La vista usa le proporzioni grafiche del riferimento orizzontale fornito: il diametro esterno del pallino è circa l'1,52% della lunghezza del campo (14 px su un campo lungo 920 px), il pallone circa un terzo del pallino. Numeri, ombre e anelli di selezione sono stati adeguati. Queste dimensioni rappresentano simboli tattici leggibili, non l'ingombro fisico di una persona. Le proporzioni restano costanti al variare delle dimensioni del canvas e in modalità a schermo intero.

`engine.mjs` gestisce lo stato della simulazione, indipendente dall’interfaccia. `app.mjs` disegna il campo su Canvas e collega i controlli; `style.css` definisce l’interfaccia. `server.mjs` serve i file per lo sviluppo locale.

È una dimostrazione della vista partita, non ancora un motore calcistico realistico: passaggi e tiri usano probabilità semplificate; non sono implementati falli, fuorigioco, rimesse, sostituzioni, attributi individuali o campionati. Il possesso misura il tempo di controllo simulato. I portieri sono giallo e azzurro per distinguerli.
