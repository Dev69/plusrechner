class FragenDefinition {
    constructor(zahl1, zahl2, ant1, ant2, ant3) {
        this.zahl1 = zahl1;
        this.zahl2 = zahl2;
        this.falsch = [ant1, ant2, ant3]
    }
}

class Frage {
    constructor(zahl1, zahl2, ant1, ant2, ant3, ant4) {
        let number = Math.floor(Math.random() * 2) + 1;
        if (number === 1) {
            this.zahl1 = zahl1;
            this.zahl2 = zahl2;
        }
        else {
            this.zahl1 = zahl2;
            this.zahl2 = zahl1;
        }
        this.ergebnis = zahl1 + zahl2;
        let antworten = [ant1, ant2, ant3, ant4];
        for (let i = 0; i < antworten.length; i++) {
            let pos1 = Math.floor(Math.random() * 4);
            let pos2 = Math.floor(Math.random() * 4);
            let temp = antworten[pos1];
            antworten[pos1] = antworten[pos2];
            antworten[pos2] = temp;
        }
        this.ant1 = antworten[0];
        this.ant2 = antworten[1];
        this.ant3 = antworten[2];
        this.ant4 = antworten[3];
    }

    getNrderRichtenAntwort() {
        if (this.ergebnis === this.ant1) {
            return 1;
        }
        if (this.ergebnis === this.ant2) {
            return 2;
        }
        if (this.ergebnis === this.ant3) {
            return 3;
        }
        if (this.ergebnis === this.ant4) {
            return 4;
        }
    }
}

class Spiel {
    constructor(fragendefinitionen, punktziel) {
        this.punkteziel = punktziel;
        this.aktuellePunktzahl = 0;
        this.fragendefinitionen = fragendefinitionen;
        this.aktuelleDefinitionen = [];
        this.Frage = null;
        this.Spielstart = null;
        this.Spielende = null;
    }

    resetSpiel() {
        this.aktuelleDefinitionen = [];
        this.aktuellePunktzahl = 0;
        this.Frage = null;
    }

    starteSpiel() {
        this.aktuellePunktzahl = 0;
        this.aktuelleDefinitionen = this.fragendefinitionen.slice(0);
        this.Frage = this.generiereNeueFrage();
        this.Spielstart = new Date();
    }

    generiereNeueFrage() {
        const defNummer = Math.floor(Math.random() * this.aktuelleDefinitionen.length);
        let defFrage = this.aktuelleDefinitionen[defNummer];

        let frage = new Frage(
            defFrage.zahl2,
            defFrage.zahl1,
            defFrage.falsch[0],
            defFrage.falsch[1],
            defFrage.falsch[2],
            defFrage.zahl2 + defFrage.zahl1);
        this.aktuelleDefinitionen.splice(defNummer, 1);
        if (this.aktuelleDefinitionen.length === 0) {
            this.aktuelleDefinitionen = this.fragendefinitionen.slice(0);
        }
        return frage;
    }

    beantworteFrage(antwortNr) {
       let erg = false;
        if (this.Frage.getNrderRichtenAntwort() === antwortNr) {
            erg = true;
            this.aktuellePunktzahl += 1;
        }
        this.Frage = this.generiereNeueFrage();
        if (this.isSpielFertig())
            this.Spielende = new Date();
        return erg;
    }

    isSpielFertig(){
        return this.punkteziel ===this.aktuellePunktzahl;
    }


    getSpielFortschrittInProzent() {
        return Math.round(this.aktuellePunktzahl / this.punkteziel * 100);
    }

    getSpielDauer(){
        let endzeit = new Date();
        if (this.Spielende == null){
            endzeit = this.Spielende;
        }
        let millisec = endzeit.getTime() - this.Spielstart.getTime();
        return Math.round((millisec) / 10) / 100;
    }
}

class UI {
    constructor() {
        this.uistartbutton = document.querySelector('#startbutton');
        this.uinochmalbutton = document.querySelector('#nochmalbutton');
        this.uistartview = document.querySelector('#startview');
        this.uifrageview = document.querySelector('#frageview');
        this.uiendview = document.querySelector('#endview');
        this.uifehlerview = document.querySelector('#fehlerview');
        this.uiprogressbar = document.querySelector("#progress");
        this.uizahl1 = document.querySelector('#zahl1');
        this.uizahl2 = document.querySelector('#zahl2');
        this.uiantwort1 = document.querySelector('#btn1');
        this.uiantwort2 = document.querySelector('#btn2');
        this.uiantwort3 = document.querySelector('#btn3');
        this.uiantwort4 = document.querySelector('#btn4');
        this.uizeitverbrauch = document.querySelector('#zeitverbrauch');
        this.audioOk = new Audio("ButtonClick.mp3");
        this.audioOk.loop = false;
        this.audioFalsch = new Audio("Fehler.mp3");
        this.audioFalsch.loop = false;
     }

    showStartPage() {
        this.uistartview.style.display = "block";
        this.uifrageview.style.display = "none";
        this.uifehlerview.style.display = "none";
        this.uiendview.style.display = "none";
    }

    showFrage(frage) {
        this.uistartview.style.display = "none";
        this.uifrageview.style.display = "block";
        this.uifehlerview.style.display = "none";
        this.uiendview.style.display = "none";
        this.uizahl1.innerHTML = `${frage.zahl1}`;
        this.uizahl2.innerHTML = `${frage.zahl2}`;
        this.uiantwort1.innerHTML = `${frage.ant1}`;
        this.uiantwort2.innerHTML = `${frage.ant2}`;
        this.uiantwort3.innerHTML = `${frage.ant3}`;
        this.uiantwort4.innerHTML = `${frage.ant4}`;
    }

