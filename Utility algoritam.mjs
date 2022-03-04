import { Action, InputAction, actionType } from "./actions.mjs";

export const Akcija = {};

Akcija.proslaAkcija = null;
Akcija.predveAkcije = null;

Akcija.izracunajBitnost = function (akcija, svet) {
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
Akcija.odrediAkciju = function (akcije, svet) {
    let maxbitnost = -1;
    let maxakcija = "cards";
    for (let i in akcije) {
        let bitnost = Akcija.izracunajBitnost(akcije[i], svet);
        if (bitnost > maxbitnost) {
            maxakcija = i;
            maxbitnost = akcije[maxakcija];
        }
    }
    let zeljenaAkcija = akcije[maxakcija];
    Akcija.predveAkcije = Akcija.proslaAkcija;
    Akcija.proslaAkcija = maxakcija;
    //Transformacija zeljene akcije, izvrsava?
    return zeljenaAkcija.komanda(svet);
    //return new InputAction(actionType.buyCards, [new Action(0, 0, 0, 1)]);
    //MOZDA TREBA SAMO DA SE RETURNUJE MAXAKCIJA
}
Akcija.akcije = {
    cards: {
        parametri: {
            manjakResursa: function (svet) { //Manjak resursa u odnosu na kes
                let pare = svet.source.gold;
                if (pare < 500) return 0;
                let nasitajlovi = svet.source.tiles;
                let nasiresursi = svet.source.cards;
                let brojtajlova = nasitajlovi.length;
                let brojSemena = 0;
                for (let i in nasiresursi) {
                    if ((nasiresursi[i].cardId) > 2) {
                        brojSemena += nasiresursi[i].owned;
                    }
                }
                let brojMogucegCveca = 0;
                if (svet.daysTillRain == 3) {
                    brojMogucegCveca = Math.floor(pare / 500);
                }
                else {
                    brojMogucegCveca = Math.floor(pare / 900);
                }
                let brojslobodnihtajlova = brojtajlova;
                for (let i in nasitajlovi) {
                    if (nasitajlovi[i].bIsPlanted) {
                        brojslobodnihtajlova--;
                    }
                }
                brojMogucegCveca = Math.min(brojMogucegCveca, brojslobodnihtajlova);
                let util = brojMogucegCveca / (brojSemena + brojMogucegCveca + (brojtajlova - brojslobodnihtajlova));
                return util;
            },
            profitabilnost: function (svet) {
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
                let daniDoKise = svet.daysTillRain;
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
                else {
                    if (nasePare % (3600 + 200) > 500) {
                        return (Math.floor((nasePare / 3800) * 7800) + ((nasePare % 3800))) / brNasihTajlova * 7800;

                    }
                    return (Math.floor((nasePare / 3800) * 7800)) / brNasihTajlova * 7800;
                }


            }
            /*zeljaZaKrticom: function (svet) {//Mozda je dovoljan prvi utility, mozda ovo previse daje prednost krtici
                return 1;
            }*/

        },
        komanda: function (svet) {
            //vraca ono sto treba da posaljemo?
            //Odredi ono sto treba da kupimo, uz cvece kupujemo vodu (mozda manje ako mozemo da iskoristimo kisu)
            let pare = svet.source.gold;
            let kolicinacveca = 0;
            for (let i in svet.source.tiles) {
                if (!svet.source.tiles[i].bIsPlanted) {
                    kolicinacveca++;
                }
            }
            let brojtulipa = 0;
            let brojkrokusa = 0;
            let brojbluejazzova = 0;
            let brojanemona = 0;
            let daniDoKise = svet.daysTillRain;
            if (daniDoKise == 3) { //Kasnije mozda mozemo da se izbulkujemo u cvecu da ne moramo jos da idemo u shop;
                let brojbluejazzova = Math.min(kolicinacveca, Math.floor(pare / 500));
                pare -= brojbluejazzova * 500;
                kolicinacveca -= brojbluejazzova;
            }
            else {
                let brojtulipa = Math.min(kolicinacveca, Math.floor(pare / 3800));//Dok nemamo puno kesa;
                pare -= brojtulipa * 3800;
                kolicinacveca -= brojtulipa;
                let brojkrokusa = Math.min(kolicinacveca, Math.floor(pare / 2000));
                pare -= brojkrokusa * 2000;
                kolicinacveca -= brojkrokusa;
                let brojbluejazzova = Math.min(kolicinacveca, Math.floor(pare / 900));
                pare -= brojbluejazzova * 2000;
                kolicinacveca -= brojbluejazzova;
            }
            return new InputAction(actionType.buyCards, [
                new Action(0, 0, 0, 200 * (brojtulipa + 5 * brojkrokusa + 2 * brojbluejazzova + 2 * brojanemona)),
                new Action(0, 0, 6, brojtulipa),
                new Action(0, 0, 5, brojkrokusa),
                new Action(0, 0, 4, brojbluejazzova),
                new Action(0, 0, 3, brojanemona),
            ]);
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
            /*procenatCvecaKojePrezivljavaKisu = function (svet) {

            },*/
            kolicinaSemenja: function (svet) { //Koliko imamo semena u odnosu na slobodnu zemlju
                let nasitajlovi = svet.source.tiles;
                let nasiresursi = svet.source.cards;
                let brojtajlova = nasitajlovi.length;
                let brojSemena = 0;
                for (let i in nasiresursi) {
                    if ((nasiresursi[i].cardId) > 2) {
                        brojSemena += nasiresursi[i].owned;
                    }
                }
                let util = Math.min(1, brojSemena / (brojtajlova));
                return util;
            }

        },
        komanda: function (svet) {
            return {};
        }
    },
    watering: {
        parametri: {//zivotni vek biljaka
            /*plantProsli: function (svet) {//Mozda da zamenimo sa manjkom semenja
                return Action.proslaAkcija == "planting" ? 0.95 : (Action.predveAkcije == "planting" ? 0.55 : 0.2);
            },
            nijeWaterProsli: function (svet) {
                return Action.proslaAkcija == "watering" ? 0.05 : (Action.predveAkcije == "watering" ? 0.1 : 0.6);
            },*/
            /*manjakSemenja: function (svet) {
                return 0.5;
            },*///MOZDA NEKA PROFITABILNOST
            biljkamaPotrebnaVoda: function (svet) {//Da li je potrebno zalivati, i kisa utice na ovo
                let nasitajlovi = svet.source.tiles;
                let brojtajlova = nasitajlovi.length;
                let brojnezalivenogcveca = 0;
                let brojslobodnihtajlova = brojtajlova;
                for (let i in nasitajlovi) {
                    if (nasitajlovi[i].bIsPlanted) {
                        brojslobodnihtajlova--;
                    }
                    if (nasitajlovi[i].plantDTO.waterNeeded > 0) {
                        if (!(svet.daysTillRain <= 1 && nasitajlovi[i].plantDTO.waterNeeded <= 2)) {
                            brojnezalivenogcveca++;
                        }
                    }
                }
                let util = brojnezalivenogcveca / (brojtajlova - brojslobodnihtajlova);
                //provera da li ima vode mozda?
                return util;
            },
            /*imamoVodu: function (svet) {//0 ako nemamo, mozda 0.6 ako imamo da kao zelimo da istrosimo to sto imamo
                return 0.5;
            }*/
        },
        komanda: function (svet) {
            return {};
        }
    },
    harvest: {
        parametri: {
            procenatBiljakaSpremnihZaHarvest: function (svet) {//Ili neki odnos procenta
                let nasitajlovi = svet.source.tiles;
                let brojtajlova = nasitajlovi.length;
                let brojnezalivenogcveca = 0;
                let brojslobodnihtajlova = brojtajlova;
                let brojspremnogcveca = 0;
                for (let i in nasitajlovi) {
                    if (nasitajlovi[i].bIsPlanted) {
                        if (nasitajlovi[i].plantDTO.waterNeeded == 0) {
                            brojspremnogcveca++;
                        }
                        brojslobodnihtajlova--;
                    }
                }
                return brojspremnogcveca / (brojtajlova - brojslobodnihtajlova);
            }/*,
            spremneBiljkeKojeUskoroUmiru: function (svet) {
                return 0.1;
            }*/
        },
        komanda: function (svet) {
            return {};
        }
    },
    fertilizer: {//profitabilno, imamo fertilizer
        parametri: {
            profitabilnost: function (svet) { //0 alp nemamo, Koliko cemo potencijalno da imamo posle harvesta, 0.95 ako je bas profitabilno
                return 0.1;
            },
            /*imamofertilizer: function (svet) {//0 ako nemamo, 0,6 ako imamo da kao zelimo da ga koristimo

            }*/
        },
        komanda: function (svet) {
            return {};
        }
    },
    buyLand: {
        parametri: {//zuta blizu, ima kesa(ne radi ovo ako nema), profitabilno (ima ostatak za kasniju ekspanziju, mozda ako se isplati za 4 poteza, ili 8 ako je puno para)
            blizinaZutih: function (svet) {
                return 0.1;
            },
            profitabilnost: function (svet) {//0 ako nemamo para
                return 0.1;
            }
        },
        komanda: function (svet) {
            return {};
        }
    },
    mole: {//Zivotni vek naseg, da stignemo da zalijemo, stanje protivnikovih para u odnosu na nase, mozda je preop i treba sto pre, mozda nekad umesto kupovine
        parametri: {
            zivotniVekCveca: function (svet) {//0 ako nemamo krticu, malo ako umiru
                return 0.1;
            }

        },
        komanda: function (svet) {
            return {};
        }
    },
}