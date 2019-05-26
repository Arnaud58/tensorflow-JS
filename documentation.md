# Documentation

Rougetet Arnaud, Beauprez Ellie

Dépôt Github : https://github.com/Arnaud58/test-tensorflow

Ce document est un complément du rapport que nous avons rédigé. <br/>
À noter que la documentation détaillée des fonctions se trouve dans le dossier *doc* sur le dépôt Github.


Le projet utilise du JS pur et ne demande aucune installation particulière pour fonctionner, à part un navigateur internet. Il est recommandé d'avoir "Chrome" et "Firefox" d’installés. Certaines fonctionnalités peuvent ne marcher qu'avec Chrome (comme par exemple la manipulation des fichiers json).

Les librairies JS utilisé sont :
* [TensorFlow Version 0.11.1](https://js.tensorflow.org/api/0.11.1/)
* [TensorFlow Vis](https://js.tensorflow.org/api_vis/latest/)
* [P5](https://p5js.org/reference/#/p5/)
* [Material Design](https://getmdl.io/components/index.html#layout-section)

Voir code :
```html
<!-- TensorFlow et  TensorFlow-Vis -->
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@0.11.1"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-vis"></script>

<!-- P5 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.0/p5.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.0/addons/p5.dom.js"></script>

<!-- Material Design -->
<link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.green-amber.min.css">
<script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
```
<br>



Des tutos de tensorFlow et des exemples peuvent être trouvés ici :
* [Vidéo Youtube sur le tensorFlow](https://www.youtube.com/watch?v=dLp10CFIvxI)
* [Code correspondant à la vidéo](https://github.com/CodingTrain/website/tree/master/CodingChallenges/CC_104_tf_linear_regression)


<br><br>

Le fichier index.html utilise 5 fichier JS qui permette de créer son propre réseau neuronal et de lui faire apprendre des positions de rectangle.

La documentation des 5 fichier JS peut être trouvé ici :
* [Sketch.js](https://github.com/Arnaud58/test-tensorflow/wiki/sketch) Implémente la fonction Setup de p5 qui ai lancé au chargement de la page. Ce fichier gère l'initialisation de la page et l'affichage des résultat sur le canvas.
* [Params.js](https://github.com/Arnaud58/test-tensorflow/wiki/params) Gère les paramètre rentré dans l'onglet "Param" de la page. Les paramètres permette de géré ce que l'on prend en compte pour apprentissage : la taille, les liens, la couleur du rectangle ou une combinaison linéaire des 3.
* [Neural.js](https://github.com/Arnaud58/test-tensorflow/wiki/neural) qui permet de géré la création d'un réseau de neurone. La création se fait en fonction des paramètre mis dans l'onglet "Neural". On peut réglé le nombre de couche, le nombre de neurone par couche et la fonction d'activation dans chaque couche.
* [Training.js](https://github.com/Arnaud58/test-tensorflow/wiki/training) Gère l’entraînement du réseau en lui donnant des exemples de rectangle et leur placement. On peut lui en donner un particulier en lui précisant sa taille, sa couleur et son nombre de lien ou en géré automatiquement en continue.
* [Predict.js](https://github.com/Arnaud58/test-tensorflow/wiki/predict) Gère la prédiction via le modèle de certain rectangle. On peut donné un rectangle particulier en lui précisant sa taille, sa couleur et son nombre de lien et le modèle tente de prédire sa place sur le canvas. On peut aussi prédire tous les rectangles d’entraînement. Donne alors un % de réussite.  


## Utilisation de TensorFlow.js

### Configuration du réseau neuronal

Dans cette partie nous expliquons comment fonctionne la création du réseau neuronal et ce à quoi correspondent les paramètres choisis pour sa configuration.
- __Initialisation__ <br/>
L'initialisation du modèle se fait de cette manière : `let model = tf.sequential();`<br/>
Le mode "*sequential*" est le plus facile à manipuler. Cela fonctionne comme une suite linéaire de couches dont les sorties de l'une sont reliées aux entrées de la suivante. Une autre possibilité est d'utiliser `tf.model(layers)` qui offre plus de contrôle et permets de faire des branchements plus personnalisés entre les couches.

- __Création des couches cachées__ <br/>
```js
let layer = tf.layers.dense({
    inputShape: [2], //nombre de paramètres d'entrée, seulement requis pour la 1ère couche cachée
    units: nbNeurons, //nombre de neurones de cette couche
    activation: activationFunction //fonction d'activation utilisée
});
model.add(firstHiddenLayer); //ajoute la couche au modèle
```
Rq : *dense()* signifie que c'est une couche entièrement connectée.

- __Compilation du modèle__ <br/>
Cette étape sert à préparer le modèle pour l'entraînement et l'évaluation.
```js
model.compile({
    optimizer: 'sgd',
    loss: 'meanSquaredError',
    lr: learningRate
});
```
*optimizer* : Méthode de minimisation d'erreur utilisée. Ici, nous utilisons *sgd* pour la *descente de gradient stochastique*. <br/>
*loss* : fonction utilisée pour le calcul de l'erreur. Ici nous utilisons *meanSquaredError*. <br/>
*lr* : Learning rate. Représente un coefficient lors de la minimisation pour déterminer quel sera le point suivant. Avec un learning rate petit, l'algorithme sera plus lent (car on fait des plus petits pas) mais sera plus précis pour trouver le minimum de la fonction d'erreur. Avec un learning rate grand, le calcul sera plus rapide mais potentiellement moins précis car avec des pas trop grands on risque de rater le minimum.



## Description de l'interface réalisée

### Branche "master"

Onglet _Neural_ : <br/>
Une interface permet de paramétrer le réseau neuronal (nb de couches, et pour chacune de ces couches le nb de neurones et la fonction d'activation, learning rate)

Onglet _Param_ : <br/>
Permet de cocher les paramètres que l'on veut prendre en compte pour la classification (taille, nb de liens, couleurs).
Fonctionnel, que l'on choisisse la taille, les couleurs, les liens ou plusieurs paramètres en même temps. <br/>
Pour pouvoir tester notre réseau, nous avons choisi arbitrairement une classification qui découpe l'aire de travail en plusieurs zones, selon les paramètres choisis. <br/>
Par exemple, lorsque l'on choisi la taille et la couleur comme paramètres, les grands rectangles roses doivent être placés dans la 1ère zone. <br/>
Pour simplifier le problème, lorsque qu'on coche la taille, la couleur et le nombre de liens en même temps, le nombre de liens devient prioritaire par rapport à la taille. <br/>
*Remarque :* Les rectangles avec un grand nombre de liens (>10) seront affichés avec un contour vert.

Onglet _Learning_ : <br/>
Interaction avec des boutons permettant de décider le nombre de rectangles qui vont servir pour l'apprentissage et décider des données d'entrée pour la prédiction.
- *Add one learn square*. Ajoute un seul rectangle à l'apprentissage du modèle
- *Learn from a file*. Permet de charger des données à partir d'un fichier et de faire l'apprentissage (pas encore fonctionnel)
- *Ajout auto*. Ajoute un rectangle à l'apprentissage du modèle par seconde.
- *Save*. Permet d'enregistrer les données générées dans un fichier json (ne marche pas sur Firefox, mais fonctionne sur Chrome)

Onglet _Predict_ : <br/>
- *Predict*. Essaye de prédire la position d'un rectangle et l'affiche à droite. (hauteur et largueur doivent être < 400 !)
- *Predict the test*. Envoie les données d'apprentissage sur la prédiction et affiche le pourcentage de réussite.
- *Predict from a file*. Permet d'afficher les prédictions à partir de données stockées dans un fichier json

Onglet _Save and Load Model_ : (__REMARQUE :__ Ne fonctionne qu'avec Google Chrome et Chromium)
- *Save Model*. Télécharge la configuration du modèle et les poids dans deux fichiers `my-model-1.json` et `my-model-1.weights.bin`
- *Upload Json Model* et *Upload weights*. Charge le fichier json et le .bin contenant le modèle et les poids (de la même forme que ceux téléchargeables via *Save Model*)
- *Load Model*. Charge le modèle après que l'on ait préalablement chargé les fichiers requis via les deux boutons précédents.

Onglet _Graph_ : <br/>
Affiche le graphe d'erreurs et la matrice de confusion


### Branche "interactive"

/!\ A COMPLETER


## Détails techniques

### Classification

Comme expliqué dans le rapport, nous avons dû pour des raisons pratiques fixer nous même la façon dont sont classifiés les rectangles selon les paramètres pris en compte. <br/>
Ci-dessous sont décrits les types de classifications choisis pour chaque combinaison de paramètres. <br/>
Par défaut, un rectangle est considéré comme "grand" si son aire dépasse 30000 pixels, et il est considéré comme "fortement lié" si son nombre de liens dépasse 10. Ces valeurs peuvent être modifiées via les variables *areaLimit* et *links_max* dans sketch.js

```
TAILLE :
*-------*
|   0   |
*-------*
|   1   |
*-------*
0 : Grand rectangle
1 : Petit rectangle

COULEUR :
*-------*-------*-------*
|   0   |   1   |   2   |
*-------*-------*-------*
0 : rose
1 : jaune et orange
2 : bleu et vert

COULEUR + TAILLE :
*-------*-------*-------*
|   0   |   2   |   4   |
| (0,0) | (1,0) | (2,0) |
*-------*-------*-------*
|   1   |   3   |   5   |
| (0,1) | (1,1) | (2,1) |
*-------*-------*-------*
(x,0) : Grand rectangle
(x,1) : Petit rectangle
(0,x) : rose
(1,x) : jaune et orange
(2,x) : bleu et vert
Exemple : un petit rectangle rose sera dans la zone 1, un grand rectangle jaune sera dans la zone 2.


TAILLE + NB LIENS
*-------*-------*
|   0   |   2   |
| (0,0) | (1,0) |
*-------*-------*
|   1   |   3   |
| (0,1) | (1,1) |
*-------*-------*
(x,0) : Bcp de liens
(x,1) : Peu de liens
(0,x) : Grands rectangles
(1,x) : Petits rectangles


COULEUR + NB LIENS
*-------*-------*-------*
|   0   |   2   |   4   |
| (0,0) | (1,0) | (2,0) |
*-------*-------*-------*
|   1   |   3   |   5   |
| (0,1) | (1,1) | (2,1) |
*-------*-------*-------*
(x,0) : Bcp de liens
(x,1) : Peu de liens
(0,x) : rose
(1,x) : jaune et orange
(2,x) : bleu et vert

TAILLE + COULEUR + NB DE LIENS
Dans ce cas, le nb de liens devient prioritaire par rapport et la taille ne compte plus
Même classification que pour COULEUR + LIENS
```
