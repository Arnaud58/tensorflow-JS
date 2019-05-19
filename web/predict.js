let dataConfusion;

/**
 * Fonction qui ajoute aux tableau à prédire la séléction de l'utilisateur
 */
function predictFromUser() {
    let lgr = parseInt(select("#largeur").value());
    let htr = parseInt(select("#hauteur").value());
    let col = allColors[parseInt(select("#couleur").value())];
    let links = parseInt(select("#nblinks").value());
    console.log(col);

    predictAndDisplay(lgr, htr, col, links);
}


/**
 * Retourne le numéro de la zone obtenue en résultat en fonction du tableau retourné
 * par le réseau neuronal
 * @param {float[]} resArray le tableau contenant les résultats retournés par TensorFlow
 * @return le numéro de la zone correpondante
 */
function checkResZone(resArray) {
    let res = 0;
    let maxValue = 0;
    for (let i = 0; i < nbZones; i++) {
        if (resArray[i] > maxValue) {
            maxValue = resArray[i];
            res = i;
        }
    }
    return res;
}

/**
 * Prédit les donnée d'apprentisage (all_squares_learn.squareLearn)
 * et les affiches sur la partie droite du canvas
 * Donne un % de réussite des prédictions
 */
function predictTheTests() {
    console.warn("Prediction !")
    let cpt = 0;
    let correctTest = 0;
    let rows = 1;
    let cols = 1;
    let value = [];

    dataConfusion = [];

    if (scaleIsActive) {
        rows *= 2;
        cols *= 2;
        value.push(0);
        value.push(0);
    }
    if (colorIsActive) {
        rows *= 3;
        cols *= 3;
        value.push(0);
        value.push(0);
        value.push(0);
    }
    if (linksIsActive) {
        rows *= 2;
        cols *= 2;
        value.push(0);
        value.push(0);
    }


    for (i = 0; i < rows; i++) {
        dataConfusion.push(value.slice());
    }

    resetPredict();

    // Parcourt tous les carrés de la partie apprentissage et les prédit
    for (i = 0; i < all_squares_display.squareCoord.length; i += 1) {
        predictAndDisplay(
            all_squares_display.squareCoord[i].l,
            all_squares_display.squareCoord[i].h,
            all_squares_display.color[i],
            all_squares_display.links[i],
            i
        );
    }
}

/**
 * Predie le rectangle donné en paramètre
 * Renvoie le résultat de la prédiction (voir  model.predict()) et si la prédiction est corrécte ou mauvaise
 * @param {int} lgr La largeur du rectangle
 * @param {int} htr La hauteur du rectangle
 * @param {int[]} color tableau contenant les valeurs RGB de la couleur
 * @param {int} link nombre de liens associé au rectangle
 * @param {int} index index du rectangle prédir dans all_squares_display (none ou -1 si ne vient pas de all_squares_display)
 * @returns {Array[]} Le tableau contient un tableau qui représente le tensor de la prédiction et un boolen, le boolen vaux Vrai si la prédiction est mauvaise et Faux sinon
 */
function predictAndDisplay(lgr, htr, color, link, index) {
    // Si la hauteur et la largeur n'es pas bonne, ne rien faire et alerter
    if (lgr > 400 || htr > 400 || lgr < 10 || htr < 10) {
        console.error("Largeur et hauteur doivent être entre 10 et 400");
        return;
    }

    // Predict en donnant les valeurs normalisées
    tensorRes = model.predict(tf.variable(generateTensorFor1Square((lgr - 10) / 390, (htr - 10) / 390, color, link)));
    // generateTensorFor1Square(lgr, htr)

    //On met le résultat de la prédiction dans un Array
    let res = Array.from(tensorRes.dataSync());
    console.log(res, tensorRes);

    if (index !== null && index != -1) {
        all_squares_display.pos[i].x = (res[0] * 390) + 10;
        all_squares_display.pos[i].y = (res[1] * 390) + 10;
    }
}

/**
 * Charge un fichier JSON et fait la prédiction sur les données qu'il contient
 */
function loadAndPredict(ev) {
    let contents = JSON.parse(decodeURIComponent(ev.target.result));
    console.log(contents);
    let cpt = 0;
    let correctTest = 0;
    resetPredict();

    //MATRICE CONFUSION
    let rows = 1;
    let cols = 1;
    let value = [];
    dataConfusion = [];

    if (scaleIsActive) {
        rows *= 2;
        cols *= 2;
        value.push(0);
        value.push(0);
    }
    if (colorIsActive) {
        rows *= 3;
        cols *= 3;
        value.push(0);
        value.push(0);
        value.push(0);
    }
    if (linksIsActive) {
        rows *= 2;
        cols *= 2;
        value.push(0);
        value.push(0);
    }


    for (i = 0; i < rows; i++) {
        dataConfusion.push(value.slice());
    }

    // Parcourt tous les carrés de la partie apprentisage et les prédit
    for (i = 0; i < contents.squareLearn.length; i += 2) {
        let res = predictAndDisplay(contents.squareLearn[i] * 390 + 10, contents.squareLearn[i + 1] * 390 + 10, contents.colorLearn[i / 2], contents.linksLearn[i / 2]);
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