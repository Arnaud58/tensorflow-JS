/**
 * Fonction qui ajoute aux tableau à prédire la séléction de l'utilisateur
 */

function predictFromUser() {
    let lgr = parseInt(select("#largeur").value());
    let htr = parseInt(select("#hauteur").value());

    predictAndDisplay(lgr, htr);
}

/**
 * Retourne vrai si on a affaire à un grand rectangle et false sinon
 * @param {int} l La largeur du rectangle
 * @param {int} h La hauteur du rectangle
 */
function predictLH(l, h) {
    if (h * l > areaLimit) {
        return true;
    }
    return false;
}



/**
* Retourne le numéro de la zone obtenue en résultat en fonction du tableau retourné
* par le réseau neuronal
* @param {float[int]} resArray le tableau contenant les résultats retournés par TensorFlow
* @return le numéro de la zone correpondante
*/
function checkResZone(resArray){
  let res = 0;
  let maxValue = 0;
  for (let i = 0; i<6; i++){
    if (resArray[i]>maxValue) {
      maxValue = resArray[i];
      res = i;
    }
  }
  return res;
}

/**
 * Prédit les donnée d'apprentisage (all_squares_learn.squareLearn)
 * et les affiches sur la partie droite du canvas
 * donne un % de réussite des prédictions
 */
function predictTheTests() {
    let cpt = 0;
    let correctTest = 0;
    resetPredict();

    // Parcourt tous les carré de la partie apprentissage et les prédict
    for (i = 0; i < all_squares_learn.posLearn.length; i += 1) {
        let res = predictAndDisplay(
            all_squares_learn.squareLearn[i * 2] * 390 + 10,
            all_squares_learn.squareLearn[i * 2 + 1] * 390 + 10,
            all_squares_learn.colorLearn[i],
            all_squares_learn.linksLearn[i]
        );

        if (res[1]) {
            correctTest++;
        }
        cpt++;
    }

    // Affiche le % de réussite
    select("#percentSuccess").html(parseInt((correctTest / cpt) * 10000) / 100 + "%");
    console.warn("Correct : " + parseInt((correctTest / cpt) * 10000) / 100 + "%");
    textToUser("Réussite de : " + parseInt((correctTest / cpt) * 10000) / 100 + "%");
}

/**
 * Predie le rectangle donné en paramètre
 * Renvoie le résultat de la prédiction (voir  model.predict()) et si la prédiction est corrécte ou mauvaise
 * @param {int} lgr La largeur du rectangle
 * @param {int} htr La hauteur du rectangle
 * @returns {[array,boolean]} Le tableau contient un tableau qui représente le tensor de la prédiction, le boolen vaux Vrai si la prédiction est mauvaise et Faux sinon
 */
function predictAndDisplay(lgr, htr, color, link) {
    // Si la hauteur et la largeur n'es pas bonne, ne rien faire et alerter
    if (lgr > 400 || htr > 400 || lgr < 10 || htr < 10) {
        console.error("Largeur et hauteur doivent être entre 10 et 400");
        return;
    }

    // Predict en donnant la largeur et la hauteur normalisé
    // tensorRes = model.predict(tf.variable(tf.tensor2d([
    //     [(lgr - 10) / 390, (htr - 10) / 390]
    // ], [1, 2])));
    tensorRes = model.predict(tf.variable(generateTensorFor1Square((lgr - 10) / 390, (htr - 10) / 390, color, link)));
    // generateTensorFor1Square(lgr, htr)

    // The result of the prediction in an Array
    let res = Array.from(tensorRes.dataSync());
    // Say if the prediction correspond to the reality
    let isCorrect = false;

    // Rajoute le carré a prédire dans les carré à affiché
    all_squares_display.predictSquare.push({ l: lgr, h: htr });

    // Lui donne une couleur en fonction de si il est bien placé où non
    let resZone = checkResZone(res);
    console.log(resZone);
    all_squares_display["zonePredict"].push(resZone);
    if (resZone==expectedZone(htr, lgr, color)){
      isCorrect = true;
      all_squares_display["colorPredict"].push({ r: 0, g: 255, b: 0 });
    }else{
      all_squares_display["colorPredict"].push({ r: 255, g: 0, b: 0 });
      isCorrect = false;
    }
    /*
    if (res[0] > 0.5) {
        if (predictLH(lgr, htr)) {
            all_squares_display["colorPredict"].push({ r: 0, g: 255, b: 0 });
            isCorrect = true;
        } else { all_squares_display["colorPredict"].push({ r: 255, g: 0, b: 0 }); }

        all_squares_display["posPredict"].push("Haut");
    } else {
        if (!predictLH(lgr, htr)) {
            all_squares_display["colorPredict"].push({ r: 0, g: 255, b: 0 });
            isCorrect = true;
        } else { all_squares_display["colorPredict"].push({ r: 255, g: 0, b: 0 }); }

        all_squares_display["posPredict"].push("Bas");
    }
    */

    // Log et retourne le résultat
    //tensorRes.print();
    //console.log(isCorrect);
    return [res, isCorrect];
}

function loadAndPredict(ev) {
    let contents = JSON.parse(decodeURIComponent(ev.target.result));
    let cpt = 0;
    let correctTest = 0;
    resetPredict();
    console.log(contents);

    // Parcourt tous les carré de la partie apprentisage et les prédict
    for (i = 0; i < contents.squareLearn.length; i += 2) {
        let res = predictAndDisplay(contents.squareLearn[i] * 390 + 10, contents.squareLearn[i + 1] * 390 + 10);
        if (res[1]) {
            correctTest++;
        }
        cpt++;
    }

    // Affiche le % de réussite
    select("#percentSuccess").html(parseInt((correctTest / cpt) * 10000) / 100 + "%");
    console.warn("Correct : " + parseInt((correctTest / cpt) * 10000) / 100 + "%");
    textToUser("Réussite de : " + parseInt((correctTest / cpt) * 10000) / 100 + "%");
}
