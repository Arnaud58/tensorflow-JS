

let all_squares_display = { squareCoord: [], color: [], links: [], zone: [], predictSquare: [], zonePredict: [], colorPredict: [] };
let all_squares_learn = { squareLearn: [], linksLearn: [], colorLearn: [], zoneLearn: [] };

let zones;
let nbZones = 2; //Par défaut, deux zones de classification


let jsonUpload;
let weightsUpload;

let buttonAutoAdd;
let autoAjout = false;

let _snackbarContainer;

let callbacks;

//aire au delà de laquelle un rectangle est considéré comme étant grand
const areaLimit = 30000;
//nb de liens à partir duquel une classe est considérée comme étant fortement liée
const links_max = 10;

const metrics = ['loss', 'val_loss'];

/**
 * Sert à télécharger une variable sur son bureau
 * Ne fonctionne pas sous firefox
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

    let all_squares_display = { squareCoord: [], color: [], predictSquare: [], zonePredict: [] };
    let all_squares_learn = { squareLearn: [], linksLearn: [], colorLearn: [], zoneLearn: [] };

    textToUser("Nouveau réseau créé !");
}

function resetPredict() {
    all_squares_display["predictSquare"] = [];
    all_squares_display["colorPredict"] = [];
    all_squares_display["zonePredict"] = [];
}

function resetTrain() {
    all_squares_learn = { squareLearn: [], linksLearn: [], colorLearn: [], zoneLearn: [] };
    all_squares_display.squareCoord = [];
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
function addToDisplayLearn(l, h, color, nblinks) {
    all_squares_display["squareCoord"].push({ l: l, h: h });
    all_squares_display["zone"].push(expectedZone(h, l, color, nblinks));
    all_squares_display["color"].push({ r: color[0], g: color[1], b: color[2] });

}

/**
* Phase d'initialisation
* Création des event listeners pour la récupération des données entrées par
* l'utilsateur et appelle createNeuralNetwork()
*/
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


    /* Boutons dans onglet Learning */

    button = select("#Add1");
    button.mousePressed(addSquare);

    buttonAutoAdd = select("#AddFrame");
    buttonAutoAdd.mousePressed(function() { autoAjout = !autoAjout; if (autoAjout) { buttonAutoAdd.elt.innerText = "Ajout auto : activé"; } else { buttonAutoAdd.elt.innerText = "Ajout auto : désactivé"; } });

    var fileT = document.querySelector("#trainFile");
    var readerTrain = new FileReader();
    readerTrain.onload = loadAndTrain;

    /* Boutons dans onglet Predict */

    button = select("#predict");
    button.mousePressed(predictFromUser);

    button = select("#predictTests");
    button.mousePressed(predictTheTests);

    var fileP = document.querySelector("#predictFile");
    var readerPredict = new FileReader();
    readerPredict.onload = loadAndPredict;

    /* Boutons dans onglet Save and Load Model */


    button = select("#saveModel");
    button.mousePressed(saveModel);



    button = select("#saveLearn");
    button.mousePressed(function() { download(all_squares_learn, "training.json"); });




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

    callbacks = tfvis.show.fitCallbacks(document.getElementById("epoch"), metrics, { width: 800, height: 400 });
    callbacks.onBatchEnd = null;

    createNeuralNetwork();
}

/**
 * Fonction appelée par p5 à chaque frame
 */
function draw() {
    // Arrière plan
    background(255);

    const canvasHeight = 800;
    const canvasWidth = 1300;
    const gapPosition = 600;

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

    //Trace les délimitations de zones
    //Côté apprentissage
    noFill();
    strokeWeight(1);
    for (let i = 0; i < zones.length; i++) {
        line(zones[i][0], 0, zones[i][0], canvasHeight); //lignes verticales
        line(0, zones[i][1], gapPosition, zones[i][1]); //lignes horizontales
    }
    //Côté prédictions
    for (let i = 0; i < zones.length; i++) {
        line(zones[i][0] + gapPosition + 100, 0, zones[i][0] + gapPosition + 100, canvasHeight); //lignes verticales
        line(gapPosition + 100, zones[i][1], canvasWidth, zones[i][1]); //lignes horizontales
    }

    // Dessine chaque rectangle d'entrainement de all_squares_display
    for (i = 0; i < all_squares_display["squareCoord"].length; i++) {
        xGap = (i % 50) * 5;
        yGap = (int(i / 50) * 20) + 20;

        let squareZone = zones[all_squares_display["zone"][i]];

        if (all_squares_learn["linksLearn"][i] > links_max) {
            stroke('rgb(0,255,0)');
            strokeWeight(4);
        } else {
            stroke('black');
            strokeWeight(1);
        }
        fill(all_squares_display.color[i].r, all_squares_display.color[i].g, all_squares_display.color[i].b);
        rect( /*xGap+*/ squareZone[0], /*yGap+*/ squareZone[1], all_squares_display.squareCoord[i].l / 2, all_squares_display.squareCoord[i].h / 2);

    }

    strokeWeight(1);
    stroke('#222222');
    // Dessine les rectangles prédits
    for (i = 0; i < all_squares_display.predictSquare.length; i++) {
        xGap = 700 + (i % 50) * 5;
        yGap = (int(i / 50) * 20) + 20;


        let predictSquareZone = zones[all_squares_display["zonePredict"][i]];
        fill(all_squares_display.colorPredict[i].r, all_squares_display.colorPredict[i].g, all_squares_display.colorPredict[i].b);
        rect( /*xGap+*/ 700 + predictSquareZone[0], /*yGap+*/ predictSquareZone[1], all_squares_display.predictSquare[i].l / 2, all_squares_display.predictSquare[i].h / 2);
    }

    // Si activé par le bouton, rajoute un nouveau rectangle d'entrainement
    if (autoAjout) {
        addSquare();
    }
}
