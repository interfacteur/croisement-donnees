Croiser des séries de données
==================


Croiser der séries de données numériques pour en visualiser les intersections max, min etc., personnalisation des données, pour navigateurs standards (une partie du code est de 2014, à reprendre en OO ?)

L'interface : http://www.equatorium.net/e1/in-croisement-ens-donnees.html

Une note de présentation : http://interfacteur.blogspot.fr/2016/01/croiser-donnees.html

 Analyse des amplitudes des intersections entre tableaux ("régions", "albums" etc.) :
* la plus large
* la plus importante
* la moins large
* la moins importante
* la plus profonde
* données les plus répandues
* données les moins répandues

To do :
* FONCTIONNALITES
	- avec d'autres données que numériques
* ACCESSIBILITÉ
	- couche ARIA ?
	- tester Voice Over ou NVDA : .on("keyup", (cf. this.$lien.on("mouseover keyup", Visu.passer);)
* COMPATIBILITÉ
	- tests sur MSIE
* DÉVELOPPEMENT
	- reprendre en orientation prototypale, ou orienté objet ES6 ? (- evenements.js OK)
	- $c.remove(); //to do: detach() pour tous cas semblables ?
* PRESENTATION
	- effets de transition (notamment sur Chrome ?)
