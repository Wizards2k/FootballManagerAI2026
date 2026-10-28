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

### Scala della vista 2D

La scala è isotropa: un metro ha lo stesso numero di pixel su entrambi gli assi e tutti gli oggetti usano questa conversione anche a schermo intero. Il riferimento disegnato sotto il campo misura 10 metri. Il campo resta 105 × 68 m, come raccomandato nelle [linee guida FIFA](https://inside.fifa.com/innovation/stadium-guidelines/technical-guidelines/stadiums-guidelines/pitch-dimensions-and-surrounding-areas). Le gare internazionali ammettono 100–110 × 64–75 m secondo la [Regola 1 IFAB](https://theifab.com/laws/latest/the-field-of-play/).

Il corpo del giocatore è un pallino di diametro 0,65 m: un'approssimazione grafica dell'ingombro visto dall'alto, non una misura regolamentare né la sua altezza. Il pallone usa circonferenza 0,69 m (diametro circa 0,22 m), nel range 0,68–0,70 m della [Regola 2 IFAB](https://theifab.com/laws/latest/the-ball/). Le linee sono larghe 0,12 m. La profondità della rete è illustrativa.

Numeri interni compaiono solo quando c'è spazio per leggerli; il controllo Nomi e la selezione mostrano sempre numero e ruolo. Etichette e anelli di selezione sono indicatori dell'interfaccia e non rappresentano le dimensioni fisiche del giocatore. La selezione mantiene un'area di clic più ampia per facilitare l'uso.

`engine.mjs` gestisce lo stato della simulazione, indipendente dall’interfaccia. `app.mjs` disegna il campo su Canvas e collega i controlli; `style.css` definisce l’interfaccia. `server.mjs` serve i file per lo sviluppo locale.

È una dimostrazione della vista partita, non ancora un motore calcistico realistico: passaggi e tiri usano probabilità semplificate; non sono implementati falli, fuorigioco, rimesse, sostituzioni, attributi individuali o campionati. Il possesso misura il tempo di controllo simulato. I portieri sono giallo e azzurro per distinguerli.
