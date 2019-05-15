## Functions

<dl>
<dt><a href="#download">download(content, fileName, contentType)</a></dt>
<dd><p>Sert à télécharger une variable sur son bureau
Ne fonctionne pas sous firefox</p>
</dd>
<dt><a href="#textToUser">textToUser(msg)</a></dt>
<dd><p>Envoie un message à l&#39;utilisateur dans une div en bas de son éran</p>
</dd>
<dt><a href="#addToDisplayLearn">addToDisplayLearn(l, h)</a></dt>
<dd><p>Ajoute un rectangle sur la partie gauche du canvas</p>
</dd>
</dl>

<a name="download"></a>

## download(content, fileName, contentType)
Sert à télécharger une variable sur son bureauNe fonctionne pas sous firefox

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| content | <code>any</code> |  | La variable à télécharger |
| fileName | <code>String</code> |  | Le nom du fichier que l'on va télécharger |
| contentType | <code>String</code> | <code>application/json</code> | Le format sous lequel on veux le télécharger (JSON par défault) |

<a name="textToUser"></a>

## textToUser(msg)
Envoie un message à l'utilisateur dans une div en bas de son éran

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>String</code> | Le message à afficher |

<a name="addToDisplayLearn"></a>

## addToDisplayLearn(l, h)
Ajoute un rectangle sur la partie gauche du canvas

**Kind**: global function  

| Param | Type |
| --- | --- |
| l | <code>int</code> | 
| h | <code>int</code> | 

