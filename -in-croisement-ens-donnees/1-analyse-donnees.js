/* méta-informations - 01/2016 */

//Objets et variables globaux
;var conditions = (!! Array.prototype.forEach)
		* ("keys" in Object)
		* Modernizr.boxshadow
		* (Modernizr.prefixed("boxShadow") == "boxShadow")
		* Modernizr.cssgradients
		* Modernizr.filereader
		* Modernizr.localstorage,
	$b = $("body"),
	$f = $("form"),
	$meta = $("#meta"),
	cles,
	communs, //nombre d'éléments partagés par les séries de données
	intersections = [[],[]], //intersections maximales et minimales entre séries de données
	amplitudesQuali = [],//sélection des amplitudes extrêmes : séries de données ayant la surface d'extension maximale
	amplitudes,	//sélection des amplitudes extrêmes : séries de données ayant la surface d'extension minimale
	extensions, //surface d'extension de chaque série de données
	extension,

//Ordre de présentation des amplitudes - paramétrable :
	ordre = {
		pl: 0,
		pe: 1,
		ml: 2,
		me: 3,
		pp: 4 //À LAISSER EN 4
	};




;var analyser = (function () {
	"use strict";

	/*@cc_on
	if (parseInt(navigator.userAgent.toLowerCase().split("msie")[1]) <= 9)
		conditions = false;
	@*/

	if (! conditions)
		return $(document).ready(function () {
			$b.html('<p class="message">Cette version de navigateur ne peut afficher cette page.<br><small>Essayer avec navigateur usuel et récent, Firefox ou Chrome par ex.</small></p>');
		});


//Paramètres de présentation
	var resume = [],
		interz = {};

	amplitudesQuali[ordre["ml"]] = "la moins large";
	amplitudesQuali[ordre["pl"]] = "la plus large";
	amplitudesQuali[ordre["me"]] = "la moins importante";
	amplitudesQuali[ordre["pe"]] = "la plus importante";
	amplitudesQuali[ordre["pp"]] = "la plus profonde";

	resume[ordre["ml"]] = ["largeur minimale", "d2"];
	resume[ordre["pl"]] = ["largeur maximale", "d2"];
	resume[ordre["me"]] = ["extension minimale", "d2d3"];
	resume[ordre["pe"]] = ["extension maximale", "d2d3"];
	resume[ordre["pp"]] = ["profondeur maximale", "d3"];

	interz.large = {
		moins: amplitudesQuali[ordre["ml"]] + ", avec ",
		plus: amplitudesQuali[ordre["pl"]] + ", avec "
	};
	interz.etendue = {
		 moins: amplitudesQuali[ordre["me"]] + ", sur ",
		 plus: amplitudesQuali[ordre["pe"]] + ", sur "
	};
	interz.profonde = amplitudesQuali[ordre["pp"]] + ", "




	return (function analysant () {

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
			decompteElements = [],
			largeurTableaux = {},
			surfaceTableaux = {},
			largeurs,
			surfaces,
			code = [],
			typeTab = informations.typeTableaux,
			genreTab = informations.genreTableaux,
			typeEle = informations.typeElements,
			genreEle = informations.genreElements,
			adjectif = { "f": "répandues, présentes", "m": "répandus, présents" },
			i, l, li,
			masquer = '<label for="analyse">Masquer</label>',
			routine = [
				function (ind) {
					i = ind;
					l = code.length - 1;
					amplitudes.push([]);
					li = amplitudes.length - 1;
				},
				function (l, r, t) {
					code[l].sort(function (a, b) { return titresIndex.lastIndexOf(a[0]) -  titresIndex.lastIndexOf(b[0]); });
					code[l].forEach(function (val, ind) {
						var k = cles[titresIndex.indexOf(val)];
						code[l][ind] = '<a href="#'
							+ k
							+ '" data-croisement="'
							+ resume[r][0]
							+ '" data-croisementtype="'
							+ resume[r][1]
							+ '" data-taille="'
							+ t
							+ '">'
							+ val
							+ '</a>';
						amplitudes[li].push([val, t]);
					});
					code[l] = code[l].join(" ; ") + "</p>";
			}	];

		communs = [0, 0],
		amplitudes = [],
		extensions = [];
		extension = " " + typeEle[1] + " partagé" + (genreEle == "f" ? "e" : "") + "s";


		code.push("<h1>L'extension :</h1>");


		cles.forEach(function (val) {
			tableaux[val] = $.map(datas[val], function (ele) {
				if (ele / ele === 1)
					return ele;
			})
			.sort(function (a, b) { return a - b; });
			titresIndex.push(titres[val] = $.map(datas[val], function (ele) {
				if (ele / ele != 1)
					return ele;
		}));});

		cles.forEach(function (val, ind) {
			titres[val] = titres[val][0];
			titresIndex[ind] = titresIndex[ind][0];
			tableaux[val].forEach(function (va) {
				tousElements.push(va);
				elementsParTableau.push([val, va]);
		});	});

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




	//Pour calculer surface et largeur d'extension
		decompteElements.forEach(function (val) {
			if (val[1] == 1)
				return;
			communs[0]++;
			communs[1] += val[1];
			val[2].forEach(function (va) {
				surfaceTableaux[va] += val[1];
				largeurTableaux[va] += 1;
		});	});

		largeurs = cles.map(function (val) {
			return [largeurTableaux[val], titres[val]];
		})
		.sort(function (a, b) { return b[0] - a[0]; });

		surfaces = cles.map(function (val) {
			return [surfaceTableaux[val], titres[val]];
		})
		.sort(function (a, b) { return b[0] - a[0]; });




		for (var y = 0; y < 4; ++y) {
			for (var k in ordre) {
				if (ordre[k] == y) {
					switch (k) {

	//Série(s) de données ayant la largeur d'extension inférieure
						case "ml":
							code.push("<p>" + interz.large.moins + largeurs.slice(-1)[0][0] + " " + typeEle[1] + " :<br>&nbsp;&nbsp;&nbsp;&nbsp;");
							code.push([largeurs.slice(-1)[0][1]]);
							routine[0](nombreTableaux - 1);
							while (largeurs[i][0] == largeurs[--i][0])
								code[l].push(largeurs[i][1]);
							routine[1](l, ordre["ml"], largeurs.slice(-1)[0][0]);
							break;

	//Série(s) de données ayant la largeur d'extension supérieure
						case "pl":
							code.push("<p>"  + interz.large.plus + largeurs[0][0] + " " + typeEle[1] + " :<br>&nbsp;&nbsp;&nbsp;&nbsp;");
							code.push([largeurs[0][1]]);
							routine[0](0);
							while (largeurs[i][0] == largeurs[++i][0])
								code[l].push(largeurs[i][1]);
							routine[1](l, ordre["pl"], largeurs[0][0]);
							break;

	//Série(s) de données ayant la surface d'extension inférieure
						case "me":
							code.push("<p>" + interz.etendue.moins + surfaces.slice(-1)[0][0] + " " + typeEle[1] + " :<br>&nbsp;&nbsp;&nbsp;&nbsp;");
							code.push([surfaces.slice(-1)[0][1]]);
							routine[0](nombreTableaux - 1);
							while (surfaces[i][0] == surfaces[--i][0])
								code[l].push(surfaces[i][1]);
							routine[1](l, ordre["me"], surfaces.slice(-1)[0][0]);
							break;

	//Série(s) de données ayant la surface d'extension supérieure
						case "pe":
							code.push("<p>" + interz.etendue.plus + surfaces[0][0] + " " + typeEle[1] + " :<br>&nbsp;&nbsp;&nbsp;&nbsp;");
							code.push([surfaces[0][1]]);
							routine[0](0);
							while (i + 1 < surfaces.length && surfaces[i][0] == surfaces[++i][0]) {
								code[l].push(surfaces[i][1]);
							}
							routine[1](l, ordre["pe"], surfaces[0][0]);
		}	}	}	}




	//Série(s) de données ayant la profondeur d'extension supérieure, et élements les plus représentés
		code.push("<p>" + interz.profonde + "1 " + typeEle[0] + " sur " + decompteElements[0][1] + " " + typeTab[1] + " :<br>&nbsp;&nbsp;&nbsp;&nbsp;");
		code.push(decompteElements[0][3]);

		code.push('<h1><button id="m">Présence des ' + typeEle[1] + '… <span>→</span></button></h1><article id="profondeur">');

		code.push("<p>les plus " + adjectif[genreEle] + " sur " + decompteElements[0][1] + " " + typeTab[1] + ":<br>&nbsp;&nbsp;&nbsp;&nbsp;");
		code.push([decompteElements[0][0]]);
		routine[0](0);
		while (decompteElements[i][1] == decompteElements[++i][1]) {
			code[l - 3] = code[l - 3].concat(decompteElements[i][3]);
			code[l].push(decompteElements[i][0]);
		}
		code[l - 3].sort(function (a, b) { return titresIndex.lastIndexOf(a) -  titresIndex.lastIndexOf(b); });
		code[l - 3].forEach(function (val, ind) {
			while (ind < code[l - 3].lastIndexOf(val))
				code[l - 3].splice(code[l - 3].lastIndexOf(val), 1);
		});

		code[l - 3].forEach(function (val, ind) {
			var k = cles[titresIndex.indexOf(val)];
			code[l - 3][ind] = '<a href="#'
				+ k
				+ '" data-croisement="'
				+ resume[4][0]
				+ '" data-croisementtype="'
				+ resume[4][1]
				+ '" data-taille="'
				+ decompteElements[0][1]
				+ '">'
				+ val
				+ '</a>';
			amplitudes[li].push([val, decompteElements[0][1]]);
		});
		code[l - 3] = code[l - 3].join(" ; ") + "</p>";
		code[l].sort(function (a, b) { return a - b; });
		code[l] = code[l].join(" ; ") + "</p>";




	//Éléments les moins représentés
		code.push('<p class="limite">les moins ' + adjectif[genreEle] + " sur " + decompteElements.slice(-1)[0][1] + " " + typeTab[2] + " :<br>&nbsp;&nbsp;&nbsp;&nbsp;");
		code.push([decompteElements.slice(-1)[0][0]]);
		i = decompteElements.length - 1;
		l = code.length - 1;
		while (decompteElements[i][1] == decompteElements[--i][1])
			code[l].push(decompteElements[i][0]);
		code[l].sort(function (a, b) { return a - b; });
		code[l] = code[l].join(" ; ") + "</p></article>";



	//Surface et largeur d'extension de chaque série de données (objet global)
		surfaces.forEach(function (val, ind) {
			extensions[cles[titresIndex.indexOf(val[1])]] = [val[0], largeurs[ind][0]];
		});




	//Intersections maximales et minimales entre séries de données (objet global)
		(function () {
			var storage = {},
				inter,
				c, i, k, l;

			cles.forEach(function (val) {
				cles.forEach(function (va) {
					if (val != va && typeof storage[val + " " + va] == "undefined" && typeof storage[va + " " + val] == "undefined") {
						storage[val + " " + va] = [];
						for (c in datas[val])
							for (k in datas[va])
								if (datas[val][c] == datas[va][k]) {
									storage[val + " " + va].push(datas[val][c]);
									break;
			}	}	})	});

			inter = Object.keys(storage);
			l = inter.length;

			inter.sort(function (a, b) { return storage[b].length - storage[a].length; }); //intersections maximales
			intersections[0] = [[storage[inter[0]].length, inter[0], titres[inter[0].split(" ")[0]], titres[inter[0].split(" ")[1]]]];
			for (i = 1; i < l; ++i)
				if (storage[inter[i - 1]].length == storage[inter[i]].length)
					intersections[0].push([storage[inter[i]].length, inter[i], titres[inter[i].split(" ")[0]], titres[inter[i].split(" ")[1]]]);
				else
					break;

			inter.reverse(); //intersections minimales
			intersections[1] = [[storage[inter[0]].length, inter[0], titres[inter[0].split(" ")[0]], titres[inter[0].split(" ")[1]]]];
			for (i = 1; i < l; ++i)
				if (storage[inter[i - 1]].length == storage[inter[i]].length)
					intersections[1].push([storage[inter[i]].length, inter[i], titres[inter[i].split(" ")[0]], titres[inter[i].split(" ")[1]]]);
				else
					break;
		})();






		code.push(masquer);
		$meta.html(code.join(""));


		$(".typeTab1").text(typeTab[0]);
		$(".typeTab2").text(typeTab[1]);
		$(".genreTab").text(genreTab == "f" ? "e" : "");
		$(".typeEle2").text(typeEle[1]);
		$(".genreEle").text(genreEle == "f" ? "e" : "");
		$(".tout").text(genreTab == "f" ? "tes" : "s");

		return analysant;




	})();

})();
