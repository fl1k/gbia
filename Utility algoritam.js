export const Action = {};

Action.proslaAkcija = null;
Action.predveAkcije = null;

Action.izracunajBitnost = function (akcija, svet) {
    let utilityji = [];
    for (let i in akcija.parametri) {
        utilityji.push(akcija.parametri[i](svet));
    }
    let alfa = 1.0 - 1.0 / utilityji.length;
    let proizvod = 1.0;
    for (let i in utilityji) {
        let beta = (1 - utilityji[i]) * alfa;
        proizvod *= utilityji[i] + beta * utilityji[i];
    }
    return proizvod;
}
Action.odrediAkciju = function (akcije, svet) {
    let maxbitnost = -1;
    let maxakcija = "cards";
    for (let i in akcije) {
        let bitnost = Action.izracunajBitnost(akcije[i], svet);
        if (bitnost > maxbitnost) {
            maxakcija = i;
            maxbitnost = akcije[maxakcija];
        }
    }
    let zeljenaAkcija = maxakcija;
    Action.predveAkcije = Action.proslaAkcija;
    Action.proslaAkcija = maxakcija;
    //Transformacija zeljene akcije, izvrsava?
    return zeljenaAkcija.komanda(svet);
    //MOZDA TREBA SAMO DA SE RETURNUJE MAXAKCIJA
}
Action.akcije = {
    cards: {
        parametri: {
            manjakResursa: function (svet) { //Manjak resursa u odnosu na kes
                return 0.1;
            },
            zeljaZaKrticom: function (svet) {//Mozda je dovoljan prvi utility, mozda ovo previse daje prednost krtici
                return 0.1;
            }

        },
        komanda: function (svet) {
            //vraca ono sto treba da posaljemo?
            //Odredi ono sto treba da kupimo, uz cvece kupujemo vodu (mozda manje ako mozemo da iskoristimo kisu)
            //Odredimo mini utility za stvari koje kupujemo
            return {};
        }
    },
    planting: {
        parametri: {
            /*shopProsli: function (svet) {//Mozda da zamenimo sa posedovanjem resursa
                return Action.proslaAkcija == "cards" ? 0.9 : (Action.predveAkcije == "cards" ? 0.5 : 0.2);
            },
            nijePlantProsli: function (svet) {//MOzda da zamenimo sa slobodnim platformama za sadjenje, mozda onda da ubacimo odnos onih koje su slobodne i onih koje posedujemo
                return Action.proslaAkcija == "planting" ? 0.05 : (Action.predveAkcije == "planting" ? 0.1 : 0.6);
            },*/
            kolicinaSemenja: function (svet) { //Koliko imamo semena u odnosu na slobodnu zemlju
                return 0.1;
            },
            odnosSlobodneZemlje: function (svet) {
                return 0.1;
            },
            profitabilnost: function (svet) { //Koliko cemo potencijalno da imamo posle harvesta
                return 0.1;
            }

        },
        komanda: function (svet) {
            return {};
        }
    },
    watering: {
        parametri: {
            /*plantProsli: function (svet) {//Mozda da zamenimo sa manjkom semenja
                return Action.proslaAkcija == "planting" ? 0.95 : (Action.predveAkcije == "planting" ? 0.55 : 0.2);
            },
            nijeWaterProsli: function (svet) {
                return Action.proslaAkcija == "watering" ? 0.05 : (Action.predveAkcije == "watering" ? 0.1 : 0.6);
            },*/
            manjakSemenja: function (svet) {
                return 0.1;
            },
            profitabilnost: function (svet) { //Koliko cemo potencijalno da imamo posle harvesta
                return 0.1;
            },
            biljkamaPotrebnaVoda: function (svet) {//Da li je potrebno zalivati, i kisa utice na ovo
                return 0.1;
            }
        },
        komanda: function (svet) {
            return {};
        }
    },
    harvest: {
        parametri: {
            procenatBiljakaSpremnihZaHarvest: function (svet) {
                return 0.1;
            },
            spremneBiljkeKojeUskoroUmiru: function (svet) {
                return 0.1;
            }
        },
        komanda: function (svet) {
            return {};
        }
    },
    fertilizer: {//profitabilno, imamo fertilizer
        parametri: {

        },
        komanda: function (svet) {

        }
    },
    buyLand: {
        parametri: {//zuta blizu, ima kesa(ne radi ovo ako nema), profitabilno (ima ostatak za kasniju ekspanziju, mozda ako se isplati za 4 poteza, ili 8 ako je puno para)

        },
        komanda: function (svet) {

        }
    },
    mole: {//Zivotni vek naseg, da stignemo da zalijemo, stanje protivnikovih para u odnosu na nase, mozda je preop i treba sto pre, mozda nekad umesto kupovine
        parametri: {

        },
        komanda: function (svet) {

        }
    },
}