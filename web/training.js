let xs, ys;
let oldHistory;

/**
 * Ajoute un rectangle aux données d'apprentissage, et réalise l'apprentissage
 * avec le modèle et les données actuelles
 */
async function addSquare() {
    // Calcul une hauteur et une largeur random
    largeur = int(random(10, 400));
    hauteur = int(random(10, 400));

    // La met dans le tableau all_squares_display
    all_squares_display["squareCoord"].push({ l: largeur, h: hauteur });
    all_squares_learn.squareLearn.push((largeur - 10) / 390);
    all_squares_learn.squareLearn.push((hauteur - 10) / 390);


    // Choisit une couleur random (pour affichage)
    let color = chooseColor();
    all_squares_display["color"].push({ r: color[0], g: color[1], b: color[2] });

    let nblinks = int(random(0, 20));
    all_squares_learn.linksLearn.push(nblinks);
    all_squares_learn.colorLearn.push(color);

    //détermine la zone où il doit être placé
    let expectZone = expectedZone(hauteur, largeur, color, nblinks);
    all_squares_display.zone.push(expectZone);
    all_squares_learn.zoneLearn.push(vectorFromExpectedZone(expectZone));

    select("#nbRect").html("Nombre de rectangles générés : " + all_squares_learn.squareLearn.length / 2);
    await trainAllSquares();
}

/**
 * Entraîne le modèle à partir du rectangle dont les caractéristiques sont
 * données en paramètres.
 * Le retour de la fonction d'entraînement est stocké dans une promesse dans la
 * variable oldHistory
 * @param {int} l la largeur normalisée (avec une valeur comprise entre 0 et 1)
 * @param {int} h la hauteur normalisée
 * @param {int[]} color tableau contenant les valeurs RBG de la couleur
 * @param {int} link nombre de liens associé au rectangle
 */
async function trainSquare(l, h, color, link) {
    let res;

    let zoneExpected = expectedZone(h, l, color);
    let vectorZoneExpected = vectorFromExpectedZone(zoneExpected);


    xs = generateTensorFor1Square(l, h, color, link);
    ys = tf.tensor2d(res, [1, nbZones]);

    let config = {
        epochs: inputNBrepetition,
        callbacks: {
            onEpochEnd: async(epoch, logs) => {
                console.log(logs.loss);
                console.log(logs);
            }
        },
        callbacks: callbacks
    };

    console.warn("Training !", config);
    await model.fit(xs, ys, config);
}

/**
 * Entraîne le modèle avec tous les rectangles dont les données sont
 * contenues dans all_squares_learn
 * Le retour de la fonction d'entraînement est stocké dans une promesse dans la
 * variable oldHistory
 */
async function trainAllSquares() {

    xs = generateTensorForAllSquare();
    ys = tf.tensor2d(all_squares_learn.zoneLearn, [all_squares_learn.zoneLearn.length, nbZones]); //nbZones = taille du vecteur en sortie


    let config = {
        epochs: inputNBrepetition,
        callbacks: {
            onEpochEnd: async(epoch, logs) => {
                console.log(logs.loss);
                console.log(logs);
            }
        },
        callbacks: callbacks
    };

    console.warn("Training !", config);
    await model.fit(xs, ys, config);
};

/**
 * Charge les données depuis un fichier JSON et entraîne le modèle à partir des
 * données ainsi récupérées
 */
async function loadAndTrain(ev) {
    let contents = JSON.parse(decodeURIComponent(ev.target.result));
    console.log(contents);
    resetTrain();
    all_squares_learn = contents;

    textToUser("Train the data ! ");
    let trainSize = contents.zoneLearn.length;

    all_squares_learn = { squareLearn: contents.squareLearn, linksLearn: contents.linksLearn, colorLearn: contents.colorLearn, zoneLearn: contents.zoneLearn }

    for (i = 0; i < inputNBrepetition; i++) {
        for (j = 1; j < trainSize; j++) {
            subSquare = contents.squareLearn.splice(0, j * 2);
            subLinks = contents.linksLearn.splice(0, j);
            subColor = contents.colorLearn.splice(0, j);
            subZones = contents.zoneLearn.splice(0, j);

            all_squares_learn = { squareLearn: subSquare, linksLearn: subLinks, colorLearn: subColor, zoneLearn: subZones };

            // Add to the display screen
            addToDisplayLearn(subSquare[(j - 1) * 2] * 390 + 10, subSquare[(j - 1) * 2 + 1] * 390 + 10, subColor[j - 1], subLinks[j - 1]);
            // Train the data
            await trainAllSquares();

            // Show the percent of data train
            let percent = (j / trainSize) * 100;
            document.querySelector('#progress1').MaterialProgress.setProgress(parseInt(percent.toFixed(0)));
            document.querySelector('#progress2').innerHTML = percent.toFixed(2) + " %";

            contents.squareLearn = subSquare.concat(contents.squareLearn);
            contents.linksLearn = subLinks.concat(contents.linksLearn);
            contents.colorLearn = subColor.concat(contents.colorLearn);
            contents.zoneLearn = subZones.concat(contents.zoneLearn);
        }

    }

    document.querySelector('#progress1').MaterialProgress.setProgress(100);
    document.querySelector('#progress2').innerHTML = "100 %";
    console.warn("Train finish ");

    textToUser("All data are trained !");
}