
let brojBiljaka = function (svet) {
    let rez = 0;
    let nizBiljaka = [];
    for (let i in svet.source.cards) {
        //if biljka
        nizBiljaka.push(svet.source.cards[i])

    }
    return nizBiljaka;
}
let profitabilnost = function (svet) {
    let nasePare = svet.source.gold;
    //koje cvece je najbolje
    let brNasihTajlova = 0;
    for (let i = 0; i < svet.source.tiles.length; i++) {
        if (svet.source.tiles[i].bIsSpecial) {
            brNasihTajlova += 2;
        }
        else
            brNasihTajlova++;
    }
    svoCvece = svet.cvece;
    let c1 = 0;
    let c2 = 0;
    let c3 = 0;
    let c4 = 0;
    let daniDoKise = svet.daniDoKise;
    if (daniDoKise <= 3) {
        c4 = 0;
        if (daniDoKise == 3) {
            c2 = (nasePare / (500));
            c2 *= 2000;
        }
        if (c2 > 1)
            return 1
        else
            return c2 / (brNasihTajlova * (8000 - 3600 - 200) / 0.66);

    }
    else
    {
        if(nasePare%(3600+200)>500)
        {
            return (Math.floor((nasePare / 3600) * 7800)+((nasePare%3600)+200 )) / brNasihTajlova * 7800;

        }
        return (Math.floor((nasePare / 3600) * 7800)) / brNasihTajlova * 7800;
    }


}


  



}
let kolicinaSemenja = function () {
    let brojBiljaka = brojBiljaka(svet).length;
    let brojNasih = svet.source.tiles;
    return 1 - brojNasih / brojBiljaka;
}
//br biljaka u odnosu na slobodnu zemlju
let razdaljinaOdZutog = function () {
    let nasaPolja = svet.source.tiles;
    let zutaPolja = svet.source.zuta;
    let min = 10000;
    najboljePolje = {};
    for (let i = 0; i < nasaPolja.length; i++) {

        let trenGledano = nasaPolja[i];
        for (let j = 0; j < zutaPolja.length; j++) {
            if ((Math.abs(trenGledano.x - zutaPolja[j].x) + Math.abs(trenGledano.y - zutaPolja[j].y)) < min) {
                min = Math.abs(trenGledano.x - zutaPolja[j].x) + Math.abs(trenGledano.y - zutaPolja[j].y);
                najboljePolje = trenGledano;
            }
        }

    }
    return (1 - min / 8);
}




let preziveceKisu = function (biljka, daniDoKise) {
    switch (biljka.id) {
        // dodati daniDoKise + trenZalivenost
        case 3:
            if (daniDoKise <= 2) {
                return false;
            }
            else
                return true;

        case 4:
            if (daniDoKise <= 2) {
                return false;
            }
            else
                return true;

        case 5:
            if (daniDoKise <= 5) {
                return false;
            }
            else
                return true;
        case 6: if (daniDoKise == 1) return false
        else return true;
    }
}

let izaberiNajboljeTilove = function (svet) {
    let zlato = svet.source.gold;
    let nizPoljaZaKupovinu = [];
    let nizMogucihPolja = world.moguca;
    if (zlato < 5000) { return nizPoljaZaKupovinu }
    else {

    }

}


let narednoStanje = function (cvor, potez, igrac) {
    let svet = { ...cvor };
    let biljke = brojBiljaka(svet);

    if (potez == 0) {//Cards
        if (igrac) {
            //MiniUtility
        }
        else {
            //MiniUtility
        }
    }
    if (potez == 1) {//Planting
        if (igrac) {
            for (let i = 0; i < svet.source.tiles.length; i++) {
                if (!svet.source.tiles[i].bIsPlanted && biljke.length > 0) {
                    svet.source.tiles[i].bIsPlanted = true;
                    // stavjamo biljku na polje;
                    biljke.shift();
                }
            }
        }
        else {

        }
    }
    if (potez == 2) {//Watering
        if (igrac) {
            for (let i = 0; i < biljke.length; i++) {
                if (!biljke[i].isHarvestable && preziveceKisu(biljke[i], svet.source.daniDoKise)) {
                    //zalij biljku u svetu
                }
            }
        }
        else {

        }
    }
    if (potez == 3) {//Harvest
        if (igrac) {
            // samo ranuj harvest
        }
        else {

        }
    }
    if (potez == 4) {//Fertilizer
        if (igrac) {
            //samo ranuj fertilizer
        }
        else {

        }
    }
    if (potez == 5) {//BuyLand
        if (igrac) {

        }
        else {

        }
    }
    if (potez == 6) {//ActivateMole
        if (igrac) {

        }
        else {

        }
    }

}