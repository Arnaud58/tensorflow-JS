## Functions

<dl>
<dt><a href="#checkActiveParams">checkActiveParams()</a></dt>
<dd><p>Récupère les paramètres cochés dans l&#39;onglet Params et calcule le nombre de
zones de classification nécessaires en conséquence.</p>
</dd>
<dt><a href="#setNbZones">setNbZones()</a></dt>
<dd><p>Retourne le nombre nécessaire de zones pour la classification,
en se basant sur les paramètres activés par l&#39;utilisateur.</p>
</dd>
<dt><a href="#setNbZonesXY">setNbZonesXY()</a></dt>
<dd><p>Met à jour les variables xZones et yZones en leur donnant les nombres de zones
selon les axes horizontal et vertical.</p>
</dd>
<dt><a href="#sliceInZones">sliceInZones(height, width, nombre, nombre)</a></dt>
<dd><p>Découpe l&#39;aire de travail en plusieurs zones pour permettre la classification</p>
</dd>
<dt><a href="#computeNbinputShape">computeNbinputShape()</a></dt>
<dd><p>Calcule la taille de l&#39;entrée du réseau neuronal en fonction des paramètres
actifs</p>
</dd>
<dt><a href="#generateTensorFor1Square">generateTensorFor1Square()</a></dt>
<dd><p>Génère un tenseur représentant le rectangles dont les caractéristiques sont
données en arguments en fonction des paramètres actifs pour l&#39;apprentissage</p>
</dd>
<dt><a href="#generateTensorForAllSquare">generateTensorForAllSquare()</a></dt>
<dd><p>Génère un tenseur représentant les données pour tous les rectangles en
fonction des paramètres actifs pour l&#39;apprentissage</p>
</dd>
<dt><a href="#expectedZone">expectedZone(height, width, color, nbLinks)</a></dt>
<dd><p>Retourne le numéro de la zone correspondant à un rectangle en fonction de ses caractéristiques.
On calcule ici en quelque sorte les labels correspondants aux données générées.</p>
</dd>
<dt><a href="#expectedZoneScale">expectedZoneScale(height, width)</a></dt>
<dd><p>Retourne le numéro zone correspondant à un rectangle en fonction de ses caractéristiques
dans le cas où le seule paramètre actif est la taille</p>
</dd>
<dt><a href="#expectedZoneLinks">expectedZoneLinks(nbLinks)</a></dt>
<dd><p>Retourne le numéro de la zone correspondant à un rectangle en fonction de ses caractéristiques
dans le cas où le seule paramètre actif est le nombre de liens</p>
</dd>
<dt><a href="#expectedZoneColor">expectedZoneColor(color)</a></dt>
<dd><p>Retourne le numéro de la zone correspondant à un rectangle en fonction de ses caractéristiques
dans le cas où le seule paramètre actif est la couleur</p>
</dd>
<dt><a href="#expectedZoneScaleColor">expectedZoneScaleColor(height, width, color)</a></dt>
<dd><p>Retourne le numéro zone correspondant à un rectangle en fonction de ses caractéristiques
dans le cas où les paramètres actifs sont la taille et la couleur</p>
</dd>
<dt><a href="#expectedZoneScaleLinks">expectedZoneScaleLinks(height, width, nbLinks)</a></dt>
<dd><p>Retourne le numéro zone correspondant à un rectangle en fonction de ses caractéristiques
dans le cas où les paramètres actifs sont la taille et le nombre de liens</p>
</dd>
<dt><a href="#expectedZoneColorLinks">expectedZoneColorLinks(color, nbLinks)</a></dt>
<dd><p>Retourne le numéro zone correspondant à un rectangle en fonction de ses caractéristiques
dans le cas où les paramètres actifs sont la couleur et le nombre de liens</p>
</dd>
<dt><a href="#vectorFromExpectedZone">vectorFromExpectedZone(zoneExpected)</a></dt>
<dd><p>Retourne un vecteur correspondant au résultat attendu en sortie du réseau neuronal
en fonction des paramètres actifs et de la zone attendue
Exemple :
Si les paramètres actifs sont la taille et la couleur et qu&#39;un rectangle doit
être placé dans la zone 2, alors vectorFromExpectedZone(2) renvoie [0,0,1,0,0,0]</p>
</dd>
</dl>

<a name="checkActiveParams"></a>

## checkActiveParams()
Récupère les paramètres cochés dans l'onglet Params et calcule le nombre de
zones de classification nécessaires en conséquence.

**Kind**: global function  
<a name="setNbZones"></a>

## setNbZones()
Retourne le nombre nécessaire de zones pour la classification,
en se basant sur les paramètres activés par l'utilisateur.

