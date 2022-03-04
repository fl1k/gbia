import { Action, InputAction, actionType } from "./actions.mjs";
import { Plant } from "./plant.mjs";
import { cardId } from "./card.mjs";
import { tileOwner } from "./tile.mjs";
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
Akcija.brojacptren = 1;
Akcija.odrediAkciju = function (akcije, svet) {
    let maxbitnost = -1;
    let maxakcija = "cards";
    console.log("Potez: " + svet.turn);
    for (let i in akcije) {
        let bitnost = Akcija.izracunajBitnost(akcije[i], svet);
        console.log(i + ": " + bitnost);
        if (bitnost > maxbitnost) {
            maxakcija = i;
            maxbitnost = bitnost;
        }
    }
    console.log("______________________________")
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
            necuBuyLand: function (svet) {
                return 1 - Akcija.izracunajBitnost(Akcija.akcije["buyLand"], svet);
            },
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

                let pare = svet.source.gold;
                let kolicinacveca = 0;
                for (let i in svet.source.tiles) {
                    if (!svet.source.tiles[i].bIsPlanted) {
                        kolicinacveca++;
                    }
                }
                let poccvece = kolicinacveca;
                let brojtulipa = 0;
                let brojkrokusa = 0;
                let brojbluejazzova = 0;
                let brojanemona = 0;
                let daniDoKise = svet.daysTillRain;
                if (daniDoKise == 2 || daniDoKise == 3) { //Kasnije mozda mozemo da se izbulkujemo u cvecu da ne moramo jos da idemo u shop;
                    let brojbluejazzova = Math.min(kolicinacveca, Math.floor(pare / 500));
                    pare -= brojbluejazzova * 500;
                    kolicinacveca -= brojbluejazzova;

                    return (brojtulipa * 4200 + brojkrokusa * 3000 + brojbluejazzova * 1600 + brojanemona * 1100) / (4200 * poccvece) / 0.66;
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
                    return (brojtulipa * 4200 + brojkrokusa * 3000 + brojbluejazzova * 1600 + brojanemona * 1100) / (4200 * poccvece)
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
            let fertkarta = 0;
            if (daniDoKise == 3) {
                for (let i in svet.source.cards) {
                    if (svet.source.cards[i].cardId == cardId.mole) {
                        if (svet.source.cards[i].owned >= 1) {
                            let nep = svet.tiles.filter(e => e.owner == tileOwner.enemy);
                            if (nep.length > 0) {
                                let nepzute = nep.filter(e => e.bIsSpecial);
                                let cilj;
                                if (nepzute.length >= 1) {
                                    cilj = nepzute[0];
                                }
                                else {
                                    cilj = nep[0];
                                }
                                return new InputAction(actionType.sendMole, [
                                    new Action(cilj.x, cilj.y, 0, 1)
                                ]);
                            }
                        }
                    }
                }
            }
            else if (daniDoKise == 2) { //Kasnije mozda mozemo da se izbulkujemo u cvecu da ne moramo jos da idemo u shop;
                let brojbluejazzova = Math.min(kolicinacveca, Math.floor(pare / 500));
                pare -= brojbluejazzova * 500;
                kolicinacveca -= brojbluejazzova;
                console.log("UZETI JAZZOVI");
                return new InputAction(actionType.buyCards, [
                    new Action(0, 0, 4, brojbluejazzova),
                ]);
            }
            else {
                brojtulipa = Math.min(kolicinacveca, Math.floor(pare / 3800));//Dok nemamo puno kesa;
                pare -= brojtulipa * 3800;
                kolicinacveca -= brojtulipa;
                brojkrokusa = Math.min(kolicinacveca, Math.floor(pare / 2000));
                pare -= brojkrokusa * 2000;
                kolicinacveca -= brojkrokusa;
                brojbluejazzova = Math.min(kolicinacveca, Math.floor(pare / 900));
                pare -= brojbluejazzova * 2000;
                kolicinacveca -= brojbluejazzova;
            }
            let krtice = 0;
            let fertovi = 0;
            if (pare > 600000) {
                let varr = Math.floor(pare / 600000);
                brojtulipa += varr * 128;
                pare -= 128 * 3800;
                brojbluejazzova += 80;
                pare -= 80 * 900;
            }
            if (pare > 100000) {
                let kolicina = 1;
                krtice = 2 * kolicina;
            }
            console.log("UZETI TULIPI");
            return new InputAction(actionType.buyCards, [
                new Action(0, 0, 0, (brojtulipa + 5 * brojkrokusa + 2 * brojbluejazzova + 2 * brojanemona)),
                new Action(0, 0, 6, brojtulipa),
                new Action(0, 0, 5, brojkrokusa),
                new Action(0, 0, 4, brojbluejazzova),
                new Action(0, 0, 3, brojanemona),
                new Action(0, 0, 1, krtice),
                new Action(0, 0, 2, fertovi),
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
            },
            brojSlobodnih: function (svet) {
                return svet.source.tiles.filter(e => !e.bIsPlanted).length / svet.source.tiles.length;
            }

        },
        komanda: function (svet) {
            let zlatni = [];
            let normalni = [];
            let nasitajlovi = svet.source.tiles;
            let nasiresursi = svet.source.cards;
            let brojtulipa = 0;
            let brojkrokusa = 0;
            let brojbluejazzova = 0;
            let brojanemona = 0;

            for (let i in nasiresursi) {
                if ((nasiresursi[i].cardId) == 3) {
                    brojanemona += nasiresursi[i].owned;
                }
                if ((nasiresursi[i].cardId) == 4) {
                    brojbluejazzova += nasiresursi[i].owned;
                }
                if ((nasiresursi[i].cardId) == 5) {
                    brojkrokusa += nasiresursi[i].owned;
                }
                if ((nasiresursi[i].cardId) == 6) {
                    brojtulipa += nasiresursi[i].owned;
                }
            }
            for (let i in nasitajlovi) {
                if (!nasitajlovi[i].bIsPlanted) {
                    if (nasitajlovi[i].bIsSpecial) {
                        zlatni.push(nasitajlovi[i]);
                    }
                    else {
                        normalni.push(nasitajlovi[i]);
                    }
                }
            }
            let nizinstrukcija = [];
            while (zlatni.length > 0 || normalni.length > 0) {
                let trenz;
                if (zlatni.length > 0) {
                    trenz = zlatni.pop();
                }
                else {
                    trenz = normalni.pop();
                }
                if (brojtulipa > 0 && svet.daysTillRain > 2) {
                    nizinstrukcija.push(new Action(trenz.x, trenz.y, 6, 1));
                    brojtulipa--;
                }
                else if (brojkrokusa > 0) {
                    nizinstrukcija.push(new Action(trenz.x, trenz.y, 5, 1));
                    brojkrokusa--;
                }
                else if (brojbluejazzova > 0) {
                    nizinstrukcija.push(new Action(trenz.x, trenz.y, 4, 1));
                    brojbluejazzova--;
                }
                else if (brojanemona > 0) {
                    nizinstrukcija.push(new Action(trenz.x, trenz.y, 3, 1));
                    brojanemona--;
                }
            }
            return new InputAction(actionType.plant, nizinstrukcija);
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
                let brPlantovanih = 0;
                let potrebanBrojVode = 0;
                let brojslobodnihtajlova = brojtajlova;
                let zalicu = [];
                for (let i in nasitajlovi) {
                    if (nasitajlovi[i].bIsPlanted)
                        if (nasitajlovi[i].bIsPlanted && !nasitajlovi[i].plant.waterNeeded == 0) {
                            if (svet.daysTillRain > 1 && nasitajlovi[i].waterNeeded != 2) {
                                brojnezalivenogcveca++;
                                potrebanBrojVode += nasitajlovi[i].waterNeeded;
                            }
                        }
                        else if (!nasitajlovi[i].bIsPlanted) {
                            brojslobodnihtajlova++;
                        }

                }
                let util = brojnezalivenogcveca / (brojtajlova);
                //provera da li ima vode mozda?
                console.log("UTIL JE " + util);
                return util;

            },
            imamoVodu: function (svet) {//0 ako nemamo, mozda 0.6 ako imamo da kao zelimo da istrosimo to sto imamo
                let nasitajlovi = svet.source.tiles;
                let potrebanBrojVode = 0;
                let brojnezalivenogcveca = 0;
                for (let i in nasitajlovi) {
                    if (nasitajlovi[i].bIsPlanted && !nasitajlovi[i].plant.waterNeeded == 0) {
                        if (svet.daysTillRain > 1 && nasitajlovi[i].plant.waterNeeded != 2) {
                            brojnezalivenogcveca++;
                            potrebanBrojVode += nasitajlovi[i].plant.waterNeeded;
                        }
                    }
                }
                let brVode = svet.source.getCardCount(cardId.water);
                if (potrebanBrojVode <= brVode) {
                    return 1;
                }
                else {
                    return brVode / potrebanBrojVode;
                }
            }
        },
        komanda: function (svet) {
            let nasitajlovi = svet.source.tiles;
            let brojnezalivenogcveca = 0;
            let potrebanBrojVode = 0;
            let zalicu = [];
            let nizInstrukcija = [];
            for (let i in nasitajlovi) {
                if (nasitajlovi[i].bIsPlanted && !nasitajlovi[i].plant.waterNeeded == 0) {

                    if (svet.daysTillRain > 1 && nasitajlovi[i].waterNeeded != 2) {
                        brojnezalivenogcveca++;
                        potrebanBrojVode += nasitajlovi[i].waterNeeded;
                        zalicu.push(nasitajlovi[i])
                        nizInstrukcija.push(new Action(nasitajlovi[i].x, nasitajlovi[i].y, 0, nasitajlovi[i].plant.waterNeeded))
                    }
                }


            }
            return (new InputAction(actionType.watering, nizInstrukcija));
        }
    },
    harvest: {
        parametri: {
            procenatBiljakaSpremnihZaHarvest: function (svet) {
                let nasitajlovi = svet.source.tiles;
                let brojtajlova = nasitajlovi.length;
                let brojnezalivenogcveca = 0;
                let brojslobodnihtajlova = brojtajlova;
                let brojspremnogcveca = 0;
                for (let i in nasitajlovi) {
                    if (nasitajlovi[i].bIsPlanted) {
                        if (nasitajlovi[i].plant.waterNeeded == 0 || nasitajlovi[i].plant.goldWorth == 0) {
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
            return new InputAction(actionType.harvest, []);
        }
    },
    fertilizer: {
        parametri: {
            neceKisaJosDugo: function (svet) {
                if (svet.daysTillRain < 3) {
                    return 0;
                }
                return 1;
            },
            koristim: function (svet) {
                if (svet.source.getCardCount(cardId.fertilizer) > 1)
                    return 1;
                else
                    if (svet.source.getCardCount(cardId.fertilizer) == 1) {
                        return 0.2;
                    }
                return 0;
            },
            profitabilnost: function (svet) {
                let tiles = svet.source.tiles;
                let potencijalniProfit = 0
                for (let i = 0; i < tiles.length; i++) {
                    if (tiles[i].bIsPlanted && tiles[i].plant.goldWorth > 0) {
                        if (tiles[i].plant.daysToRot >= 1) {
                            if (tiles[i].bIsSpecial) {
                                potencijalniProfit += tiles[i].plant.getWorth()
                            }
                            potencijalniProfit += tiles[i].plant.getWorth()
                        }
                    }
                }
                return potencijalniProfit > 5000;
            },
            imamoKes: function (svet) {
                if (svet.source.gold > 50000) {
                    if (svet.source.gold > 100000)
                        return 1;
                    else return svet.source.gold / 100000;
                }
            }

        },
        komanda: function (svet) {
            return (new InputAction(actionType.fertilizer, [new Action((0, 1))]));
        }
    },
    buyLand: {
        parametri: {//zuta blizu, ima kesa(ne radi ovo ako nema), profitabilno (ima ostatak za kasniju ekspanziju, mozda ako se isplati za 4 poteza, ili 8 ako je puno para)
            blizinaZutih: function (svet) {
                let nasaPolja = svet.source.tiles;
                let zutaPolja = svet.tiles.filter(tile => tile.bIsSpecial);
                let min = 10000;
                let najboljePolje = {};
                for (let i = 0; i < nasaPolja.length; i++) {

                    let trenGledano = nasaPolja[i];
                    for (let j = 0; j < zutaPolja.length; j++) {
                        if (Math.max(Math.abs(trenGledano.x - zutaPolja[j].x), Math.abs(trenGledano.y - zutaPolja[j].y)) < min) {
                            min = Math.max(Math.abs(trenGledano.x - zutaPolja[j].x), Math.abs(trenGledano.y - zutaPolja[j].y));
                            najboljePolje = trenGledano;
                        }
                    }

                }
                return min == 10000 ? 1 : (1 - min / 8);
            },
            profitabilnost: function (svet) {//0 ako nemamo para
                let pare = svet.source.gold;
                if (pare < 5000) return 0;
                if (svet.tiles.filter(e => e.owner == tileOwner.none).length == 0) return 0;
                let cenacveta = 0;
                let plodnostcveta = 0;
                if (svet.daysTillRain == 3) {
                    //jazzovi
                    cenacveta = 500;
                    plodnostcveta = 2500;

                }
                else {
                    //tullipi
                    cenacveta = 3800;
                    plodnostcveta = 8000;
                }
                let maxbrojmogucih = Math.floor(pare / 5000);
                let brojslobodnihtajlova = 0;
                let multiplier = 0;
                for (let i in svet.source.tiles) {
                    if (!svet.source.tiles[i].bIsPlanted) {
                        brojslobodnihtajlova++;
                    }
                }
                let trenmaxcveca = Math.min(Math.floor(pare / cenacveta), brojslobodnihtajlova);
                let maxcveca = -1;
                for (let i = 1; i <= maxbrojmogucih; i++) {
                    pare -= 5000;
                    brojslobodnihtajlova++;
                    let amaxcveca = Math.min(Math.floor(pare / cenacveta), brojslobodnihtajlova);
                    if (amaxcveca > maxcveca) {
                        maxcveca = amaxcveca;
                    }
                }
                if (maxcveca > trenmaxcveca) {
                    return 1;
                }
                else {
                    return 0.2;
                }
            }
        },
        komanda: function (svet) {
            console.log("KUPUJEM ZEMLJU");
            let pare = svet.source.gold;
            let cenacveta = 0;
            let plodnostcveta = 0;
            let brojslobodnihtajlova = 0;
            if (svet.daysTillRain == 3) {
                //jazzovi
                cenacveta = 500;
                plodnostcveta = 2500;

            }
            else {
                //tullipi
                cenacveta = 3800;
                plodnostcveta = 8000;
            }
            for (let i in svet.source.tiles) {
                if (!svet.source.tiles[i].bIsPlanted) {
                    brojslobodnihtajlova++;
                }
            }
            let brojneosvojenih = svet.tiles.filter(e => e.owner == tileOwner.none).length;
            console.log(brojneosvojenih);
            let maxbrojmogucih = Math.min(Math.floor(pare / 5000), brojneosvojenih);
            console.log(maxbrojmogucih);
            let multiplier = 0;
            let trenmaxcveca = Math.min(Math.floor(pare / cenacveta), brojslobodnihtajlova);
            let maxcveca = -1;
            let brojtzakupovinu = 0;
            for (let i = 1; i <= maxbrojmogucih; i++) {
                pare -= 5000;
                brojslobodnihtajlova++;
                let amaxcveca = Math.min(Math.floor(pare / cenacveta), brojslobodnihtajlova);
                if (amaxcveca > maxcveca) {
                    brojtzakupovinu = i;
                    maxcveca = amaxcveca;
                }
            }
            console.log("kup: ");
            console.log(brojtzakupovinu);
            let nasaPolja = [...svet.source.tiles];
            let novapolja = [];
            let zutaPolja = svet.tiles.filter(tile => tile.bIsSpecial).filter(tile => tile.owner == tileOwner.none);
            if (zutaPolja.length == 0) {
                console.log("ZUTA NULA ");
                let pomocnanovapolja = [];
                while (novapolja.length < brojtzakupovinu) {
                    pomocnanovapolja = svet.source.getAllNearbyTiles();
                    novapolja = [...novapolja, ...pomocnanovapolja];
                    if (novapolja.length < brojtzakupovinu) {
                        svet.source.tiles = [...svet.source.tiles, ...pomocnanovapolja];
                        pomocnanovapolja = [];
                    }
                }
                novapolja = novapolja.slice(0, brojtzakupovinu);
                if (novapolja.length == 0) {
                    console.log("ZELIM HARVEST");
                    return new InputAction(actionType.harvest, []);
                }
                else {
                    let stilizovananovapolja = [];
                    for (let i in novapolja) {
                        stilizovananovapolja.push(new Action(novapolja[i].x, novapolja[i].y, 0, 1));
                    }
                    console.log(stilizovananovapolja);
                    return new InputAction(actionType.buyLand, stilizovananovapolja);
                }
            }
            for (let i = 0; i < brojtzakupovinu; i++) {
                let noviniz = [...nasaPolja, ...novapolja];
                let min = 10000;
                let najboljePolje = {};
                let najboljeZuto = {};
                for (let j in noviniz) {
                    for (let k in zutaPolja) {
                        if (Math.max(Math.abs(noviniz[j].x - zutaPolja[k].x), Math.abs(noviniz[j].y - zutaPolja[k].y)) < min) {
                            min = Math.max(Math.abs(noviniz[j].x - zutaPolja[k].x), Math.abs(noviniz[j].y - zutaPolja[k].y));
                            najboljePolje = noviniz[j];
                            najboljeZuto = zutaPolja[k];
                        }
                    }
                }
                let tx = najboljePolje.x;
                let ty = najboljePolje.y;
                if (najboljePolje.x < najboljeZuto.x) {
                    tx++;
                }
                else if (najboljePolje.x > najboljeZuto.x) {
                    tx--;
                }
                if (najboljePolje.y < najboljeZuto.y) {
                    ty++;
                }
                else if (najboljePolje.y > najboljeZuto.y) {
                    ty--;
                }
                let dodatozuto = null;
                for (let j in zutaPolja) {
                    if (zutaPolja[j].x == tx && zutaPolja[j].y == ty) {
                        dodatozuto = zutaPolja[j];
                    }
                }
                if (dodatozuto) {
                    novapolja.push(dodatozuto);
                    dodatozuto.owner = tileOwner.local;
                    zutaPolja = zutaPolja.filter(tile => tile.owner == tileOwner.none);
                }
                else {
                    novapolja.push(svet.getTile(tx, ty));
                }
            }
            let stilizovananovapolja = [];
            for (let i in novapolja) {
                if (novapolja[i])
                    stilizovananovapolja.push(new Action(novapolja[i].x, novapolja[i].y, 0, 1));
            }
            return new InputAction(actionType.buyLand, stilizovananovapolja);
        }
    },
    mole: {//Zivotni vek naseg, da stignemo da zalijemo, stanje protivnikovih para u odnosu na nase, mozda je preop i treba sto pre, mozda nekad umesto kupovine
        parametri: {
            imamoKrticu: function (svet) {//0 ako nemamo krticu, malo ako umiru
                if (svet.source.getCardCount(cardId.mole) > 0)
                    return 1;
                else return 0;
            },
            imaNeprijateljskih: function (svet) {
                return (svet.tiles.filter(e => e.owner == tileOwner.enemy).length > 0) ? 0.99 : 0
            },
            isplatiSe: function (svet) {
                return 1 - svet.tiles.filter(e => e.owner == tileOwner.none) / 64;
                /*let susedi = svet.source.getAllNearbyTiles();
                let c = 0;
                let min = 5;
                for (let i = 0; i < susedi.length; i++) {
                    if (susedi[i].owner == tileOwner.enemy) {
                        c++;
                        if (susedi[i].bIsSpecial) {
                            c++;
                        }
                        if (susedi[i].bIsPlanted) {
                            c++;
                        }
                        if (c < min) { min = c; }
                    }
                    //moze da se tvikuje na agresiju
                    return min / 3;
                }
                return 0;*/
            }
        },
        komanda: function (svet) {
            let nep = svet.tiles.filter(e => e.owner == tileOwner.enemy);
            let nepzute = nep.filter(e => e.bIsSpecial);
            let cilj;
            if (nepzute.length >= 1) {
                cilj = nepzute[0];
            }
            else {
                cilj = nep[0];
            }
            return new InputAction(actionType.sendMole, [
                new Action(cilj.x, cilj.y, 0, 1)
            ]);
            /*let susedi = svet.source.getAllNearbyTiles();
            let c = 0;
            let min = 5;
            let zaNapad = {};
            for (let i = 0; i < susedi.length; i++) {
                if (susedi[i].owner == tileOwner.enemy) {
                    c++;
                    if (susedi[i].bIsSpecial) {
                        c++;
                    }
                    if (susedi[i].bIsPlanted) {
                        c++;
                    }
                    if (c < min) { min = c; zaNapad = susedi[i] }
                }

            }
            return (new InputAction(actionType.sendMole, [new Action(zaNapad.x, zaNapad.y)]));*/
        }
    },
}