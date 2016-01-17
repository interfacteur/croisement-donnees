;var $meta = $("#meta"),
	cles;

;var analyser = (function analyser () {
	"use strict";

/* méta-informations - 01/2016 */

//to do : fenêtre étroite sur Chrome

//to do : sur MSIE ?



	cles = Object.keys(datas);

	var nombreTableaux = cles.length,
		tableaux = [],
		titres = [],
		titresIndex = [],
		elementsParTableau = [],
		tousElements = [],
		nombreElements,
		elementMinimum,
		elementMaximum,
		surfaceTableaux = {},
		largeurTableaux = {},
		decompteElements = [],
		surfaces,
		surfaceMaxTableaux,
		largeurs,
		largeurMaxTableaux,
		largeurMinTableaux,
		profondeurMaxTableaux,
		occurrenceElements,
		code = ["<p><strong>L'analyse des croisements :</strong></p>"],
		typeTab = informations.typeTableaux,
		genreTab = informations.genreTableaux,
		typeEle = informations.typeElements,
		genreEle = informations.genreElements,
		article = { "f": "une", "m": "un" },
		adjectif = { "f": "répandues, présentes", "m": "répandus, présents" },
		i, l,
		interz = {
			etendue: "Intersection la plus étendue, avec ",
			large: {
				moins: "Intersection la moins large, avec ",
				plus: "Intersection la plus large, avec "
			},
			profonde: "Intersection la plus profonde, avec "
		},
		masquer = '<label for="analyse">Masquer l\'analyse</label>';


	cles.forEach(function (val) {
		tableaux[val] = $.map(datas[val], function (ele) {
			if (ele / ele === 1)
				return ele;
		})
		.sort(function (a, b) { return a - b; });
		titresIndex.push(titres[val] = $.map(datas[val], function (ele) {
			if (ele / ele != 1)
				return ele;
		}));
	});

	cles.forEach(function (val, ind) {
		titres[val] = titres[val][0];
		titresIndex[ind] = titresIndex[ind][0];
		tableaux[val].forEach(function (va) {
			tousElements.push(va);
			elementsParTableau.push([val, va]);
		});
	});

	tousElements.sort(function (a, b) { return a - b; } );
	nombreElements = tousElements.length;

	elementMinimum = tousElements.slice(0, 1)[0];
	elementMaximum = tousElements.slice(-1)[0];
	for (var i = elementMinimum; i <= elementMaximum; ++i)
		decompteElements[i] = [i, 0, [], []];

	elementsParTableau.sort(function (a, b) { return a[1] - b[1]; } );
	elementsParTableau.forEach(function (val) {
		surfaceTableaux[val[0]] = 0;
		largeurTableaux[val[0]] = 0;
		++decompteElements[val[1]][1];
		decompteElements[val[1]][2].push(val[0]);
		decompteElements[val[1]][3].push(titres[val[0]]);
	});




//Recension décroissante de l'occurence de chaque élément et de sa répartition dans les tableaux
	decompteElements.sort(function (a, b) { return b[1] - a[1]; });
	decompteElements.unshift([]);
	decompteElements.forEach(function (val, ind) {
		if (ind == 0)
			return;
		val[1] > 0
		&& decompteElements[0].push(val);
	});
	decompteElements = decompteElements[0];




//Pour calculer surface et largeur d'intersection
	decompteElements.forEach(function (val) {
		if (val[1] == 1)
			return;
		val[2].forEach(function (va) {
			surfaceTableaux[va] += val[1];
			largeurTableaux[va] += 1;
		});
	});




//Tableau(x) ayant la surface d'intersection supérieure
	surfaces = cles.map(function (val) {
		return [surfaceTableaux[val], titres[val]];
	})
	.sort(function (a, b) { return b[0] - a[0]; });
	code.push("<p>" + interz.etendue + surfaces[0][0] + " " + typeEle[1] + " :<br>&nbsp;&nbsp;&nbsp;&nbsp;");
	code.push([surfaces[0][1]]);
	i = 0;
	l = code.length - 1;
	while (i + 1 < surfaces.length && surfaces[i][0] == surfaces[++i][0]) {
		code[l].push(surfaces[i][1]);
	}
	code[l].sort(function (a, b) { return titresIndex.lastIndexOf(a) -  titresIndex.lastIndexOf(b); });
	code[l] = code[l].join(" ; ") + "</p>";




//Tableau(x) ayant les largeurs d'intersection supérieure et inférieure
	largeurs = cles.map(function (val) {
		return [largeurTableaux[val], titres[val]];
	})
	.sort(function (a, b) { return b[0] - a[0]; });
	code.push("<p>" + interz.large.moins + largeurs.slice(-1)[0][0] + " " + typeEle[1] + " :<br>&nbsp;&nbsp;&nbsp;&nbsp;");
	code.push([largeurs.slice(-1)[0][1]]);
	i = nombreTableaux - 1;
	l = code.length - 1;
	while (largeurs[i][0] == largeurs[--i][0])
		code[l].push(largeurs[i][1]);
	code[l].sort(function (a, b) { return titresIndex.lastIndexOf(a) -  titresIndex.lastIndexOf(b); });
	code[l] = code[l].join(" ; ") + "</p>";
	code.push("<p>"  + interz.large.plus + largeurs[0][0] + " " + typeEle[1] + " :<br>&nbsp;&nbsp;&nbsp;&nbsp;");
	code.push([largeurs[0][1]]);
	i = 0;
	l = code.length - 1;
	while (largeurs[i][0] == largeurs[++i][0])
		code[l].push(largeurs[i][1]);
	code[l].sort(function (a, b) { return titresIndex.lastIndexOf(a) -  titresIndex.lastIndexOf(b); });
	code[l] = code[l].join(" ; ") + "</p>";



//Tableau(x) ayant la profondeur d'intersection supérieure, et élements les plus représentés
	code.push("<p>" + interz.profonde + article[genreEle] + " " + typeEle[0] + " sur " + decompteElements[0][1] + " " + typeTab[1] + " :<br>&nbsp;&nbsp;&nbsp;&nbsp;");
	code.push(decompteElements[0][3]);
	code.push("<p>" + typeEle[1].charAt(0).toUpperCase() + typeEle[1].slice(1) + " les plus " + adjectif[genreEle] + " sur " + decompteElements[0][1] + " " + typeTab[1] + ":<br>&nbsp;&nbsp;&nbsp;&nbsp;");
	code.push([decompteElements[0][0]]);
	i = 0;
	l = code.length - 1;
	while (decompteElements[i][1] == decompteElements[++i][1]) {
		code[l - 2] = code[l - 2].concat(decompteElements[i][3]);
		code[l].push(decompteElements[i][0]);
	}
	code[l - 2].sort(function (a, b) { return titresIndex.lastIndexOf(a) -  titresIndex.lastIndexOf(b); });
	code[l - 2].forEach(function (val, ind) {
		while (ind < code[l - 2].lastIndexOf(val))
			code[l - 2].splice(code[l - 2].lastIndexOf(val), 1);
	});
	code[l - 2] = code[l - 2].join(" ; ") + "</p>";
	code[l].sort(function (a, b) { return a - b; });
	code[l] = code[l].join(" ; ") + "</p>";





//Éléments les moins représentés
	code.push('<p class="limite">' + typeEle[1].charAt(0).toUpperCase() + typeEle[1].slice(1) + " les moins " + adjectif[genreEle] + " sur " + decompteElements.slice(-1)[0][1] + " " + typeTab[2] + " :<br>&nbsp;&nbsp;&nbsp;&nbsp;");
	code.push([decompteElements.slice(-1)[0][0]]);
	i = decompteElements.length - 1;
	l = code.length - 1;
	while (decompteElements[i][1] == decompteElements[--i][1])
		code[l].push(decompteElements[i][0]);
	code[l].sort(function (a, b) { return a - b; });
	code[l] = code[l].join(" ; ") + "</p>";




	code.push(masquer);
	$meta.html(code.join(""));

	$(".typeTab1").text(typeTab[0]);
	$(".typeTab2").text(typeTab[1]);
	$(".genreTab").text(genreTab == "f" ? "e" : "");
	$(".typeEle2").text(typeEle[1]);
	$(".genreEle").text(genreEle == "f" ? "e" : "");

	return analyser;

})();
