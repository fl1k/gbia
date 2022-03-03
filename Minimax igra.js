let minimax = function (cvor, dubina, alfa, beta) {
    if (dubina == 9) {
        return cvor.igrac.poeni - cvor.neprijatelj.poeni;
    }
    if (dubina % 2 == 0) {
        trenmax = -100000000;
        let deca = decaCvora(cvor, true);
        let maxdete = null;
        for (let i in deca) {
            let vred = minimax(deca[i], dubina + 1, alfa, beta);
            if (vred >= trenmax) {
                trenmax = vred;
                maxdete = i;
            }
            alfa = Math.max(alfa, vred);
            if (beta <= alfa)
                break;
        }
    }
    if (dubina % 2 == 1) {
        trenmin = 100000000;
        let deca = decaCvora(cvor, false);
        for (let i in deca) {

        }
    }
}
let narednoStanje = function (cvor, potez, igrac) {
    let svet = { ...cvor };

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

        }
        else {

        }
    }
    if (potez == 2) {//Watering
        if (igrac) {

        }
        else {

        }
    }
    if (potez == 3) {//Harvest
        if (igrac) {

        }
        else {

        }
    }
    if (potez == 4) {//Fertilizer
        if (igrac) {

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