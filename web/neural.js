let inputNBCouches;
let inputNBNeurones;
let activationType;
let inputNBrepetition;
let inputLearningRate;
let learningRate;

let modelStructure = { nbLayers: 1, nbNeurons: [1], activationFun: ["elu"] };

let model;

/**
* Fonction déclenchée lorsque l'on demande l'ajout d'une couche supplémentaire.
* Ajoute une couche paramétrable sur l'interface graphique.
*/
function addLayer() {

    modelStructure.nbLayers++;
    modelStructure.nbNeurons.push(1);
    modelStructure.activationFun.push("elu");


    let tr = document.createElement("tr");
    tr.id = "layer" + modelStructure.nbLayers;

    let td_num = document.createElement("td");
    td_num.innerText = modelStructure.nbLayers;
    tr.appendChild(td_num);

    let td_nbNeurons = document.createElement("td");
    let input_neuron = document.createElement("input");
    input_neuron.type = "number";
    input_neuron.min = "1";
    input_neuron.max = "1000";
    input_neuron.id = "nbNeuron" + modelStructure.nbLayers;
    input_neuron.value = "1";
    td_nbNeurons.appendChild(input_neuron);
    tr.appendChild(td_nbNeurons);

    let td_activation = document.createElement("td");
    let selectActivation = document.createElement("select");
    selectActivation.id = "activation" + modelStructure.nbLayers;
    let fonctions = ["elu", "selu", "relu", "LeakyReLU", "ThresholdedReLU",
        "tanh", "sigmoid", "linear", "softmax", "softplus", "softsign"
    ];
    let nbFun = fonctions.length;
    for (let i = 0; i < nbFun; i++) {
        let opt = document.createElement("option");
        opt.value = fonctions[i];
        opt.innerText = fonctions[i];
        selectActivation.appendChild(opt);
    }
    td_activation.appendChild(selectActivation);
    tr.appendChild(td_activation);

    document.getElementById("struct").querySelector("tbody").appendChild(tr);

}

/**
* Fonction déclenchée lorsque l'on demande la suppression d'une couche.
* Supprime la dernière couche paramétrable dans le tableau de l'interface
*  graphique de l'onglet Neural.
*/
function removeLayer() {
    let structure = document.getElementById("struct").querySelector("tbody");
    let idToRemove = "layer" + modelStructure.nbLayers; //on récupère l'id de la dernière couche
    let layerToRemove = document.getElementById(idToRemove);
    structure.removeChild(layerToRemove);
    modelStructure.nbLayers--;
    modelStructure.nbNeurons.pop();
    modelStructure.activationFun.pop();

}

/**
* Récupère les paramètres de configuration choisis par l'utilisateur
*/
function getNetworksParam() {
    inputNBrepetition = parseInt(document.getElementById("repetition").value);
    learningRate = parseFloat(document.getElementById("learningrate").value);
    for (let i = 1; i <= modelStructure.nbLayers; i++) {
        let inputNBNeurones = parseInt(document.getElementById("nbNeuron" + i).value);
        let activationType = document.getElementById("activation" + i).value;
        modelStructure.nbNeurons[i - 1] = inputNBNeurones;
        modelStructure.activationFun[i - 1] = activationType;
    }
    console.log(modelStructure);
}

/*
Création d'un réseau neuronal à partir des paramètres choisis par l'utilisateur.
Déclenchée quand l'utilisateur valide la configuration sur l'onglet Neural
*/
function createNeuralNetwork() {
    getNetworksParam();

    model = tf.sequential();

    //première couche traîtée à part car il faut rajouter l'inputShape
    let firstHiddenLayer = tf.layers.dense({
        inputShape: [nbinputShape],
        units: modelStructure.nbNeurons[0],
        activation: modelStructure.activationFun[0]
    });
    model.add(firstHiddenLayer);

    for (let i = 1; i < modelStructure.nbLayers; i++) {
        model.add(tf.layers.dense({
            units: modelStructure.nbNeurons[i],
            activation: modelStructure.activationFun[i]
        }));
    }
    ///couche de sortie
    let outputLayer = tf.layers.dense({
        units: nbZones, //en sortie, doit choisir l'une des zones de classification
        activation: 'softmax'
    });
    model.add(outputLayer);

    model.compile({
        optimizer: 'sgd',
        loss: 'meanSquaredError',
        lr: learningRate
    });
}

/**
* Sauvegarde le modèle et le télécharge dans deux fichiers nommés
* "my-model-1.json" et "my-model-1.weights.bin"
*/
async function saveModel() {
    saveResult = await model.save('downloads://my-model-1');
    console.log("Modèle sauvegardé");
    textToUser("Modèle sauvegardé");
}

/**
* Charge le modèle à partir des fichiers donnés.
* Ces fichiers doivent correspondre aux mêmes types que ceux renvoyés par model.save
*/
async function loadModelFromFiles() {
    model = await tf.loadModel(
        tf.io.browserFiles([jsonUpload.files[0], weightsUpload.files[0]]));

    model.compile({
        optimizer: 'sgd',
        loss: 'meanSquaredError',
        lr: learningRate
    });

    console.log("Modèle chargé");
    textToUser("Modèle chargé");
}
