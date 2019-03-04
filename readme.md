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

Onglet _Neural_ : <br/>
Une interface permet de paramétrer le réseau neuronal (nb de couches, nb de neurones, fonctions d'activation, learning rate)

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

Onglet _Save and Load Model_ : (__REMARQUE :__ Ne fonctionne qu'avec Google Chrome)
- *Save Model*. Télécharge la confiugation du modèle et les poids dans deux fichiers `my-model-1.json` et `my-model-1.weights.bin`
- *Upload Json Model* et *Upload weights*. Charge le fichier json et le .bin contenant le modèle et les poids (de la même forme que ceux téléchargeables via *Save Model*)
- *Load Model*. Charge le modèle après que l'on ait préalablement chargé les fichiers requis via les deux boutons précédents. ( Ne fonctionne pas encore)

Serveur
=======

Se mettre dans le dossier et éxécuter la commande `php -S localhost:8000` pour lancer un serveur qui renvéras vers ce lien : [localhost:8000/testGenerate.html](http://localhost:8000/testGenerate.html)

Faire : 
~~~~
cd web
php -S localhost:8000
~~~~


Liens
=====

 [Enregistrer JSON](https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file)

 Pour sauvegarder le modèle : <br/>
 https://js.tensorflow.org/tutorials/model-save-load.html

NB
==
Nous utilisons P5 et MDL pour l'affichage de la page et le dessin dans le canvas.
