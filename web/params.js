let scaleIsActive = true;
let linksIsActive = false;
let colorIsActive = false;
let nbinputShape = 2;

/**
* Récupère les paramètres cochés dans l'onglet Params et calcule le nombre de
* zones de classification nécessaires en conséquence.
*/
function checkActiveParams() {

    if (document.getElementById('scaleParam').className == 'is-selected')
        scaleIsActive = true;
    else scaleIsActive = false;

    if (document.getElementById('linkParam').className == 'is-selected')
        linksIsActive = true;
    else linksIsActive = false;

    if (document.getElementById('colorParam').className == 'is-selected')
        colorIsActive = true;
    else colorIsActive = false;

    console.log("Activation des params :")
    console.log(scaleIsActive);
    console.log(linksIsActive);
    console.log(colorIsActive);

    nbinputShape = computeNbinputShape();

    textToUser("Nouveaux paramètres enregistrés");

    nbZones = setNbZones();
    setNbZonesXY();
}

/**
* Calcule la taille de l'entrée du réseau neuronal en fonction des paramètres
* actifs
*/
function computeNbinputShape() {
    res = 0;
    if (scaleIsActive) {
        res += 2;
    }
    if (linksIsActive) {
        res += 1;
    }
    if (colorIsActive) {
        res += 3;
    }
    return res;
}


/**
* Génère un tenseur représentant le rectangles dont les caractéristiques sont
* données en arguments en fonction des paramètres actifs pour l'apprentissage
*/
function generateTensorFor1Square(l, h, colorSquare, link) {
    res = [];

    if (scaleIsActive) {
        append(res, l);
        append(res, h);
    }
    if (linksIsActive) {
        append(res, link / 10);
    }
    if (colorIsActive) {
        append(res, colorSquare[0] / 255);
        append(res, colorSquare[1] / 255);
        append(res, colorSquare[2] / 255);
    }

    return tf.tensor2d(res, [1, nbinputShape]);
}

/**
* Génère un tenseur représentant les données pour tous les rectangles en
* fonction des paramètres actifs pour l'apprentissage
*/
function generateTensorForAllSquare() {
    res = [];

    for (j = 0; j < all_squares_learn.zoneLearn.length; j++) {
        if (scaleIsActive) {
            append(res, all_squares_learn.squareLearn[j * 2]);
            append(res, all_squares_learn.squareLearn[j * 2 + 1]);
        }
        if (linksIsActive) {
            append(res, all_squares_learn.linksLearn[j] / 10);
        }
        if (colorIsActive) {
            //console.log(all_squares_learn.colorLearn[j]);
            append(res, all_squares_learn.colorLearn[j][0] / 255);
            append(res, all_squares_learn.colorLearn[j][1] / 255);
            append(res, all_squares_learn.colorLearn[j][2] / 255);
        }
    }

    return tf.tensor2d(res, [all_squares_learn.zoneLearn.length, nbinputShape]);
}


/**
* Retourne le numéro zone correspondant à un rectangle en fonction de ses caractéristiques
* @param {int} height la hauteur du rectangle
* @param {int} width la largeur du rectangle
* @param {int[]} color valeurs RGB de la couleur du rectangle
* @param {int} nbLinks le nombre de liens associé au rectangle
*/
function expectedZone(height, width, color, nblinks){
  if (scaleIsActive && !colorIsActive && !linksIsActive) return expectedZoneScale(height, width);
  else if (!scaleIsActive && colorIsActive && !linksIsActive) return expectedZoneColor(height, width, color);
  else if (scaleIsActive && colorIsActive && !linksIsActive) return expectedZoneScaleColor(color);
  else if (!scaleIsActive && !colorIsActive && linksIsActive) return expectedZoneLinks(nblinks);
  else if (scaleIsActive && !colorIsActive && linksIsActive) return expectedZoneScaleLinks(height, width, nblinks);
  else if (!scaleIsActive && colorIsActive && linksIsActive) return expectedZoneColorLinks(color, nblinks);
  //Si tous les params sont actifs, le nb de liens prend l'avantage sur la taille
  else if (scaleIsActive && colorIsActive && linksIsActive) return expectedZoneColorLinks(color, nblinks);
 }


/**
* Retourne le numéro zone correspondant à un rectangle en fonction de ses caractéristiques
* dans le cas où le seule paramètre actif est la taille
* @param {int} height la hauteur du rectangle
* @param {int} width la largeur du rectangle
*/
function expectedZoneScale(height, width) {
    let area = height * width;
    if (area > areaLimit) return 0;
    else return 1;
}

