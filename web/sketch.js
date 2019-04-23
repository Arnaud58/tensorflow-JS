//let all_squares_display = { squareCoord: [], pos: [], color: [], predictSquare: [], posPredict: [], colorPredict: [] };
//let all_squares_learn = { squareLearn: [], posLearn: [], linksLearn: [], colorLearn: [] };

let all_squares_display = { squareCoord: [], pos: [], color: [], zone: [], predictSquare: [], posPredict: [], zonePredict: [] };
let all_squares_learn = { squareLearn: [], posLearn: [], linksLearn: [], colorLearn: [], zoneLearn: [] };

let zones;
let nbZones = 2;

//nb de zones selon l'axe horizontal ou vertical
let xZones;
let yZones;

let jsonUpload;
let weightsUpload;

let buttonAutoAdd;
let autoAjout = false;

let _snackbarContainer;

let callbacks;

let selectedRec = null;

//aire au delà de laquelle un rectangle est considéré comme étant grand
const areaLimit = 30000;
const metrics = ['loss', 'val_loss'];

/**
 * Sert à télécharger une variable sur son bureau
 * Ne fonction pas sous firefox
 * @param {any} content La variable à télécharger
 * @param {String} fileName Le nom du fichier que l'on va télécharger
 * @param {String} contentType Le format sous lequel on veux le télécharger (JSON par défault)
 */
function download(content, fileName, contentType = "application/json") {
    var a = document.createElement("a");
    if (contentType === "application/json") {
        content = JSON.stringify(content);
    }
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();

    textToUser("Fichier " + fileName + " télécharger !");
}

/*
 * Reset the Model to 0
 * Delete all squares and create a new Model
 */
function reset() {
    createNeuralNetwork();

    //all_squares_display = { squareCoord: [], pos: [], color: [], predictSquare: [], posPredict: [], colorPredict: [] };
    //all_squares_learn = { squareLearn: [], posLearn: [], linksLearn: [], colorLearn: [] };

    let all_squares_display = { squareCoord: [], pos: [], color: [], predictSquare: [], posPredict: [], zonePredict: [] };
    let all_squares_learn = { squareLearn: [], posLearn: [], linksLearn: [], colorLearn: [], zoneLearn: [] };

    textToUser("Nouveau réseau créé !");
}

function resetPredict() {
    all_squares_display["predictSquare"] = [];
    all_squares_display["posPredict"] = [];
    all_squares_display["colorPredict"] = [];
    all_squares_display["zonePredict"] = [];
}

function resetTrain() {
    all_squares_learn = { squareLearn: [], posLearn: [], linksLearn: [], colorLearn: [], zoneLearn: [] };
    all_squares_display.squareCoord = [];
    all_squares_display.pos = [];
    all_squares_display.color = [];
    all_squares_display.zone = [];
}

/**
 * Envoie un message à l'utilisateur dans une div en bas de son éran
 * @param {String} msg Le message à afficher
 */
function textToUser(msg) {
    var data = {
        message: msg,
        timeout: 2000,
    };
    _snackbarContainer.MaterialSnackbar.showSnackbar(data);
}

/**
 * Ajoute un rectangle sur la partie gauche du canvas
 * @param {int} l
 * @param {int} h
 */
function addToDisplayLearn(l, h, color) {
    // console.log(color)
    all_squares_display["squareCoord"].push({ l: l, h: h });

    // Si grand rectangle, va en haut, sinon va en bas
    /*
    if (predictLH(h, l)) {
        all_squares_display["pos"].push("Haut");
    } else {
        all_squares_display["pos"].push("Bas");
    }
    */
    all_squares_display["zone"].push(expectedZone(h, l, color));


    // Lui choisit une couleur random (pour affichage)
    //let color = chooseColor();
    all_squares_display["color"].push({ r: color[0], g: color[1], b: color[2] });

}

/**
 * Returns the number of necessary zones, based on which parameters are activated
 */
function setNbZones() {
    if (scaleIsActive && !colorIsActive) return 2;
    else if (!scaleIsActive && colorIsActive) return 3;
    else if (scaleIsActive && colorIsActive) return 6;
    //à voir plus tard pour les liens
}


function setNbZonesXY() {
    if (scaleIsActive && !colorIsActive) {
        xZones = 1;
        yZones = 2;
    } else if (!scaleIsActive && colorIsActive) {
        xZones = 3;
        yZones = 1;
    } else if (scaleIsActive && colorIsActive) {
        xZones = 3;
        yZones = 2;
    }
    //à voir plus tard pour les liens
}

/*
Pour pouvoir classifier les rectangles selon leur couleur et leur taille, on découpe la zone
de placement en plusieurs zones, chaque zone correspondant à des caractéristiques particulières.
Pour l'instant, voici le découpage choisi, arbitrairement :
*-------*-------*-------*
|   0   |   2   |   4   |
| (0,0) | (1,0) | (2,0) |
*-------*-------*-------*
|   1   |   3   |   5   |
| (0,1) | (1,1) | (2,1) |
*-------*-------*-------*
(x,0) : Grand rectangle
(x,1) : Petit rectangle
(0,x) : couleurs LIGHT_FUCHSIA_PINK, ULTRA_PINK, PALE_PINK
(1,x) : couleurs BANANA_MANIA, DANDELION, SUNSET_ORANGE
(2,x) : couleurs CEIL, BLUE_YONDER, VERDIGRIS, COLUMBIA_BLUE
Exemple : un petit rectangle rose sera dans la zone 1, un grand rectangle jaune sera dans la zone 2.
*/

