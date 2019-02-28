let inputNBCouches;
let inputNBNeurones;
let activationType;
let inputNBrepetition;
let inputLearningRate;
let learningRate;

//const learningRate = 0.01;

let model;

function getNetworksParam() {
    inputNBCouches = parseInt(document.getElementById("couches").value);
    inputNBNeurones = parseInt(document.getElementById("neurones").value);
    activationType = document.getElementById("activation").value;
    inputNBrepetition = parseInt(document.getElementById("repetition").value);
    learningRate = parseFloat(document.getElementById("learningrate").value);
}

/*
Création d'un réseau neuronal à partir des paramètres choisis par l'utilisateur
*/
function createNeuralNetwork() {
    getNetworksParam();

    model = tf.sequential();
    repetition

    //première couche traîtée à part car il faut rajouter l'inputShape
    let firstHiddenLayer = tf.layers.dense({
        inputShape: [2],
        units: inputNBNeurones,
        activation: activationType
    });
    model.add(firstHiddenLayer);

    for (let i = 1; i < inputNBCouches; i++) {
        model.add(tf.layers.dense({
            units: inputNBNeurones,
            activation: activationType
        }));
    }

    ///couche de sortie
    let outputLayer = tf.layers.dense({
        units: 2,
        activation: 'softmax'
    });
    model.add(outputLayer);

    model.compile({
        optimizer: 'sgd',
        loss: 'meanSquaredError',
        lr: learningRate
    });
}