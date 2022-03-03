let minimax = function (cvor, dubina, alfa, beta) { //Vraca id akcije koju trebamo da uradimo
    if (dubina == 9) {
        return cvor.igrac.poeni - cvor.neprijatelj.poeni;
    }
    if (dubina % 2 == 0) {
        trenmax = -100000000;
        let maxdete = 0;
        for (let i = 0; i < 7; i++) {
            let vred = minimax(narednoStanje(cvor, i, true), dubina + 1, alfa, beta);
            if (vred >= trenmax) {
                trenmax = vred;
                maxdete = i;
            }
            alfa = Math.max(alfa, vred);
            if (beta <= alfa)
                break;
        }
        if (dubina == 0) return maxdete;
        else return trenmax;
    }
    if (dubina % 2 == 1) {
        trenmin = 100000000;
        let mindete = 0;
        for (let i = 0; i < 7; i++) {
            let vred = minimax(narednoStanje(cvor, i, false), dubina + 1, alfa, beta);
            if (vred <= trenmin) {
                trenmin = vred;
                mindete = i;
            }
            beta = Math.min(beta, vred);
            if (beta <= alfa)
                break;
        }
        return trenmin;
    }
}