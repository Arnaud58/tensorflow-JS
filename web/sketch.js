let all_learn_squares = { squareCoord: [], pos: [], color: [] };
let buttonAutoAdd;
let autoAjout = false;

const learningRate = 0.5;
const optimizer = tf.train.sgd(learningRate);

let model;

//Contient les dimensions de chaque rectangle sous la forme [h,l]
let dimensions = [];
//Contient la position de chaque rectange sous la forme [0] (pour bas) ou [1]
let positions = [];



/*
Création d'un premier réseau neuronal
Couche d'entrée : 2 neurones (hauteur et largeur)
1 couche cachée : 3 neurones (activation : relu)
Couche de sortie : 2 neurones ("Haut" et "Bas")
*/
function createNeuralNetwork(){
    model = tf.sequential();

    const hiddenConfig = {
        inputShape : [2],
        units: 5,
        activation: 'relu'
    };
    const outputConfig = {
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



async function train(){
  await model.fit(dim_ts, pos_ts, {
   shuffle: true,
   epochs: 1
 });
}



function addSquare() {
    // Calcul une hauteur et une largeur random
    largeur = int(random(10, 400));
    hauteur = int(random(10, 400));

    // La met dans le tableau all_learn_squares
    all_learn_squares["squareCoord"].push({ l: largeur, h: hauteur });
    dimensions.push([hauteur, largeur]);

    // Si grand rectangle, va en haut, sinon va en bas
    if (hauteur * largeur > 30000) {
        all_learn_squares["pos"].push("Haut");
        positions.push([1]);
    } else {
        all_learn_squares["pos"].push("Bas");
        positions.push([0]);
    }

    // Lui choisis une couleur random (pour affichage)
    all_learn_squares["color"].push({ r: random(255), g: random(255), b: random(255) });

}

function autoAdd() {

}

function setup() {
    // 2 rectangle de 600*800 avec un gap de 100 entre les 2
    createCanvas(1300, 800);
    frameRate(1);

    createNeuralNetwork();

    button = createButton('Add one learn square');
    button.mousePressed(addSquare);

    button = createButton('Add 100 learn squares');
    button.mousePressed(function() { for (i = 0; i < 100; i++) { addSquare(); } });

    buttonAutoAdd = createButton('Ajout auto : désactivé');
    buttonAutoAdd.mousePressed(function() { autoAjout = !autoAjout; if (autoAjout) { buttonAutoAdd.elt.innerText = "Ajout auto : activé"; } else { buttonAutoAdd.elt.innerText = "Ajout auto : désactivé"; } });
}


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

    // Draw all rectangle for the test
    for (i = 0; i < all_learn_squares["squareCoord"].length; i++) {
        xGap = (i % 50) * 5;
        yGap = (int(i / 50) * 20) + 20;

        if (all_learn_squares.pos[i] == "Bas") {
            yGap += 400;
        }


        fill(all_learn_squares.color[i].r, all_learn_squares.color[i].g, all_learn_squares.color[i].b);
        rect(xGap, yGap, all_learn_squares.squareCoord[i].l, all_learn_squares.squareCoord[i].h);
    }

    if (autoAjout) {
        addSquare();
    }

    if (dimensions.length>0){
      tf.tidy(() => {
          const dim_ts = tf.tensor2d(dimensions);
          const pos_ts = tf.tensor2d(positions);
          let pos = model.predict(dim_ts);
          let pos_values = pos.dataSync();
          console.log(pos_values);
      });
    }

}
