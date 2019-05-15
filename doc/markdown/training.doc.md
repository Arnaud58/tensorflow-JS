## Functions

<dl>
<dt><a href="#addSquare">addSquare()</a></dt>
<dd><p>Ajoute un rectangle aux données d&#39;apprentissage, et réalise l&#39;apprentissage
avec le modèle et les données actuelles</p>
</dd>
<dt><a href="#trainSquare">trainSquare(l, h, color, link)</a></dt>
<dd><p>Entraîne le modèle à partir du rectangle dont les caractéristiques sont
données en paramètres.
Le retour de la fonction d&#39;entraînement est stocké dans une promesse dans la
variable oldHistory</p>
</dd>
<dt><a href="#trainAllSquares">trainAllSquares()</a></dt>
<dd><p>Entraîne le modèle avec tous les rectangles dont les données sont
contenues dans all_squares_learn
Le retour de la fonction d&#39;entraînement est stocké dans une promesse dans la
variable oldHistory</p>
</dd>
<dt><a href="#loadAndTrain">loadAndTrain()</a></dt>
<dd><p>Charge les données depuis un fichier JSON et entraîne le modèle à partir des
données ainsi récupérées</p>
</dd>
</dl>

<a name="addSquare"></a>

## addSquare()
Ajoute un rectangle aux données d'apprentissage, et réalise l'apprentissage
avec le modèle et les données actuelles

**Kind**: global function  
<a name="trainSquare"></a>

## trainSquare(l, h, color, link)
Entraîne le modèle à partir du rectangle dont les caractéristiques sont
données en paramètres.
Le retour de la fonction d'entraînement est stocké dans une promesse dans la
variable oldHistory

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| l | <code>int</code> | la largeur normalisée (avec une valeur comprise entre 0 et 1) |
| h | <code>int</code> | la hauteur normalisée |
| color | <code>Array.&lt;int&gt;</code> | tableau contenant les valeurs RBG de la couleur |
| link | <code>int</code> | nombre de liens associé au rectangle |

<a name="trainAllSquares"></a>

## trainAllSquares()
Entraîne le modèle avec tous les rectangles dont les données sont
contenues dans all_squares_learn
Le retour de la fonction d'entraînement est stocké dans une promesse dans la
variable oldHistory

**Kind**: global function  
<a name="loadAndTrain"></a>

## loadAndTrain()
Charge les données depuis un fichier JSON et entraîne le modèle à partir des
données ainsi récupérées

**Kind**: global function  
