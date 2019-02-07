Démarche à suivre
=================

Utiliser une seule couche de neurones. <br/>
Construire mini réseau de neurone avec 2 jeux, un jeu d'apprentisage et un jeu de test. <br/>
Etoffer le réseau au fur et à mesure avec un nombre de couches et un nombre de neurones différents.

Fonctions d'activation à tester :
 - Relu
 - pRelu
 - leakyRelu
 - softmax pour la couche de sortie

 Dans un premier temps, on prend en compte la grosseur des classes (taille des rectangles) mais on pourra aussi compliquer la chose par la suite avec plus de paramètres d'entrée et de sortie. <br/>
=> Récupérer ces données à l'aide de fichiers JSON <br/>
(Pour la taille d'une classe, on se basera sur la longueur de la plus grande ligne à l'intérieur et au nombre de lignes)

Ce qui a été réalisé
====================
(dans branche ellie) <br/>
Un jeu de données est créé (aléatoirement pour l'instant). Ce jeu de données contient une série de rectangles définis par leurs dimensions et leur position. <br/>
Le réseau neuronal fait l'apprentissage à partir de ces données et fait une prédiction de la position à partir des dimensions des rectangles.
Pour l'affichage nous avons un canevas divisé en deux partie :
- la partie de gauche sert à afficher les rectangles du jeu de données
- la partie de droite affiche les rectangles positionnés selon la prédiction. Ceux qui sont bien placés sont en vert, ceux qui sont au mauvais endroit sont en rouge. 
  
On affiche également sur la console le pourcentage de bonnes prédictions.


Liens
====

 [Enregistrer JSON](https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file)
