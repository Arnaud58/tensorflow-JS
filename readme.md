Démarche à suivre
=================

Utiliser une seule couche de neurones. <br/>
Construire mini réseau de neurone avec 2 jeux, un jeu d'apprentisage et un jeu de test. <br/>
Etoffer le réseau au fur et à mesure avec un nombre de couches et un nombre de neurones différents.

![](assets/d1.png)

Fonctions d'activation à tester :
 - Relu
 - pRelu
 - leakyRelu
 - softmax ou sigmoid pour la couche de sortie
 
 
![](assets/d2.png)


 Dans un premier temps, on prend en compte la grosseur des classes (taille des rectangles) mais on pourra aussi compliquer la chose par la suite avec plus de paramètres d'entrée et de sortie. <br/>
=> Récupérer ces données à l'aide de fichiers JSON <br/>
(Pour la taille d'une classe, on se basera sur la longueur de la plus grande ligne à l'intérieur et au nombre de lignes)

Ce qui a été réalisé
====================

(dans branche Master) <br/>
Interaction avec des boutons permettant de décider le nombre de rectangles qui vont servir pour l'apprentissage et décider des données d'entrée pour la prédiction.
- Add one learn square. Ajoute un seul rectangle à l'apprentissage du modèle
- Add 100 learn squares. Ajoute 100 rectangles à l'apprentissage du modèle (déprécié !)
- Ajout auto. Ajoute un rectangle à l'apprentissage du modèle par seconde.

- Predict. Essaye de prédire la position d'un rectangle et l'affiche à droite. (hauteur et largueur doivent être < 400 !)
- Predict the test. Envoie les données d'apprentissage sur la prédiction et affiche le pourcentage de réussite.
- Predict from a file. Ne marche pas encore.

(dans branche ellie) <br/>
Une deuxième version a été faite, où cette fois un jeu de données est généré dès le début et le résultat est directement affiché (avec les rectangles des données à gauche et les rectangles prédits à droite).
On affiche également sur la console le pourcentage de bonnes prédictions.



Liens
=====

 [Enregistrer JSON](https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file)
 
NB
==
Nous utilisons P5 et MDL pour l'affichage de la page et le dessins dans le canvas.
