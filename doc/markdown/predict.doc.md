## Functions

<dl>
<dt><a href="#predictFromUser">predictFromUser()</a></dt>
<dd><p>Fonction qui ajoute aux tableau à prédire la séléction de l&#39;utilisateur</p>
</dd>
<dt><a href="#checkResZone">checkResZone(resArray)</a> ⇒</dt>
<dd><p>Retourne le numéro de la zone obtenue en résultat en fonction du tableau retourné
par le réseau neuronal</p>
</dd>
<dt><a href="#predictTheTests">predictTheTests()</a></dt>
<dd><p>Prédit les donnée d&#39;apprentisage (all_squares_learn.squareLearn)
et les affiches sur la partie droite du canvas
Donne un % de réussite des prédictions</p>
</dd>
<dt><a href="#predictAndDisplay">predictAndDisplay(lgr, htr, color, link)</a> ⇒ <code>Array.&lt;Array&gt;</code></dt>
<dd><p>Predie le rectangle donné en paramètre
Renvoie le résultat de la prédiction (voir  model.predict()) et si la prédiction est corrécte ou mauvaise</p>
</dd>
<dt><a href="#loadAndPredict">loadAndPredict()</a></dt>
<dd><p>Charge un fichier JSON et fait la prédiction sur les données qu&#39;il contient</p>
</dd>
</dl>

<a name="predictFromUser"></a>

## predictFromUser()
Fonction qui ajoute aux tableau à prédire la séléction de l'utilisateur

**Kind**: global function  
<a name="checkResZone"></a>

## checkResZone(resArray) ⇒
Retourne le numéro de la zone obtenue en résultat en fonction du tableau retourné
par le réseau neuronal

**Kind**: global function  
**Returns**: le numéro de la zone correpondante  

| Param | Type | Description |
| --- | --- | --- |
| resArray | <code>Array.&lt;float&gt;</code> | le tableau contenant les résultats retournés par TensorFlow |

<a name="predictTheTests"></a>

## predictTheTests()
Prédit les donnée d'apprentisage (all_squares_learn.squareLearn)
et les affiches sur la partie droite du canvas
Donne un % de réussite des prédictions

**Kind**: global function  
<a name="predictAndDisplay"></a>

## predictAndDisplay(lgr, htr, color, link) ⇒ <code>Array.&lt;Array&gt;</code>
Predie le rectangle donné en paramètre
Renvoie le résultat de la prédiction (voir  model.predict()) et si la prédiction est corrécte ou mauvaise

**Kind**: global function  
**Returns**: <code>Array.&lt;Array&gt;</code> - Le tableau contient un tableau qui représente le tensor de la prédiction et un boolen, le boolen vaux Vrai si la prédiction est mauvaise et Faux sinon  

| Param | Type | Description |
| --- | --- | --- |
| lgr | <code>int</code> | La largeur du rectangle |
| htr | <code>int</code> | La hauteur du rectangle |
| color | <code>Array.&lt;int&gt;</code> | tableau contenant les valeurs RGB de la couleur |
| link | <code>int</code> | nombre de liens associé au rectangle |

<a name="loadAndPredict"></a>

## loadAndPredict()
Charge un fichier JSON et fait la prédiction sur les données qu'il contient

**Kind**: global function  