/**
 * Découpe l'aire de travail en plusieurs zones pour permettre la classification
 * @param {int} height hauteur de la zone à découper
 * @param {int} width largeur de la zone à découper
 * @param {xZones} nombre de zones voulue sur l'axe horizontal
 * @param {yZones} nombre de zones voulue sur l'axe vertical
 */
function sliceInZones(height, width, xZones, yZones) {
    let zones = []
    let k = 0;
    for (let i = 0; i < xZones; i++) {
        for (let j = 0; j < yZones; j++) {
            zones[k++] = [i * width / xZones, j * height / yZones];
        }
    }
    return zones;
}

function setup() {
    // 2 rectangle de 600*800 avec un gap de 100 entre les 2
    _snackbarContainer = document.querySelector('#demo-snackbar');
    let canvas = createCanvas(1300, 800);
    canvas.parent('sketch-holder');
    // frameRate(1);  // Change les fps à 1 images par secondes

    jsonUpload = document.getElementById('json-upload');
    weightsUpload = document.getElementById('weights-upload');

    /* Boutons dans onglet Params */

    let button = select("#chooseParams");
    button.mousePressed(checkActiveParams);

    /* Boutons dans onglet Neural */
    button = select("#create");
    button.mousePressed(reset);

    //affiche nombre de couches
    select("#nbLayers").html("Number of Hidden Layers :      " + modelStructure.nbLayers);


    button = select("#addLayer");
    button.mousePressed(addLayer);

    button = select("#removeLayer");
    button.mousePressed(removeLayer);

    /* Boutons dans onglet Predict */

    button = select("#predict");
    button.mousePressed(addSquareCanvas);

    button = select("#predictTests");
    button.mousePressed(predictTheTests);

    /* Boutons dans onglet Save and Load Model */


    button = select("#saveModel");
    button.mousePressed(saveModel);


    /*
    button = select("#loadModel");
    button.mousePressed(loadModel);
    */

    var fileLoadJsonModel = document.querySelector("#json-upload");
    fileLoadJsonModel.addEventListener("change", function() {
        console.log("fichier json contenant le modèle mis à jour");
    });
    var fileLoadWeightsModel = document.querySelector("#weights-upload");
    fileLoadJsonModel.addEventListener("change", function() {
        console.log("fichier contenant les poids mis à jour");
    });

    var fileLoadModel = document.querySelector("#loadModel");
    fileLoadModel.addEventListener("click", function() {
        console.log(jsonUpload.files[0]);
        console.log(weightsUpload.files[0]);
        console.log("LoadModel appelée");
        loadModelFromFiles();
    });

    callbacks = tfvis.show.fitCallbacks(document.getElementById("epoch"), metrics, { width: 800, height: 400 });
    callbacks.onBatchEnd = null;

    createNeuralNetwork();
}

/*
 * Ajoute un rectangle au canvas
 */
function addSquareCanvas() {
    let lgr = parseInt(select("#largeur").value());
    let htr = parseInt(select("#hauteur").value());
    let col = allColors[parseInt(select("#couleur").value())];
    console.log(col);

    all_squares_display.squareCoord.push({ l: lgr, h: htr });
    all_squares_display.color.push({ r: col[0], g: col[1], b: col[2] });
    all_squares_display.pos.push({ x: 200, y: 200 });
}

/*
 * Fonction appelée par p5 à chaque frame
 */
function draw() {
    // Arrière plan
    background(255);

    const canvasHeight = 800;
    const canvasWidth = 1300;
    const gapPosition = 600;

    /*
    const xZones = 3;
    const yZones = 2;
    */
    //nbZones = setNbZones();
    //setNbZonesXY();

    // Draw le contours des 2 rectangles
    noFill();
    strokeWeight(4);
    stroke('#222222');
    rect(0, 0, canvasWidth, canvasHeight);

    // Draw le gap entre les deux
    fill(0);
    strokeWeight(2);
    stroke('#222222');

    // Dessine chaque rectangle d'entrainement de all_squares_display
    for (i = 0; i < all_squares_display["squareCoord"].length; i++) {
        fill(all_squares_display.color[i].r, all_squares_display.color[i].g, all_squares_display.color[i].b);
        rect(all_squares_display.pos[i].x, all_squares_display.pos[i].y, all_squares_display.squareCoord[i].l / 2, all_squares_display.squareCoord[i].h / 2);
    }

    strokeWeight(1);
    stroke('#222222');
}



function mousePressed() {
    for (i = 0; i < all_squares_display["squareCoord"].length; i++) {
        if (mouseX > all_squares_display.pos[i].x &&
            mouseX < all_squares_display.pos[i].x + all_squares_display.squareCoord[i].l / 2 &&
            mouseY > all_squares_display.pos[i].y &&
            mouseY < all_squares_display.pos[i].y + all_squares_display.squareCoord[i].h / 2
        ) {
            selectedRec = i;
            return false;
        }
    }

    selectedRec = null;
}

function mouseDragged() {
    if (selectedRec == null) {
        return false;
    }

    all_squares_display.pos[selectedRec].x = mouseX;
    all_squares_display.pos[selectedRec].y = mouseY;

}