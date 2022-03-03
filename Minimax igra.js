
let brojBiljaka=function(svet){
    let rez=0;
    let nizBiljaka=[];
    for(let i in svet.source.cards)
    {
       //if biljka
       nizBiljaka.push(svet.source.cards[i])

    }
    return nizBiljaka;
}
let preziveceKisu=function(biljka,daniDoKise){
 switch(biljka.id){
     // dodati daniDoKise + trenZalivenost
    case 3: 
    if(daniDoKise<=2)
    {
        return false;
    }
    else
    return true;
 
    case 4:
        if(daniDoKise<=2)
        {
            return false;
        }
        else
        return true;
        
case 5:
    if(daniDoKise<=5)
        {
            return false;
        }
        else
        return true;
case 6: if(daniDoKise==1) return false
else return true;

}

let izaberiNajboljeTilove=function(svet)
{
    let zlato=svet.source.gold;
    let nizPoljaZaKupovinu=[];
    if(zlato<5000 ){ return nizPoljaZaKupovinu}
    if(zlato  )
}
    
}
let narednoStanje = function (cvor, potez, igrac) {
    let svet = { ...cvor };
    let biljke=brojBiljaka(svet);

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
         for(let i=0;i<svet.source.tiles.length;i++) {
             if(!svet.source.tiles[i].bIsPlanted && biljke.length>0)
             {
                 svet.source.tiles[i].bIsPlanted=true;
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
        for(let i=0;i<biljke.length; i++)
        {
            if(!biljke[i].isHarvestable && preziveceKisu(biljke[i],svet.source.daniDoKise))
            {
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