/**
* Retourne le numéro zone correspondant à un rectangle en fonction de ses caractéristiques
* dans le cas où le seule paramètre actif est le nombre de liens
* @param {int} nbLinks le nombre de liens associé au rectangle
*/
function expectedZoneLinks(nblinks){
    if (nblinks>links_max){
        return 0;
    }
    else return 1;
}

/**
* Retourne le numéro zone correspondant à un rectangle en fonction de ses caractéristiques
* dans le cas où le seule paramètre actif est la couleur
* @param {int[]} color valeurs RGB de la couleur du rectangle
*/
function expectedZoneColor(color) {
    let area = height * width;
    let condFuchsia = (color[0] == 249 && color[1] == 132 && color[2] == 239);
    let condUltraPink = (color[0] == 255 && color[1] == 111 && color[2] == 255);
    let condPalePink = (color[0] == 250 && color[1] == 218 && color[2] == 221);
    let condBanana = (color[0] == 255 && color[1] == 255 && color[2] == 0);
    let condDandelion = (color[0] == 240 && color[1] == 225 && color[2] == 48);
    let condSunset = (color[0] == 253 && color[1] == 94 && color[2] == 83);
    let condPink = condFuchsia || condUltraPink || condPalePink;
    let condOrange = condBanana || condDandelion || condSunset;
    if (condPink) {
        return 0;
    } else if (condOrange) {
        return 1;
    } else {
        return 2;
    }
}

function expectedZoneScaleColor(height, width, color) {
    let area = height * width;
    let condFuchsia = (color[0] == 249 && color[1] == 132 && color[2] == 239);
    let condUltraPink = (color[0] == 255 && color[1] == 111 && color[2] == 255);
    let condPalePink = (color[0] == 250 && color[1] == 218 && color[2] == 221);
    let condBanana = (color[0] == 255 && color[1] == 255 && color[2] == 0);
    let condDandelion = (color[0] == 240 && color[1] == 225 && color[2] == 48);
    let condSunset = (color[0] == 253 && color[1] == 94 && color[2] == 83);
    let condPink = condFuchsia || condUltraPink || condPalePink;
    let condOrange = condBanana || condDandelion || condSunset;
    if (condPink) {
        //console.log("PINK ...");
        if (area > areaLimit) return 0;
        else return 1;

    } else if (condOrange) {
        //console.log("YELLOW OR ORANGE ...");
        if (area > areaLimit) return 2;
        else return 3;

    } else {
        //console.log("BLUE OR GREEN ...");
        if (area > areaLimit) return 4;
        else return 5;
    }
}


function expectedZoneScaleLinks(height, width, nblinks){
  let area = height * width;
  if (nblinks>links_max) {
      if (area > areaLimit) return 0; //grand rectangle avec bcp de liens
      else return 2; //petit rectangle avec bcp de liens

  } else {
      if (area > areaLimit) return 1;  //grand rectangle avec peu de liens
      else return 3;  //petit rectangle avec peu de liens

  }
}


function expectedZoneColorLinks(color, nblinks){
  let area = height * width;
  let condFuchsia = (color[0] == 249 && color[1] == 132 && color[2] == 239);
  let condUltraPink = (color[0] == 255 && color[1] == 111 && color[2] == 255);
  let condPalePink = (color[0] == 250 && color[1] == 218 && color[2] == 221);
  let condBanana = (color[0] == 255 && color[1] == 255 && color[2] == 0);
  let condDandelion = (color[0] == 240 && color[1] == 225 && color[2] == 48);
  let condSunset = (color[0] == 253 && color[1] == 94 && color[2] == 83);
  let condPink = condFuchsia || condUltraPink || condPalePink;
  let condOrange = condBanana || condDandelion || condSunset;
  if (condPink) {
      if (nblinks > links_max) return 0;
      else return 1;

  } else if (condOrange) {
      if (nblinks > links_max) return 2;
      else return 3;

  } else {
      if (nblinks > links_max) return 4;
      else return 5;
  }
}

function vectorFromExpectedZone(zoneExpected) {
    let res = [] //construit un vecteur de la forme [0,0,1,0,0,0] pour représenter les zones possibles
    for (let i = 0; i < nbZones; i++) {
        if (i == zoneExpected) res.push(1);
        else res.push(0);
    }
    return res;
}
