let xs, ys;
let oldHistory;

/**
 * Add a square to the learning array
 * and train the current model
 */
async function addSquare() {
    // Calcul une hauteur et une largeur random
    largeur = int(random(10, 400));
    hauteur = int(random(10, 400));

    // La met dans le tableau all_squares_display
    all_squares_display["squareCoord"].push({ l: largeur, h: hauteur });
    all_squares_learn.squareLearn.push((largeur - 10) / 390);
    all_squares_learn.squareLearn.push((hauteur - 10) / 390);

    // Si grand rectangle, va en haut, sinon va en bas
    if (predictLH(hauteur, largeur)) {
        all_squares_display["pos"].push("Haut");
        all_squares_learn["posLearn"].push([1, 0]);
    } else {
        all_squares_display["pos"].push("Bas");
        all_squares_learn["posLearn"].push([0, 1]);
    }
    // Lui choisis une couleur random (pour affichage)
    all_squares_display["color"].push({ r: random(255), g: random(255), b: random(255) });

    select("#nbRect").html("Nombre de rectangles générés : " + all_squares_learn.squareLearn.length/2);

    await trainAllSquares();
}

/**
 * Train the current model with the given square
 * The return of the train funcion is stock in a promise
 * inside the var oldHistory
 * @param {int} l A normalise largeur between 0 and 1
 * @param {int} h
 */
async function trainSquare(l, h) {
    let res;
    if (predictLH(l, h)) {
        res = [1, 0];
    } else {
        res = [0, 1];
    }
    xs = tf.tensor2d([l, h], [1, 2]);
    ys = tf.tensor2d(res, [1, 2]);

    console.warn("Training !");
    oldHistory = await model.fit(xs, ys);
}

/**
 * Train the current model with the squares
 * inside the all_squares_learn.squareLearn array
 * The return of the train funcion is stock in a promise
 * inside the var oldHistory
 */
async function trainAllSquares() {
    xs = tf.tensor2d(all_squares_learn.squareLearn, [all_squares_learn.posLearn.length, 2]);
    ys = tf.tensor2d(all_squares_learn.posLearn, [all_squares_learn.posLearn.length, 2]);

    console.warn("Training !");
    await model.fit(xs, ys);
};

async function loadAndTrain(ev) {
    let contents = JSON.parse(decodeURIComponent(ev.target.result));
    resetTrain();
    all_squares_learn=contents;

    textToUser("Train the data !");
    for (i = 0 ;i<inputNBrepetition;i++) {
        window.setTimeout(trainAllSquares,1000);
        //trainAllSquares();
    }
    textToUser("All data are trained !");
}
