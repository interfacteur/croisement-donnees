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
	extensions, //surface d'extension de chaque série de données
	extension, //ensemble des valeurs partagées par les séries de données
	intersections = [[],[]], //intersections maximales et minimales entre séries de données
	amplitudes,	//amplitude des partages càd formes maximales et minimales d'extension des séries de données

//Ordre de présentation des amplitudes - paramétrable :
	ordre = {
		pe: 0,
		pl: 1,
		me: 2,
		ml: 3,
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
	var amplitudesQuali = [],
		resume = [],
		interz = {};

	amplitudesQuali[ordre["ml"]] = "le moins large";
	amplitudesQuali[ordre["pl"]] = "le plus large";
	amplitudesQuali[ordre["me"]] = "le moins important";
	amplitudesQuali[ordre["pe"]] = "le plus important";
	amplitudesQuali[ordre["pp"]] = "le plus profond";

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
		cles.sort(); //Ordre alphabétique de base

		var nombreTableaux = cles.length,
			tableaux = [],
			titres = [],
			titresIndex = [],
			elementsParTableau = [],
			tousElements = [],
			// nombreElements,
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
			i, y, k, l,
			masquer = '<label for="analyse">Masquer</label>',
			valindex = 0,
			routines = [],
			routine = function (arr) {
				i = 0;
				l = code.length;
				routines.push([l, arr[0][0]]);
				code.push([arr[0][1]]);
				while (i < nombreTableaux - 1 && arr[i][0] == arr[++i][0])
					code[l].push(arr[i][1]);
			};

		communs = [0, 0];
		amplitudes = [];
		extensions = [];
		extension = " " + typeEle[1] + " partagé" + (genreEle == "f" ? "e" : "") + "s";


		code.push("<h1>Le partage :</h1>");


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
		// nombreElements = tousElements.length; //cf. total += listes[i].length - 1; dans 2-interface.js

		elementMinimum = tousElements.slice(0, 1)[0];
		elementMaximum = tousElements.slice(-1)[0];
		for (i = elementMinimum; i <= elementMaximum; ++i)
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


		communs[2] = decompteElements.length;



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




	//Surface et largeur d'extension de chaque série de données (objet global)
		surfaces.forEach(function (val, ind) {
			extensions[cles[titresIndex.indexOf(val[1])]] = [val[0], largeurs[ind][0]];
		});




		for (y = 0; y < 4; ++y) {
			for (k in ordre) {
				if (ordre[k] == y) {
					switch (k) {
	//Série(s) de données ayant la largeur d'extension inférieure
						case "ml":
							code.push("<p>" + interz.large.moins + largeurs.slice(-1)[0][0] + " " + typeEle[1] + " :<br>&nbsp;&nbsp;&nbsp;&nbsp;");
							largeurs.reverse();
							routine(largeurs);
							largeurs.reverse();
							break;

	//Série(s) de données ayant la largeur d'extension supérieure
						case "pl":
							code.push("<p>"  + interz.large.plus + largeurs[0][0] + " " + typeEle[1] + " :<br>&nbsp;&nbsp;&nbsp;&nbsp;");
							routine(largeurs);
							break;

	//Série(s) de données ayant la surface d'extension inférieure
						case "me":
							code.push("<p>" + interz.etendue.moins + surfaces.slice(-1)[0][0] + " " + typeEle[1] + " :<br>&nbsp;&nbsp;&nbsp;&nbsp;");
							surfaces.reverse();
							routine(surfaces);
							surfaces.reverse();
							break;

	//Série(s) de données ayant la surface d'extension supérieure
						case "pe":
							code.push("<p>" + interz.etendue.plus + surfaces[0][0] + " " + typeEle[1] + " :<br>&nbsp;&nbsp;&nbsp;&nbsp;");
							routine(surfaces);
		}	}	}	}




	//Série(s) de données ayant la profondeur d'extension supérieure, et élements les plus représentés
		code.push("<p>" + interz.profonde + "1 " + typeEle[0] + " sur " + decompteElements[0][1] + " " + typeTab[1] + " :<br>&nbsp;&nbsp;&nbsp;&nbsp;");
		code.push(decompteElements[0][3]);

		code.push('<h1><button id="m">Occurrences des ' + typeEle[1] + '… <span>→</span></button></h1><article id="profondeur">');

		code.push("<p>les plus " + adjectif[genreEle] + " sur " + decompteElements[0][1] + " " + typeTab[1] + ":<br>&nbsp;&nbsp;&nbsp;&nbsp;");
		code.push([decompteElements[0][0]]);
		i = 0;
		l = code.length - 1;
		routines.push([l - 3, decompteElements[0][1]]);

		while (i < communs[2] - 1 && decompteElements[i][1] == decompteElements[++i][1]) {
			code[l - 3] = code[l - 3].concat(decompteElements[i][3]);
			code[l].push(decompteElements[i][0]);
		}
		code[l - 3].forEach(function (val, ind) {
			while (ind < code[l - 3].lastIndexOf(val))
				code[l - 3].splice(code[l - 3].lastIndexOf(val), 1);
		});

		code[l].sort(function (a, b) { return a - b; });
		code[l] = code[l].join(" ; ") + "</p>";




	//Éléments les moins représentés
		code.push('<p class="limite">les moins ' + adjectif[genreEle] + " sur " + decompteElements.slice(-1)[0][1] + " " + typeTab[2] + " :<br>&nbsp;&nbsp;&nbsp;&nbsp;");
		code.push([decompteElements.slice(-1)[0][0]]);
		i = decompteElements.length - 1;
		l = code.length - 1;
		while (i > 0 && decompteElements[i][1] == decompteElements[--i][1])
			code[l].push(decompteElements[i][0]);
		code[l].sort(function (a, b) { return a - b; });
		code[l] = code[l].join(" ; ") + "</p></article>";




	//Placer en-têtes les séries aux surfaces d'extension les plus riches
						/* doit venir après extension, càd après largeurs et surfaces, mais si vient avant les calculs de surface, largeur, profondeur, crée décalage… */
		cles.sort(function (a, b) { return extensions[b][0] - extensions[a][0]; });
		titresIndex = []; //Régularisation de l'ordre des titres
		for (k in titres)
			titresIndex[cles.indexOf(k)] = titres[k]




	//Finalisation du code de "amplitude des partages"
		routines.forEach(function (val, ind) {
			y = val[0];
			amplitudes.push([]);
			l = amplitudes.length - 1;
			code[y].sort(function (a, b) { return titresIndex.lastIndexOf(a) - titresIndex.lastIndexOf(b); });
			code[y].forEach(function (va, i) {
				k = cles[titresIndex.indexOf(va)];
				code[y][i] = '<a href="#'
					+ k
					+ '" data-croisement="'
					+ resume[ind][0]
					+ '" data-croisementtype="'
					+ resume[ind][1]
					+ '" data-taille="'
					+ val[1]
					+ '">'
					+ va
					+ '</a>';
				amplitudes[l].push([va, val[1]]);
			});
			code[y] = code[y].join(" ; ") + "</p>";
		})
		code.push(masquer);




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
			intersections.forEach(function (val, ind) {
				ind == 1
				&& inter.reverse(); //intersections minimales
				intersections[ind] = [[storage[inter[0]].length, inter[0], titres[inter[0].split(" ")[0]], titres[inter[0].split(" ")[1]]]];
				for (i = 1; i < l; ++i)
					if (storage[inter[i - 1]].length == storage[inter[i]].length)
						intersections[ind].push([storage[inter[i]].length, inter[i], titres[inter[i].split(" ")[0]], titres[inter[i].split(" ")[1]]]);
					else
						break;
				intersections[ind] = intersections[ind].map(function (va) {
					var storage = va[0] > 0 ?
						(va[0] * 2) + ' ' + typeEle[1] + " commun" + (genreEle == "f" ? "e" : "") + "s"
						: "aucun" + (genreEle == "f" ? "e " : " ") + typeEle[0] + " commun" + (genreEle == "f" ? "e" : "");
					return '<option value="' + va[1] + '">&#x22;' + va[2] + '&#x22; et &#x22;' + va[3] + '&#x22; : ' + storage + '</option>';
		})	})	})();




	//Amplitude des partages càd formes maximales et minimales d'extension des séries de données
		amplitudes = amplitudesQuali.map(function (val, ind) {
			return amplitudes[ind].map(function (v) {
				return '<option value="' + (valindex++) + '">' + val + " : " + v[0] + ' (' + v[1] + ')</option>';
			})
			.join("")
		})
		.join("");




	//Mise sur pied de l'interface
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
