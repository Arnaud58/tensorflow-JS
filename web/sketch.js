let all_squares_display = { squareCoord: [], pos: [], color: [], predictSquare: [], posPredict: [], colorPredict: [] };
let all_squares_learn = { squareLearn: [], posLearn: [] };

let jsonUpload;
let weightsUpload;

let buttonAutoAdd;
let autoAjout = false;

let _snackbarContainer;

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

    all_squares_display = { squareCoord: [], pos: [], color: [], predictSquare: [], posPredict: [], colorPredict: [] };
    all_squares_learn = { squareLearn: [], posLearn: [] };

    textToUser("Nouveau réseau créé !");
}

function resetPredict() {
    all_squares_display["predictSquare"] = [];
    all_squares_display["posPredict"] = [];
    all_squares_display["colorPredict"] = [];
}

function resetTrain() {
    all_squares_learn = { squareLearn: [], posLearn: [] };
    all_squares_display.squareCoord=[];
    all_squares_display.pos=[];
    all_squares_display.color=[];
}

function textToUser(msg) {
    var data = {
        message: msg,
        timeout: 2000,
    };
    _snackbarContainer.MaterialSnackbar.showSnackbar(data);
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


    var fileLoadModel = document.querySelector("#loadModel");
    fileLoadModel.addEventListener("click", loadModel);
    


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

    strokeWeight(1);
    // Déssine les rectangles prédits
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
