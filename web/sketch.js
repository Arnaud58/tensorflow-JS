//let all_squares_display = { squareCoord: [], pos: [], color: [], predictSquare: [], posPredict: [], colorPredict: [] };
//let all_squares_learn = { squareLearn: [], posLearn: [], linksLearn: [], colorLearn: [] };

let all_squares_display = { squareCoord: [], pos: [], color: [], zone:[], predictSquare: [], posPredict: [], zonePredict: [] };
let all_squares_learn = { squareLearn: [], posLearn: [], linksLearn: [], colorLearn: [], zoneLearn:[] };

let zones;
let nbZones;

let jsonUpload;
let weightsUpload;

let buttonAutoAdd;
let autoAjout = false;

let _snackbarContainer;

//aire au delà de laquelle un rectangle est considéré comme étant grand
const areaLimit = 30000;

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
    let all_squares_learn = { squareLearn: [], posLearn: [], linksLearn: [], colorLearn: [], zoneLearn:[] };

    textToUser("Nouveau réseau créé !");
}

function resetPredict() {
    all_squares_display["predictSquare"] = [];
    all_squares_display["posPredict"] = [];
    all_squares_display["colorPredict"] = [];
    all_squares_display["zonePredict"] = [];
}

function resetTrain() {
    all_squares_learn = { squareLearn: [], posLearn: [], linksLearn: [], colorLearn: [], zoneLearn: []};
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
function addToDisplayLearn(l, h) {
    all_squares_display["squareCoord"].push({ l: l, h: h});

    // Si grand rectangle, va en haut, sinon va en bas
    if (predictLH(h, l)) {
        all_squares_display["pos"].push("Haut");
    } else {
        all_squares_display["pos"].push("Bas");
    }


    // Lui choisit une couleur random (pour affichage)
    let color = chooseColor();
    all_squares_display["color"].push({ r: color[0], g: color[1], b: color[2] });

}

/*
Pour pouvoir classifier les rectangles selon leur couleur et leur taille, on découpe la zone
de placement en plusieurs zones, chaque zone correspondant à des caractéristiques particulières.
Pour l'instant, voici le découpage choisi, arbitrairement :
*-------*-------*-------*
|   0   |   1   |  2    |
| (0,0) | (1,0) | (2,0) |
*-------*-------*-------*
|   4   |   5   |   6   |
| (0,1) | (1,1) | (2,1) |
*-------*-------*-------*
(x,0) : Grand rectangle
(x,1) : Petit rectangle
(0,x) : couleurs LIGHT_FUCHSIA_PINK, ULTRA_PINK, PALE_PINK
(1,x) : couleurs BANANA_MANIA, DANDELION, SUNSET_ORANGE
(2,x) : couleurs CEIL, BLUE_YONDER, VERDIGRIS, COLUMBIA_BLUE
Exemple : un petit rectangle rose sera dans la zone 4, un grand rectangle jaune sera dans la zone 1.
*/

/**
* Découpe l'aire de travail en plusieurs zones pour permettre la classification
* @param {int} height hauteur de la zone à découper
* @param {int} width largeur de la zone à découper
* @param {int} shift décalage de la zone par rapport au bord gauche du canvas
* @param {xZones} nombre de zones voulue sur l'axe horizontal
* @param {yZones} nombre de zones voulue sur l'axe vertical
*/
function sliceInZones(height, width, xZones, yZones){
  let zones = []
  let k = 0;
  for (let i=0; i<xZones;i++){
    for (let j=0; j<yZones; j++){
      zones[k++] = [i*width/xZones, j*height/yZones];
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

    let button = select("#Add1");
    button.mousePressed(addSquare);

    button = select("#predict");
    button.mousePressed(predictFromUser);

    button = select("#predictTests");
    button.mousePressed(predictTheTests);

    button = select("#create");
    button.mousePressed(reset);

    button = select("#saveModel");
    button.mousePressed(saveModel);

    button = select("#chooseParams");
    button.mousePressed(checkActiveParams);

    /*
    button = select("#loadModel");
    button.mousePressed(loadModel);
    */

    button = select("#saveLearn");
    button.mousePressed(function() { download(all_squares_learn, "training.json"); });

    buttonAutoAdd = select("#AddFrame");
    buttonAutoAdd.mousePressed(function() { autoAjout = !autoAjout; if (autoAjout) { buttonAutoAdd.elt.innerText = "Ajout auto : activé"; } else { buttonAutoAdd.elt.innerText = "Ajout auto : désactivé"; } });

    var fileP = document.querySelector("#predictFile");
    var readerPredict = new FileReader();
    readerPredict.onload = loadAndPredict;

    var fileT = document.querySelector("#trainFile");
    var readerTrain = new FileReader();
    readerTrain.onload = loadAndTrain;

    fileP.addEventListener("change", function() {
        var file = this.files[0];
        readerPredict.readAsText(file);
    });

    fileT.addEventListener("change", function() {
        var file = this.files[0];
        readerTrain.readAsText(file);
    });

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

    createNeuralNetwork();
}

/*
 * Fonction appelé par p5 à chaque frame
 */
function draw() {
    // Arrière plan
    background(255);

    const canvasHeight = 800;
    const canvasWidth = 1300;
    const gapPosition = 600;

    const xZones = 3;
    const yZones = 2;

    // Draw le contours des 2 rectangles
    noFill();
    strokeWeight(4);
    stroke('#222222');
    rect(0, 0, canvasWidth, canvasHeight);

    // Draw le gap entre les deux
    fill(0);
    strokeWeight(2);
    stroke('#222222');
    rect(gapPosition, 0, 100, 800);

    zones = sliceInZones(canvasHeight, gapPosition, xZones, yZones);
    console.log(zones);

    //Trace les délimitations de zones
    //Côté apprentissage
    noFill();
    strokeWeight(1);
    //stroke('#D3D3D3');
    for (let i = 0; i<zones.length; i++){
      line(zones[i][0], 0, zones[i][0], canvasHeight); //lignes verticales
      line(0, zones[i][1], gapPosition, zones[i][1]); //lignes horizontales
    }
    //Côté prédictions
    for (let i = 0; i<zones.length; i++){
      line(zones[i][0]+gapPosition+100, 0, zones[i][0]+gapPosition+100, canvasHeight); //lignes verticales
      line(gapPosition+100, zones[i][1], canvasWidth, zones[i][1]); //lignes horizontales
    }

    // Dessine chaque rectangle d'entrainement de all_squares_display
    for (i = 0; i < all_squares_display["squareCoord"].length; i++) {
        xGap = (i % 50) * 5;
        yGap = (int(i / 50) * 20) + 20;

        if (all_squares_display.pos[i] == "Bas") {
            yGap += 400;
        }

        let squareZone = zones[all_squares_display["zone"]];
        console.log(squareZone);

        fill(all_squares_display.color[i].r, all_squares_display.color[i].g, all_squares_display.color[i].b);
        rect(xGap+squareZone[0], yGap+squareZone[1], all_squares_display.squareCoord[i].l, all_squares_display.squareCoord[i].h);
    }

    strokeWeight(1);
    stroke('#222222');
    // Dessine les rectangles prédits
    for (i = 0; i < all_squares_display.predictSquare.length; i++) {
        xGap = 700 + (i % 50) * 5;
        yGap = (int(i / 50) * 20) + 20;

        if (all_squares_display.posPredict[i] == "Bas") {
            yGap += 400;
        }


        fill(all_squares_display.colorPredict[i].r, all_squares_display.colorPredict[i].g, all_squares_display.colorPredict[i].b);
        rect(xGap, yGap, all_squares_display.predictSquare[i].l, all_squares_display.predictSquare[i].h);
    }

    // Si activé par le bouton, rajoute un nouveau rectangle d'entrainement
    if (autoAjout) {
        addSquare();
    }
}
