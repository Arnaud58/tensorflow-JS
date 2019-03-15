let scaleIsActive = true;
let linksIsActive = false;
let colorIsActive = false;
let nbinputShape = 2;

function checkActiveParams() {

    if (document.getElementById('scaleParam').className == 'is-selected')
        scaleIsActive = true;
    else scaleIsActive = false;

    if (document.getElementById('linkParam').className == 'is-selected')
        linksIsActive = true;
    else linksIsActive = false;

    if (document.getElementById('colorParam').className == 'is-selected')
        colorIsActive = true;
    else colorIsActive = false;

    console.log("Activation des params :")
    console.log(scaleIsActive);
    console.log(linksIsActive);
    console.log(colorIsActive);

    nbinputShape = computeNbinputShape();

    textToUser("Nouveaux paramètres enregistrés");
}

function computeNbinputShape() {
    res = 0;
    if (scaleIsActive) {
        res += 2;
    }
    if (linksIsActive) {
        res += 1;
    }
    if (colorIsActive) {
        res += 3;
    }
    return res;
}


function generateTensorFor1Square(l, h, colorSquare, link) {
    res = [];

    if (scaleIsActive) {
        append(res, l);
        append(res, h);
    }
    if (linksIsActive) {
        append(res, link / 10);
    }
    if (colorIsActive) {
        append(res, colorSquare[0] / 255);
        append(res, colorSquare[1] / 255);
        append(res, colorSquare[2] / 255);
    }

    return tf.tensor2d(res, [1, nbinputShape]);
}

function generateTensorForAllSquare() {
    res = [];

    for (j = 0; j < all_squares_learn.posLearn.length; j++) {
        if (scaleIsActive) {
            append(res, all_squares_learn.squareLearn[j * 2]);
            append(res, all_squares_learn.squareLearn[j * 2 + 1]);
        }
        if (linksIsActive) {
            append(res, all_squares_learn.linksLearn[j] / 10);
        }
        if (colorIsActive) {
            append(res, all_squares_learn.colorLearn[j][0] / 255);
            append(res, all_squares_learn.colorLearn[j][1] / 255);
            append(res, all_squares_learn.colorLearn[j][2] / 255);
        }
    }

    return tf.tensor2d(res, [all_squares_learn.posLearn.length, nbinputShape]);
}

function expectedZone(height, width, color){
  let area = height*width;
  if (color == LIGHT_FUCHSIA_PINK || color == ULTRA_PINK || color == PALE_PINK){
    if (area>areaLimit) return 0;
    else return 3;
  }
  else if (color == BANANA_MANIA || color == DANDELION || color == SUNSET_ORANGE){
    if (area>areaLimit) return 1;
    else return 4;
  }
  else{
  console.log("SOME BLUE OR GREEN ...");
    if (area>areaLimit) return 2;
    else return 5;
  }
}

function vectorFromExpectedZone(zoneExpected){
  let res = []  //construit un vecteur de la forme [0,0,1,0,0,0] pour représenter les zones possibles
  for (let i=0; i<6; i++){
    if (i==zoneExpected) res.push(1);
    else res.push(0);
  }
  return res;
}
