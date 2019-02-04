let all_squares_display = { squareCoord: [], pos: [], color: [] };
let all_squares_learn = { squareLearn: [], posLearn: [] };

let buttonAutoAdd;
let autoAjout = false;

const learningRate = 0.01;
const optimizer = tf.train.sgd(learningRate);

let model, xs, ys;
let history;

/*
Création d'un premier réseau neuronal
Couche d'entrée : 2 neurones (hauteur et largeur)
1 couche cachée : 3 neurones
Couche de sortie : 2 neurones ("Haut" et "Bas")
*/
function createNeuralNetwork() {
    model = tf.sequential();

    const hiddenConfig = {
        inputShape: [2],
        units: 3,
        activation: 'relu'
    };
    const outputConfig = {
        inputShape: [3],
        units: 1,
        activation: 'softmax'
    };
    let hiddenLayer = tf.layers.dense(hiddenConfig);
    let outputLayer = tf.layers.dense(outputConfig);
    model.add(hiddenLayer);
    model.add(outputLayer);

    model.compile({
        optimizer: optimizer,
        loss: 'meanSquaredError'
    });
}



async function addSquare() {
    // Calcul une hauteur et une largeur random
    largeur = int(random(10, 400));
    hauteur = int(random(10, 400));

    // La met dans le tableau all_squares_display
    all_squares_display["squareCoord"].push({ l: largeur, h: hauteur });
    all_squares_learn.squareLearn.push(largeur);
    all_squares_learn.squareLearn.push(hauteur);

    // Si grand rectangle, va en haut, sinon va en bas
    if (hauteur * largeur > 30000) {
        all_squares_display["pos"].push("Haut");
        all_squares_learn["posLearn"].push(5);
    } else {
        all_squares_display["pos"].push("Bas");
        all_squares_learn["posLearn"].push(2);
    }
    // Lui choisis une couleur random (pour affichage)
    all_squares_display["color"].push({ r: random(255), g: random(255), b: random(255) });

    xs = tf.tensor2d(all_squares_learn.squareLearn, [all_squares_display.squareCoord.length, 2]);
    ys = tf.tensor1d(all_squares_learn.posLearn);

    console.info("Tranning !");
    history = await model.fit(xs, ys);
    // model.predict(tf.variable(tf.tensor2d([[80,10]],[1,2]))).print()
}

function setup() {
    // 2 rectangle de 600*800 avec un gap de 100 entre les 2
    canvas = createCanvas(1300, 800);
    canvas.parent('sketch-holder');
    // frameRate(1);  // Change les fps à 1 images par secondes

    button = c = select("#Add1");
    button.mousePressed(addSquare);

    button = select("#Add100");
    button.mousePressed(function() { for (i = 0; i < 100; i++) { addSquare(); } });

    buttonAutoAdd = select("#AddFrame");
    buttonAutoAdd.mousePressed(function() { autoAjout = !autoAjout; if (autoAjout) { buttonAutoAdd.elt.innerText = "Ajout auto : activé"; } else { buttonAutoAdd.elt.innerText = "Ajout auto : désactivé"; } });

    createNeuralNetwork();
}

/*
 * Fonction appelé par p5 à chaque frame
 */
function draw() {
    // Arrière plan
    background(255);

    // Draw le contours des 2 rectangles
    noFill();
    strokeWeight(4);
    stroke('#222222');
    rect(0, 0, 1300, 800);

    // Draw le gap entre les deux
    fill(0);
    strokeWeight(2);
    stroke('#222222');
    rect(600, 0, 100, 800);

    // Déssine chaque rectangle d'entrainement de all_squares_display
    for (i = 0; i < all_squares_display["squareCoord"].length; i++) {
        xGap = (i % 50) * 5;
        yGap = (int(i / 50) * 20) + 20;

        if (all_squares_display.pos[i] == "Bas") {
            yGap += 400;
        }


        fill(all_squares_display.color[i].r, all_squares_display.color[i].g, all_squares_display.color[i].b);
        rect(xGap, yGap, all_squares_display.squareCoord[i].l, all_squares_display.squareCoord[i].h);
    }

    // Si activé par le bouton, rajoute un nouveau rectangle d'entrainement
    if (autoAjout) {
        addSquare();
    }
}