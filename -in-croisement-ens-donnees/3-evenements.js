/* Aide, affichages, changer de données - 01/2016 */

;(function () {
	"use strict";


	if (! conditions) //cf. 1-analyse-donnees.js
		return;



/* cf. $(".presentation input").off(); dans 2-interface.js :
	les boutons radio pour ligne colonne : sont stables mais s'adressent à élément instables, adapter la gestion au cycle des éléments
tandis que :
	éléments re-écrits comme le tableau : leur gestionnaire d'événements n'est pas à "gérer", suit l'existence de ces éléments
	éléments stables, comme le bouton reset : pas de souci
*/



	var $modifier = $("#modifier"),					//<input type="file" title="Nouvelles données" id="modifier">
		$datas = $("#datas"),						//Données visualisées : </label><select id="datas">
		datasDefaut = $datas.find("option:eq(0)").attr("value"),
		$dernier = ("#dernier"),					//Item de personnalisation des données, devant rester en dernier

		$pres = $("[name='presentation']"),			//Présentation du tableau :</label><input type="radio" name="presentation" id="pres1" checked>

		$analyse = $("#analyse"),					//<input type="checkbox" id="analyse" checked>

		$fichier = $("#fichier"),					//<span id="fichier"><a href="#aidePersonnalisation" title="Introduire et visualiser de nouvelles données">données personnalisables</a></span>
		$aideP = $("#aidePersonnalisation"),		//<a href="#" id="aidePersonnalisation" title="PERSONNALISER LES DONNÉES…

		$aideU = $("#aideUtilisation"),				//<ul id="aideUtilisation" class="sans">
		$mde = $("#mde"),							//<a href="#" id="mdemploi">→ mode d'emploi suite</a>

		perso = ["Données personnalisées : ", "personnalisées : ", $fichier.text()],
		$perso = null,

		$effacer = $("#effacer"),

		tempo,

		message = "Les données chargées ne correspondraient pas à la forme attendue",
		fermeture = $(".fermeture").get(0)
			.outerHTML
			.replace(/(href="#)[^"]+"/, '$1javascript:void(0);"'),

 		neutraliser = function (e) {
			e.stopPropagation();
			e.preventDefault();
		},
		eclaircir = function (str) { //https://github.com/interfacteur/js-segments/blob/master/regex.fonctions.js
			return str.replace(/\/\/.*/g, "") //sans les commentaires sur une ligne
				.replace(/\/\*([^\*]|\*(?!\/))*\*\//g, "") //sans les commentaires sur plusieurs lignes
				.replace(/^\s*/, "") //sans les espacements initiaux (dont retours)
				.replace(/[\t\v]/g, " ") //remplacer les tabulations horizontales et verticales par un espacement
				.replace(/[\f\n\r\u2028\u2029]/g, "") //sans les retours à la page, à la ligne et charriot
				.replace(/\x20{2,}/g, " "); //remplacer les espacements multiples par un espacement
		},


		re = {
			informations: /var informations ?= ?{(?=.*"titre" ?: ?(?:(?:"(?:[^"]|\\")*[^\\]")|(?:'(?:[^']|\\')*[^\\]')))(?=.*"typeTableaux" ?: ?\[ ?(?:(?:(?:"(?:[^"]|\\")*[^\\]")|(?:'(?:[^']|\\')*[^\\]'))(?:(?: ?, ?(?=["']))|(?: ?))){3} ?\])(?=.*"genreTableaux" ?: ?(["'])[mf]\1)(?=.*"typeElements" ?: ?\[ ?(?:(?:(?:"(?:[^"]|\\")*[^\\]")|(?:'(?:[^']|\\')*[^\\]'))(?:(?: ?, ?(?=["']))|(?: ?))){2} ?\])(?=.*"genreElements" ?: ?(["'])[mf]\2)/g,
			datas: /var datas ?= ?\{ ?(?: ?"[^"]+" ?: ?\{ ?"titre" ?: ?(?:(?:"(?:[^"]|\\")*[^\\]")|(?:'(?:[^']|\\')*[^\\]')) ?, ?(?:"\d+" ?: ?\d+ ?(?:(?:, ?(?=(?:"\d)|\}))|(?=\}))){1,} ?\} ?(?:(?:, ?(?=["}]))|(?=\}))){2,7}\}/g
		},


//Visualiser les intersections extrèmes : fonction constructrice, prototype etc.
		visualiser = (function visualiser () {

			var $visus = [],							//instances d'une pseudo classe (héritage natif) gérant la visualisation des analyses
				$ml = $("#meta a"),						//accéder aux analyses via les liens : point d'ancrage dans le DOM des instances précédentes
				$croiser = $("#croiser"),				//accéder aux analyses via une boîte de sélection
				$table = $("table"),					//le tableau où les données sont affichées
				$profondeur = $("#profondeur"),			//suite des analyse
				$span = $("#m span"),					//état de l'affichage de la suite des analyses
				valindex = 0;

			cles.forEach(function (val) {
				var storage = $("#" + val + " th").css("background-color");
				$("#meta [href='#" + val + "']").css("box-shadow", "0 0 0 1px " + storage + " inset, 0 0 1px 1px " + storage);
			});

			$("#m").on("click", function (e) { //replier et déplier les analyses détaillées des millésimes
				e.preventDefault();
				$(this).toggleClass("visu");
				$profondeur.toggleClass("visu");
				$span.text($span.text() == "→" ? "X" : "→");
			});


	//Fonction constructrice : qui sera instanciée pour tout lien présent dans #meta
			function Visu (ind) {
				if (! this instanceof Visu)
					throw new Error("Attention à l'instanciation");
				this.etats = {
					passage: false,
					etape: false,
					$champ: "",
					$champs: "",
					state: 0
				}

				this.$lien = $ml.eq(ind);
				this.$lien.data("instance", this);

				this.nombre = this.$lien.data("nombre");
				this.croisement = this.$lien.data("croisement");
				this.taille = this.$lien.data("taille");
				this.croisementtype = this.$lien.data("croisementtype");
				this.idChamp = this.$lien.attr("href").split("#")[1];

				this.$champ = $("#" + this.idChamp);
				this.$label = this.$champ.find("label");

				this.couleur = this.$champ.find("th").css("background-color")
				.replace("rgb", "rgba").replace(")", ", .99)");
				this.couleuRe = new RegExp(this.couleur.replace(/, *\.99/, ", *0*\\.99").replace("(", "\\(").replace(")", "\\)").replace(/ *,/g, " *,"), "g");
				this.indexSource = ind;
				this.indexChamp = this.$champ.index();

				this.domEvenementsGerer();
			}
			Visu.passage = false;
			Visu.etape = false;
			Visu.base = false;

			Visu.debug = false;


	//Routeur pour la gestion d'événements
			Visu.reagir = function (e) {
				e.preventDefault();
				$(this).data("instance")[e.data.reaction]();
			}


	//Vérifier si renouvellement des <td recensés (instables car extraits et remis dans le DOM par 2-interface.js)
			Visu.prototype.valider = function () {
				this.state != $table.data("state")
				&& (this.state = $table.data("state"))
				&& this.$champs(true); //initialiser
			}

	//<td (instables car extraits et remis dans le DOM par 2-interface.js) hors ligne du tableau et recensés pour la surface
			Visu.prototype.$champsD2D3 = function (init) {
				! init
				&& this.valider();
				return this.$chD2D3 = ! this.$chD2D3 || init ? $("tbody tr:not(#" + this.idChamp + ") td." + this.idChamp) : this.$chD2D3;
			}

	//<td (instables car extraits et remis dans le DOM par 2-interface.js) dans ligne du tableau et recensés pour la profondeur
			Visu.prototype.$champsD3direct = function (init) {
				! init
				&& this.valider();
				return this.$chD3direct = ! this.$chD3direct || init ? this.$champ.find("[data-xection='" + this.taille + "']") : this.$chD3direct;
			}

	//<td (instables car extraits et remis dans le DOM par 2-interface.js) hors de la ligne du tableau et recensés pour la profondeur
			Visu.prototype.$champsD3indirect = function (init) {
				var storage;
				! init
				&& this.valider();
				if (! this.$chD3indirect || init) {
					var $chD3indirect = $();
					storage = this.idChamp;
					this.$champsD3direct().each(function () {
						$chD3indirect = $chD3indirect.add($("tbody tr:not(#" + storage + ") [data-nombre='" + $(this).data("nombre") + "']"));
					});
					return this.$chD3indirect = $chD3indirect;
				}
				return this.$chD3indirect;
			}

	//tous les recensés - <td instables car extraits et remis dans le DOM par 2-interface.js
			Visu.prototype.$champs = function (init) {
				return this.$champsD2D3(init).add(this.$champsD3direct(init)).add(this.$champsD3indirect(init));
			}


	//Gérer les événements sur les liens
			Visu.prototype.domEvenementsGerer = function () {
				this.$lien.on("mouseover keyup", { reaction: "passer"}, Visu.reagir)
				.on("mouseout blur", { reaction: "depasser"}, Visu.reagir)
				.on("click", { reaction: "visiter"}, Visu.reagir);
			}


	//Activer provisoirement l'intersection
			Visu.prototype.passer = function (select) {
				var storage;

				if (this.etats.passage == true || this.etats.etape == true) //est déjà mouseover, keyup ou clic positif
					return;

				if (Visu.debug) console.log("passer", Visu.etape, Visu.base, this.idChamp, this.indexSource);

				Visu.etape //un autre est déjà clic positif : le mémoriser pour une restitution onmouseout ou onblur (depasser())
				&& (storage = Visu.etape)
				&& ! (Visu.etape.etats.etape = false)
				&& Visu.etape.boucler(select) /* (plus de trigger donc plus besoin de promesses) */
				&& (Visu.base = storage);

				if (Visu.debug) console.log("passer", Visu.etape, Visu.base, this.idChamp, this.indexSource);

				Visu.passage //un autre est déjà mouseover ou keyup
				&& Visu.passage.depasser(select, true);

				if (Visu.debug) console.log("passer", Visu.etape, Visu.base, this.idChamp, this.indexSource);

				this.etats.$champ = " passage intersection"; //activation des différents éléments concernés par l'intersection
				this.etats.$champs = " ";

				this.$label.attr("data-intersection", this.croisement + " : " + this.taille);

				storage = this.couleur;

				this.croisementtype.indexOf("d2") >= 0 //intersection de largeur ou de surface
				&& (this.etats.$champ += " intersectionD2")
				&& this.$champ.find(".multi")
				.each(function () {
					$(this).css("box-shadow", $(this).css("box-shadow").replace(/rgb\( *255 *, *255 *, *255 *\)/g, storage));
				});

				this.croisementtype.indexOf("d3") >= 0 //intersection de surface ou de profondeur
				&& (this.etats.$champs += " intersexion intersexion" + (this.indexChamp + 1))
				&& this[this.croisementtype == "d2d3" ? "$champsD2D3" : "$champsD3indirect"]().addClass(" intersexion intersexion" + (this.indexChamp + 1))
				.each(function () {
					$(this).css("box-shadow", $(this).css("box-shadow").replace(/rgb\( *255 *, *255 *, *255 *\)/g, storage));
				});

				this.croisementtype == "d3" //intersection de profondeur
				&& (this.etats.$champ += " intersectionD3")
				&& (this.etats.$champs += " diasection")
				&& this.$champsD3direct().addClass(" diasection")
				.each(function () {
					$(this).css("box-shadow", $(this).css("box-shadow").replace(/rgb\( *255 *, *255 *, *255 *\)/g, storage));
				});

				this.$champ.addClass(this.etats.$champ)

				! select
				&& $croiser.val(this.indexSource); //adapter la valeur de la boîte de sélection

				this.etats.passage = true; //est activé
				Visu.passage = this; //passage actuel

				return true;
			}


	//Désactiver l'intersection
			Visu.prototype.depasser = function (select, passant) {
				var storage;

				if (Visu.debug) console.log("depasser", this.idChamp, this.indexSource);

				if (this.etats.passage == false || this.etats.etape == true) //est déjà désactivé, ou est en clic positif
					return;

				if (Visu.debug) console.log("depasser", this.idChamp, this.indexSource);

				if (! passant && Visu.base) { //restituer précédent clic positif mémorisé (entamer, d'où passer, d'où de nouveau depasser, puis fin passer, puis fin entamer)
					storage = Visu.base; //l'étape mémorisée
					storage.$lien.removeClass("consigne");
					Visu.base = false;
					return storage.entamer(select);
				}

				if (Visu.debug) console.log("depasser", this.idChamp, this.indexSource);

				this.$label.attr("data-intersection", "");
				storage = this.couleuRe;
				this.$champs().removeClass(this.etats.$champs)
				.each(function () {
					$(this).css("box-shadow", $(this).css("box-shadow").replace(storage, "rgb(255, 255, 255)"));
				});
				this.etats.$champs = "";

				this.$champ.removeClass(this.etats.$champ)
				.find(".multi")
				.each(function () {
					$(this).css("box-shadow", $(this).css("box-shadow").replace(storage, "rgb(255, 255, 255)"));
				});
				this.etats.$champ = "";

				! select
				&& $croiser.val(-1); //reset de la valeur de la boîte de sélection

				this.etats.passage = false; //est effacé
				Visu.passage = false; //aucun passage actuel

				return true;
			}


	//Confirmer ou infirmer l'état actif de l'intersection
			Visu.prototype.visiter = function (select) {
				var storage = Visu.base; //l'étape mémorisée
				$(".consigne").removeClass("consigne");
				Visu.base = false;

				if (Visu.debug) console.log("visiter", storage, Visu.etape, this.idChamp, this.indexSource);

				Visu.etape
				&& Visu.etape.indexSource != this.indexSource
				&& Visu.etape.boucler(select); //effacer l'étape actuelle

				if (Visu.debug) console.log("visiter", storage, Visu.etape, this.idChamp, this.indexSource);

				storage
				&& storage.indexSource != this.indexSource
				&& storage.boucler(select); //oublier l'étape mémorisée

				if (Visu.debug) console.log("visiter", storage, Visu.etape, this.idChamp, this.indexSource);

				this.etats.etape == false
				&& this.entamer(select) //n'est pas déjà cliqué : -> clic positif
				|| this.boucler(select); //est déjà cliqué : -> clic négatif

				if (Visu.debug) console.log("visiter", storage, Visu.etape, this.idChamp, this.indexSource);

				return true;
			}

	//Confirmer l'état actif de l'intersection
			Visu.prototype.entamer = function (select) {

				if (Visu.debug) console.log("entamer", this.idChamp, this.indexSource);

				! this.etats.passage //n'est pas déjà mouseover ou keyup (cf. mélanges navigation clavier et souris ; et cf. base) : l'activer
				&& this.passer(select);
				this.etats.etape = true;
				this.$lien.addClass("visiteur consigne");
				this.$champ.addClass("visite");
				Visu.etape = this; //etape actuelle
				! select
				&& $croiser.val(this.indexSource); //adapter la valeur de la boîte de sélection

				if (Visu.debug) console.log("entamer", this.idChamp, this.indexSource);
				return true;
			}

	//Infirmer l'état actif de l'intersection
			Visu.prototype.boucler = function (select) {

				if (Visu.debug) console.log("boucler", this.idChamp, this.indexSource);

				this.etats.etape = false;
				this.depasser(select);
				this.$lien.removeClass("visiteur");
				this.$champ.removeClass("visite");
				Visu.etape = false; //aucune étape actuelle
				! select
				&& $croiser.val(-1); //reset de la valeur de la boîte de sélection

				if (Visu.debug) console.log("boucler", this.idChamp, this.indexSource);

				return true;
			}


	//Ajuster la valeur de la boîte de sélection des intersections
			Visu.prototype.correler = function (ind, tps) {
				clearTimeout(latence);
				! Visu.select
				&& (latence = setTimeout(function () {
					$croiser.val(ind); //valeur de la boîte de sélection
				}, tps));
				Visu.select == this
				&& (Visu.select = (this.select = false));
			}


	//Instanciation des pseudo-classes
			$ml.each(function (ind) {
				$visus.push(new Visu(ind));
			});


	//La boîte de sélection des intersections
			$croiser.append(
				intersectionsQuali.map(function (val, ind) {
					return intersections[ind].map(function (v) {
						return '<option value="' + (valindex++) + '">' + val + " : " + v + '</option>';
					})
					.join("")
				})
				.join("")
			)
			.on({
				"keydown": function () {
					$croiser.data("keydown", $croiser.val());
				},
				"keyup": function () {
					var storage = $croiser.data("keydown");
					$croiser.data("keydown", null);
					$croiser.val() != storage
					&& $croiser.trigger("change");
				},
				"change": function () {
					var va = parseInt($croiser.val());
					va > -1
					&&	(! Visu.etape || (va != Visu.etape.indexSource) ? $ml.eq(va).data("instance").visiter(true) : true) //en fin de course au clavier
					|| Visu.etape
					&& Visu.etape.visiter(true);
			}	});

			return visualiser;
		})();
//Fin du code à orientation prototypale (visualiser les intersections extrèmes)




//Neutraliser la soumission du formulaire
	$f.on("submit", function (e) {
		e.preventDefault();
	});




//Rétablir l'affichage par défaut (dont oubli des données personnalisées)
	$("#defaut").on("click", function (e) {
		var va = $datas.val();
		e.preventDefault;
		$f.get(0).reset();
		new Promise(function (resolve) {
			$datas.val() != va
			&& $datas.trigger("change", [resolve])
			|| resolve();
		})
		.then(function () {
			$effacer.hasClass("in") //oublier les données personnalisées
			&& $effacer.trigger("click");
			$(":checkbox, :radio[checked], select:not(#datas)").trigger("change");
			$(".contribuer, #aideUtilisation:not(.sans) #mdemploi, .visiteur").click();
	})	});




//Replier et déplier les analyses détaillées
	$analyse.on("change", function (e) {
		$meta.attr("class", $analyse.is(":checked") ? "" : "sans");
	});




//Déplier le mode d'emploi
	$("#mdemploi, [href='#mdemploi']").on("click", function (e) {
		e.preventDefault();
		$aideU.toggleClass("sans");
	});




//Afficher le mode d'emploi
	$mde.on("change", function () {
		$aideU[($mde.is(":checked") ? "remove" : "add") + "Class"]("nulle");
	});




//Aide (à partir de l'atribut "title") contextuelle pour visualiser de nouvelles données
	$aideP.on("focus mouseover click", function (e) {
		e.preventDefault();
		$(".contribuer").length == 0
		&& $(this).after($("<p>", {
			class: "contribuer",
			tabindex: 1,
			html: $(this).attr("title")
				.replace(/;/g, ",<br>")
				.replace(/…/g, ".<br>")
				.replace("Tout retour", "<br>Tout retour")
				.replace(/(http:\/\/.+)\.$/, '<a href="$1" onclick="event.stopPropagation();">contact</a>.') //to do : pourquoi pas après ligne suivante ?
				.replace(/(exemple(-là)?)/g, '<a href="' + $("#exemple").attr("href") + '" onclick="event.stopPropagation();">$1</a>')
				.replace(/\(([^\)]+)\)/, '- <a href="' + $("#ex").attr("value") + '" onclick="event.stopPropagation();">$1</a> -')
				+ fermeture,
			on: {
				"click": function (e) {
					e.preventDefault();
					$(".contribuer").remove();
		}	}	}))
		.focus();
	})
	$("[href='#aidePersonnalisation']").on("click", function (e) {
		e.preventDefault();
		$aideP.trigger("click");
	});



//Autres données disponibles via boîte de sélection
	$f.data("vue", $datas.val());
	$datas.on({
		"keydown": function () {
			$datas.data("keydown", $datas.val())
			.css("width", $datas.outerWidth());
			// .addClass("key"); //to do : impossible de trigger $modifier au clavier ?
			$datas.defaut = $("#dernier").detach();
		},
		"keyup": function (e) {
			var storage = $datas.data("keydown");
			$datas.data("keydown", null)
			.css("width", "auto");
			$datas.defaut.appendTo($datas);
			$datas.val() != storage
			&& $datas.trigger("change");
		},
		"change": function (e, r) {
			var va = $datas.val();
			if (va == "0") { //charger de nouvelles données
				$datas.val($f.data("vue"));
				return $modifier.trigger("click");
			}
			$f.data("vue", va);
			$f.removeClass("settled"); //remis dans 2-interface.js cf interfacter()
			$("#jsdatas").remove();
			var $s = $("<script>", {
				id: "jsdatas",
				on: {
					"load": function () {
						analyser();
						interfacter();
						visualiser();
						r //promesse depuis le chargement de nouvelles données ou depuis localStorage
						&& r();
			}	}	})
			.appendTo($b);
			if (va != "perso")
				return $s.attr("src", va);
			$s.text(localStorage.getItem("personnalisees"))
			.trigger("load");
	}	})
	.get(0)
	.selectedIndex = 0;




//Charger de nouvelles données via le formulaire
	$modifier.on("change", charger)
	.on("focus", function () { //aide contextuelle au clavier
		$(".contribuer").remove();
	})
	.get(0).value = ""; //nettoyage du champ au chargement

//Charger de nouvelles données via un drop sur la page
	document.ondragenter = neutraliser;
	document.ondragover = neutraliser;
	document.ondrop = function (e) {
		neutraliser(e);
		charger.call(e.dataTransfer, true);
	}

//Charger de nouvelles données
	function charger (drop) {
		var popout = (function popout (e) {
				e
				&& neutraliser(e);
				$b.off("click.message")
				.removeClass("popin");
				$(".message").remove();
				$modifier.focus();
				return popout;
			})(),
			thisName = '"' + this.files[0].name + '"',
			versement = new FileReader();
/*			$s = $("<script>", {
				id: "jsdatas",
				on: { //pb accent sur Chrome, cf. plus loin - de toute façon mauvais endroit pour rajout de <script (* obs. 1/3)
					"load": function () {
						analyser();
						interfacter();
			}	}	})
			.appendTo($b);*/

		versement.onload = function() {
			var verification = eclaircir(this.result),
				erreur = [];

			try {

		//test 1
				eval(this.result);

		//test 2
				for (var k in re) {
					re[k].lastIndex = 0;
					! re[k].test(verification)
					&& erreur.push("la variable '" + k + "'");
				}
				if (erreur.length > 0)
					throw "vérifier " + erreur.join(" et ");

		//tests concluants et prise en compte des données personnélisées :
				drop == true
				&& ($modifier.get(0).value = "");

				$fichier.text(perso[0] + thisName)
				.addClass("perso");

				localStorage.setItem("personnalisees", this.result);

				localStorage.setItem("optionPerso", '<option id="perso" value="perso" data-perso=' + thisName + '>' + perso[1] + thisName + '</option>');
				! $perso
				&& $(localStorage.getItem("optionPerso")).insertBefore($dernier)
				&&  ($perso = $("#perso"))
				|| $perso.text(perso[1] + thisName);

/*	(* obs 2/3)
	accents ne passent pas sur Chrome :
				$s.attr("src", "data:text/javascript;base64," + btoa(unescape(encodeURIComponent(this.result)))); //https://developer.mozilla.org/fr/docs/Décoder_encoder_en_base64
//	http://stackoverflow.com/questions/14535484/how-to-encode-utf8-characters-into-base64-in-javascript
//	decodeURIComponent(escape(window.atob(window.btoa(unescape(encodeURIComponent("‌​東京"))))))	*/

				new Promise(function (resolve) {
					$datas.val("perso").trigger("change", [resolve]); //là sont insérées les données via le rajout de <script (* obs. 3/3)
				})

		//oubli des données personnalisées
				.then(function () {
					$effacer.addClass("in")
					.on("click", oublier);
			}); }
			catch(e) {
				$b.addClass("popin")
				.append($("<p>", {
					class: "message",
					tabindex: 0,
					html: thisName + " : " + message + "<em>" + e + "</em>" + fermeture
				}))
				.on("click.message", popout);
				$(".message").focus();
		}	}
		versement.readAsText(this.files[0]);
	}

//Oublier les données chargées
	function oublier (e) {
		e.preventDefault();

		$effacer.removeClass("in")
		.off();

		$fichier.text(perso[2])
		.removeClass("perso");
		$modifier.get(0).value = "";

		localStorage.removeItem("personnalisees");
		localStorage.removeItem("optionPerso");

		! e.isTrigger //a exécuté quand est triggé (depuis reset)
		&& $datas.val() == "perso"
		&& $datas.val(datasDefaut)
		&& $datas.trigger("change");

		$perso.remove();
		$perso = null;
	}






//Mémoriser les paramètres d'affichage de l'analyse et du mode d'emploi, les restituer
	if (localStorage.getItem("debut") === null || (/^\d{13,}$/).test(localStorage.getItem("debut")) && Date.now() - parseInt(localStorage.getItem("debut")) > 2592000000) //30 jours
		localStorage.clear();
	else {
	//reset du formulaire statique au chargment cf. 2-interface.js : $f.get(0).reset();
		localStorage.getItem("optionPerso") !== null
		&& $(localStorage.getItem("optionPerso")).insertBefore($dernier)
		&& ($perso = $("#perso"))
		&& $fichier.text(perso[0] + '"' + $perso.data("perso") + '"')
		.addClass("perso")
		&& $effacer.addClass("in")
		.on("click", oublier);


		tempo = localStorage.getItem("datas");
		new Promise(function (resolve) {
			tempo != $datas.val()
			&& $datas.val(tempo).trigger("change", [resolve])
			|| resolve();
		})
		.then(function () {
			var $tempo = [$("tbody :checkbox"), $("tbody :radio")];

			tempo = localStorage.getItem("presentation");
			tempo != $("[name='presentation']:checked").val()
			&& $pres.eq(parseInt(tempo)).prop("checked", true).trigger("change");

			tempo = localStorage.getItem("liste9");
			tempo != $("[name='liste9']:checked").val()
			&& $("[name='liste9']:checked").prop("checked", false) //tempo == undefined
			&& $("[name='liste9']").eq(parseInt(tempo)).prop("checked", true).trigger("change");

			tempo = JSON.parse(localStorage.getItem("mdemploi"));
			tempo != $mde.is(":checked")
			&& $mde.prop("checked", tempo).trigger("change");

			tempo = JSON.parse(localStorage.getItem("analyse"));
			tempo != $analyse.is(":checked")
			$analyse.prop("checked", tempo).trigger("change");

			tempo = localStorage.getItem("amplitude");
			tempo != $("#croiser").val()
			&& $("#croiser").val(tempo).trigger("change");

			for (var k in localStorage) //organisation du tableau
				if (k.indexOf("presentationC") == 0) {
					$tempo[2] = parseInt(k.split("presentationC")[1]);

					tempo = JSON.parse(localStorage.getItem(k));
					tempo != $tempo[0].eq($tempo[2]).is(":checked")
					&& $tempo[0].eq($tempo[2]).prop("checked", tempo).trigger("change");

					tempo = parseInt(localStorage.getItem("presentationR" + $tempo[2])); //valeur est une chaîne mais pas toujours ?
					tempo != 0
					&& $tempo[1].eq($tempo[2] * 2 + 1).prop("checked", true).trigger("change");
	}	});	}

	localStorage.setItem("debut", Date.now());

	window.onunload = function () {
		localStorage.setItem("datas", $datas.val()); //set de données
		localStorage.setItem("presentation", $("[name='presentation']:checked").val()); //ligne ou colonne
		localStorage.setItem("liste9", $("[name='liste9']:checked").val()); //champs en tête de tableau
		localStorage.setItem("mdemploi", $mde.is(":checked")); //mode d'emploi
		localStorage.setItem("analyse", $analyse.is(":checked")); //liens de l'analyse des amplitudes
		localStorage.setItem("amplitude", $("#croiser").val()); //boîte de sélection de l'analyse des amplitudes
		for (var k in localStorage) //organisation du tableau
			if (k.indexOf("selection") == 0)
				localStorage.removeItem(k);
		$("tbody tr").each(function (ind) {
			var $ti = $(this);
			localStorage.setItem("presentationC" + ind, $ti.find(":checkbox").is(":checked"));
			localStorage.setItem("presentationR" + ind, $ti.find(":radio:checked").val());
	});	}




	setTimeout(function () {
		$b.removeClass("init");
	}, 1000);

})();