    showFehler(){
        this.uistartview.style.display = "none";
        this.uifrageview.style.display = "none";
        this.uifehlerview.style.display = "block";
        this.uiendview.style.display = "none";
    }

    showEnde(zeit) {
        this.uistartview.style.display = "none";
        this.uifrageview.style.display = "none";
        this.uifehlerview.style.display = "none";
        this.uiendview.style.display = "block";
        this.uizeitverbrauch.innerHTML = `${zeit} Sekunden`;
    }

    setprogress(prozent) {
        this.uiprogressbar.style.width = prozent + '%';
    }

    playOk(){
        this.audioOk.play();
    }

    playFalsch(){
        this.audioFalsch.play();
    }

}


class Controller {
    constructor(spiel, ui) {
        this.spiel = spiel;
        this.ui = ui;
        this.ui.uistartbutton.addEventListener("click", () => {
            this.starteSpiel();
        });
        this.ui.uinochmalbutton.addEventListener("click", () => {
            this.starteSpiel();
        });
        this.ui.uiantwort1.addEventListener("click", () => {
            this.antworte(1);

        });
        this.ui.uiantwort2.addEventListener("click", () => {
            this.antworte(2);
        });
        this.ui.uiantwort3.addEventListener("click", () => {
            this.antworte(3);
        });
        this.ui.uiantwort4.addEventListener("click", () => {
            this.antworte(4);
        });
    };

    reset() {
        this.spiel.resetSpiel();
        this.ui.showStartPage();
    }

    starteSpiel() {
        this.spiel.starteSpiel();
        ui.showFrage(this.spiel.Frage);
        ui.setprogress(this.spiel.getSpielFortschrittInProzent());
    };

    weiterImSpiel(){
        if (this.spiel.isSpielFertig()) {
            ui.showEnde(spiel.getSpielDauer());
        }
        else{
            ui.setprogress(this.spiel.getSpielFortschrittInProzent());
            ui.showFrage(this.spiel.Frage);
        }
    }

    antworte(antwortnr) {
        let erg = this.spiel.beantworteFrage(antwortnr);
        if (!erg) {
            ui.playFalsch();
            ui.showFehler();
            setTimeout( () => {this.weiterImSpiel();}, 3000);
        }
        else
        {
            ui.playOk();
            this.weiterImSpiel();
        }
    };

}

let fragendefinitionen = [

    new FragenDefinition(1, 1, 1, 3, 4),
    new FragenDefinition(1, 2, 2, 4, 5),
    new FragenDefinition(1, 3, 3, 5, 6),
    new FragenDefinition(1, 4, 4, 6, 7),
    new FragenDefinition(1, 5, 5, 7, 8),
    new FragenDefinition(1, 6, 6, 8, 9),
    new FragenDefinition(1, 7, 7, 9, 10),
    new FragenDefinition(1, 8, 8, 10, 11),
    new FragenDefinition(1, 9, 9, 11, 12),

    new FragenDefinition(2, 2, 3, 5, 6),
    new FragenDefinition(2, 3, 4, 6, 7),
    new FragenDefinition(2, 4, 5, 7, 9),
    new FragenDefinition(2, 5, 8, 8, 10),
    new FragenDefinition(2, 6, 7, 9, 10),
    new FragenDefinition(2, 7, 8, 10, 11),
    new FragenDefinition(2, 8, 9, 11, 12),
    new FragenDefinition(2, 9, 10, 12, 13),

    new FragenDefinition(3, 3, 5, 7, 8),
    new FragenDefinition(3, 4, 6, 8, 9),
    new FragenDefinition(3, 5, 7, 9, 10),
    new FragenDefinition(3, 6, 8, 10, 11),
    new FragenDefinition(3, 7, 9, 11, 12),
    new FragenDefinition(3, 8, 10, 12, 13),
    new FragenDefinition(3, 9, 11, 13, 14),

    new FragenDefinition(4, 4, 7, 9, 10),
    new FragenDefinition(4, 5, 8, 10, 11),
    new FragenDefinition(4, 6, 9, 11, 12),
    new FragenDefinition(4, 7, 10, 12, 13),
    new FragenDefinition(4, 8, 11, 13, 14),
    new FragenDefinition(4, 9, 12, 14, 15),

    new FragenDefinition(5, 5, 8, 9, 11),
    new FragenDefinition(5, 6, 9, 10, 12),
    new FragenDefinition(5, 7, 10, 11, 13),
    new FragenDefinition(5, 8, 11, 12, 14),
    new FragenDefinition(5, 9, 12, 13, 15),

    new FragenDefinition(6, 6, 10, 11, 13),
    new FragenDefinition(6, 7, 11, 12, 14),
    new FragenDefinition(6, 8, 12, 13, 15),
    new FragenDefinition(6, 9, 13, 14, 16),

    new FragenDefinition(7, 7, 13, 15, 16),
    new FragenDefinition(7, 8, 14, 16, 17),
    new FragenDefinition(7, 9, 15, 17, 18),

    new FragenDefinition(8, 8, 15, 17, 18),
    new FragenDefinition(8, 9, 16, 18, 19),

    new FragenDefinition(9, 9, 16, 17, 19),

];

const spiel = new Spiel(fragendefinitionen, 10);
const ui = new UI();
const controller = new Controller(spiel, ui);
controller.reset();

