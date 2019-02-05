let dimensions = [];
let positions = [];

const learningRate = 0.5;
const optimizer = 'sgd';
let model;

function randomInt(max){
  return Math.floor(Math.random() * Math.floor(max));
}


function generateDataSet(){
  for (var i = 0; i<100; i++){
    largeur = randomInt(400);
    hauteur = randomInt(400);
    dimensions.push([hauteur, largeur]);
    if (hauteur*largeur>30000)
      positions[i] = [1];
    else
      positions[i] = [0];
  }
}

function createNeuralNetwork(){
  model = tf.sequential();

  const hiddenConfig = {
      inputShape : [2],
      units: 4,
      activation: 'relu'
  };
  const outputConfig = {
    units: 1,
    activation: 'sigmoid'
  };
  let hiddenLayer = tf.layers.dense(hiddenConfig);
  let outputLayer = tf.layers.dense(outputConfig);
  model.add(hiddenLayer);
  model.add(outputLayer);

  model.compile({
    optimizer: optimizer,
    loss: 'binaryCrossentropy',
    lr: learningRate
  });
}



async function predictOutput(){

  createNeuralNetwork();
  console.log("Neural network created");

  const xs = tf.tensor2d(dimensions);
  xs.print();

  await model.fit(x_train,y_train, {batchsize:1, epochs:1});
  let ys = model.predict(xs);
  ys.print();
}


generateDataSet();
let x_train = tf.tensor2d(dimensions);
console.log("x_train");
x_train.print();
let y_train = tf.tensor2d(positions);
console.log("y_train");
y_train.print();

predictOutput();