**Kind**: global function  
<a name="setNbZonesXY"></a>

## setNbZonesXY()
Met à jour les variables xZones et yZones en leur donnant les nombres de zones
selon les axes horizontal et vertical.

**Kind**: global function  
<a name="sliceInZones"></a>

## sliceInZones(height, width, nombre, nombre)
Découpe l'aire de travail en plusieurs zones pour permettre la classification

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| height | <code>int</code> | hauteur de la zone à découper |
| width | <code>int</code> | largeur de la zone à découper |
| nombre | <code>xZones</code> | de zones voulue sur l'axe horizontal |
| nombre | <code>yZones</code> | de zones voulue sur l'axe vertical |

<a name="computeNbinputShape"></a>

## computeNbinputShape()
Calcule la taille de l'entrée du réseau neuronal en fonction des paramètres
actifs

**Kind**: global function  
<a name="generateTensorFor1Square"></a>

## generateTensorFor1Square()
Génère un tenseur représentant le rectangles dont les caractéristiques sont
données en arguments en fonction des paramètres actifs pour l'apprentissage

**Kind**: global function  
<a name="generateTensorForAllSquare"></a>

## generateTensorForAllSquare()
Génère un tenseur représentant les données pour tous les rectangles en
fonction des paramètres actifs pour l'apprentissage

**Kind**: global function  
<a name="expectedZone"></a>

## expectedZone(height, width, color, nbLinks)
Retourne le numéro de la zone correspondant à un rectangle en fonction de ses caractéristiques.
On calcule ici en quelque sorte les labels correspondants aux données générées.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| height | <code>int</code> | la hauteur du rectangle |
| width | <code>int</code> | la largeur du rectangle |
| color | <code>Array.&lt;int&gt;</code> | valeurs RGB de la couleur du rectangle |
| nbLinks | <code>int</code> | le nombre de liens associé au rectangle |

<a name="expectedZoneScale"></a>

## expectedZoneScale(height, width)
Retourne le numéro zone correspondant à un rectangle en fonction de ses caractéristiques
dans le cas où le seule paramètre actif est la taille

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| height | <code>int</code> | la hauteur du rectangle |
| width | <code>int</code> | la largeur du rectangle |

<a name="expectedZoneLinks"></a>

## expectedZoneLinks(nbLinks)
Retourne le numéro de la zone correspondant à un rectangle en fonction de ses caractéristiques
dans le cas où le seule paramètre actif est le nombre de liens

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| nbLinks | <code>int</code> | le nombre de liens associé au rectangle |

<a name="expectedZoneColor"></a>

## expectedZoneColor(color)
Retourne le numéro de la zone correspondant à un rectangle en fonction de ses caractéristiques
dans le cas où le seule paramètre actif est la couleur

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>Array.&lt;int&gt;</code> | valeurs RGB de la couleur du rectangle |

<a name="expectedZoneScaleColor"></a>

## expectedZoneScaleColor(height, width, color)
Retourne le numéro zone correspondant à un rectangle en fonction de ses caractéristiques
dans le cas où les paramètres actifs sont la taille et la couleur

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| height | <code>int</code> | la hauteur du rectangle |
| width | <code>int</code> | la largeur du rectangle |
| color | <code>Array.&lt;int&gt;</code> | valeurs RGB de la couleur du rectangle |

<a name="expectedZoneScaleLinks"></a>

## expectedZoneScaleLinks(height, width, nbLinks)
Retourne le numéro zone correspondant à un rectangle en fonction de ses caractéristiques
dans le cas où les paramètres actifs sont la taille et le nombre de liens

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| height | <code>int</code> | la hauteur du rectangle |
| width | <code>int</code> | la largeur du rectangle |
| nbLinks | <code>int</code> | le nombre de liens associé au rectangle |

<a name="expectedZoneColorLinks"></a>

## expectedZoneColorLinks(color, nbLinks)
Retourne le numéro zone correspondant à un rectangle en fonction de ses caractéristiques
dans le cas où les paramètres actifs sont la couleur et le nombre de liens

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>Array.&lt;int&gt;</code> | valeurs RGB de la couleur du rectangle |
| nbLinks | <code>int</code> | le nombre de liens associé au rectangle |

<a name="vectorFromExpectedZone"></a>

## vectorFromExpectedZone(zoneExpected)
Retourne un vecteur correspondant au résultat attendu en sortie du réseau neuronal
en fonction des paramètres actifs et de la zone attendue
Exemple :
Si les paramètres actifs sont la taille et la couleur et qu'un rectangle doit
être placé dans la zone 2, alors vectorFromExpectedZone(2) renvoie [0,0,1,0,0,0]

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| zoneExpected | <code>int</code> | le numéro de la zone attendue |

