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
- Due tempi con cambio campo automatico. A velocità 1× un secondo reale corrisponde a un secondo di partita; 2× e 4× accelerano insieme tempo e movimento.
- Vista ampia iniziale con più spazio al campo; il pulsante Vista compatta ripristina la disposizione con pannelli laterali.

## Struttura e limiti

La vista usa le proporzioni grafiche dei riferimenti forniti: il diametro esterno del pallino è circa l'1,52% della lunghezza del campo, il pallone poco più di un terzo del pallino. Numeri, ombre, bordi e anelli di selezione sono stati adeguati. Queste dimensioni rappresentano simboli tattici leggibili, non l'ingombro fisico di una persona. Le proporzioni restano costanti al variare delle dimensioni del canvas e in modalità a schermo intero.

La taratura del ritmo prende come riferimento visivo il [filmato FM20 indicato](https://www.youtube.com/watch?v=oA9qHqJCuuk), senza pretendere di riprodurne esattamente il motore. Le impostazioni `TEMPO` in `engine.mjs` definiscono corsa 5,8 unità/s, conduzione 4,8, passaggi 17 e tiri 25. Accelerazione limitata e frenata in prossimità della destinazione rendono più graduali cambi di direzione e arresti. Il pallone percorre il passaggio a velocità costante verso il ricevente; la durata dei tiri dipende dalla distanza. Il terreno usa un disegno a scacchi e il campo ha margini più ridotti nella vista ampia.

`engine.mjs` gestisce lo stato della simulazione, indipendente dall’interfaccia. `app.mjs` disegna il campo su Canvas e collega i controlli; `style.css` definisce l’interfaccia. `server.mjs` serve i file per lo sviluppo locale.

È una dimostrazione della vista partita, non ancora un motore calcistico realistico: passaggi e tiri usano probabilità semplificate; non sono implementati falli, fuorigioco, rimesse, sostituzioni, attributi individuali o campionati. Il possesso misura il tempo di controllo simulato. I portieri sono giallo e azzurro per distinguerli.
