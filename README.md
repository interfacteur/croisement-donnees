Croiser des séries de données
==================


Croiser des séries de données numériques pour en visualiser les diverses intersections, éléments partagés etc., avec personnalisation des données, pour navigateurs standards.

L'interface : http://www.equatorium.net/e1/in-croisement-ens-donnees.html

Une note de présentation : http://interfacteur.blogspot.fr/2016/01/croiser-donnees.html

 Analyse des amplitudes des partages entre tableaux ("régions", "albums" etc.) :
* le plus important
* le plus large
* le moins important
* le moins large
* le plus profond
* données les plus répandues
* données les moins répandues

To do :
* FONCTIONNALITES
	- avec d'autres données que numériques
	- que faire quand partage le plus important == partage le moins important ?
* ACCESSIBILITÉ
	- couche ARIA ?
	- tester Voice Over ou NVDA : .on("keyup", (cf. this.$lien.on("mouseover keyup", Visu.passer);)
* COMPATIBILITÉ
	- tests sur MSIE
* DÉVELOPPEMENT
	- reprendre en orientation prototypale, ou orienté objet ES6 ? (- evenements.js OK)
	- $c.remove(); //to do: detach() pour tous cas semblables ?
* PRESENTATION
	- largeur tableau quand excédée par largeur de #intersection ; &  l * 7.7 + .1 sur Chrome