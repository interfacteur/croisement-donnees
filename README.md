Croiser des séries de données
==================


Croiser der séries de données numériques pour en visualiser les intersections possibles, personnalisation des données, pour navigateurs standards (une partie du code est de 2014, à reprendre en OO ?)

L'interface : http://www.equatorium.net/e1/in-croisement-ens-donnees.html

<!-- Une note de présentation : http://interfacteur.blogspot.fr/2016/01/croiser-donnees.html -->

 Analyse des amplitudes des intersections entre tableaux ("régions", "albums" etc.) :
* la moins large
* la moins étendue
* la plus large
* la plus étendue
* la plus profonde
* données les plus répandues
* données les moins répandues

To do :
* FONCTIONNALITES
	- analyse des croisements les plus riches entre deux tableaux (comme un bouton cliquable plus que comme une analyse)
- analyse du croisement minimal entre tous les tableaux (comme un bouton cliquable plus que comme une analyse)
- avec d'autres données que numériques
* ACCESSIBILITÉ
- couche ARIA ?
- tester Voice Over ou NVDA : .on("keyup", (cf. this.$lien.on("mouseover keyup", Visu.passer);)
* COMPATIBILITÉ
- tests sur MSIE
* DÉVELOPPEMENT
- reprendre en orientation prototypale, ou orienté objet ES6 ? (- evenements.js OK)
* PRESENTATION
- effets de transition (notamment sur Chrome ?)
