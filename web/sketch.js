let all_squares_display = { squareCoord: [], pos: [], color: [], links: [], zone: [], predictSquare: [], zonePredict: [], colorPredict: [], posArray: [] };

let zones;
let nbZones = 2;



let jsonUpload;
let weightsUpload;

let buttonAutoAdd;
let autoAjout = false;

let _snackbarContainer;

let callbacks;

let selectedRec = null;

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

    let all_squares_display = { squareCoord: [], color: [], predictSquare: [], zonePredict: [], posArray: [] };

    textToUser("Nouveau réseau créé !");
}

function resetPredict() {
    all_squares_display["predictSquare"] = [];
    all_squares_display["colorPredict"] = [];
    all_squares_display["zonePredict"] = [];
}

function resetTrain() {
    all_squares_display.squareCoord = [];
    all_squares_display.color = [];
    all_squares_display.zone = [];
    all_squares_display.pos = [];
    all_squares_display.posArray = [];
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

    button = select("#addRandomSquares");
    button.mousePressed(addRandomSquares);

    button = select("#cleanUP");
    button.mousePressed(cleanUP);

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
    let nbl = parseInt(select("#nblinks").value());
    let col = allColors[parseInt(select("#couleur").value())];
    console.log(col);

    all_squares_display.squareCoord.push({ l: lgr, h: htr });
    all_squares_display.color.push({ r: col[0], g: col[1], b: col[2] });
    all_squares_display.pos.push({ x: 200, y: 200 });
    all_squares_display.posArray.push(200);
    all_squares_display.posArray.push(200);
    all_squares_display.links.push(nbl);
}

function cleanUP() {
    resetTrain();
    resetPredict();
}

/*
 *
 */
function addRandomSquares() {
    let nbS = select("#nbSquareRandom").value();
    let x = 100;
    let y = 100;

    for (i = 0; i < nbS; i++) {
        let newCol = chooseColor();
        let links = int(random(0, 20));
        let lgr = int(random(20, 400));
        let htr = int(random(20, 400));

        all_squares_display.squareCoord.push({ l: lgr, h: htr });
        all_squares_display.color.push({ r: newCol[0], g: newCol[1], b: newCol[2] });
        all_squares_display.pos.push({ x: x, y: y });
        all_squares_display.posArray.push(x);
        all_squares_display.posArray.push(y);
        all_squares_display.links.push(links);

        x += (lgr / 2);
        if (x >= 1200) {
            x = 100;
            y += 100;
        }
        if (y >= 800) { return; }
    }
}

/*
 * Fonction appelée par p5 à chaque frame
 */
function draw() {
    // Arrière plan
    background(255);
    textSize(12);

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


    // Dessine chaque rectangle d'entrainement de all_squares_display
    for (i = 0; i < all_squares_display["squareCoord"].length; i++) {
        fill(all_squares_display.color[i].r, all_squares_display.color[i].g, all_squares_display.color[i].b);
        rect(all_squares_display.pos[i].x, all_squares_display.pos[i].y, all_squares_display.squareCoord[i].l / 2, all_squares_display.squareCoord[i].h / 2);
        fill(0, 0, 0);
        text(all_squares_display.links[i], all_squares_display.pos[i].x + 5, all_squares_display.pos[i].y + 20);
    }

    strokeWeight(1);
    stroke('#222222');
}


/**
 * Fonction appelé quand la souri clique sur le canvas
 * Cherche à savoir si il y a un rectangle en dessous et le sélectionne
 */
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

/**
 * Fonction qui va déplacé un rectangle séléctionné le long du mouvement de la sourie 
 */
function mouseDragged() {
    if (selectedRec == null) {
        return false;
    }

    all_squares_display.pos[selectedRec].x = mouseX;
    all_squares_display.pos[selectedRec].y = mouseY;

}

function mouseReleased() {
    if (selectedRec == null) {
        return false;
    }

    trainAllSquares();
}