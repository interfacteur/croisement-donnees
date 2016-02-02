/* Aide, affichages, changer de données - 01/2016 */

;(function () {
	"use strict";


	if (! conditions) //cf. analyse-donnees.js
		return;




	var $analyse = $("#analyse"),
		$datas = $("#datas"),
		$mde = $("#mde"),
		$pres = $("[name='presentation']"),
		$aideU = $("#aideUtilisation"),
		$aideP = $("#aidePersonnalisation"),
		$modifier = $("#modifier"),
		$fichier = $("#fichier"),
		$span = $("#m span"),
		storage,

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


//visualiser les intersections extrèmes : fonction constructrice, prototype etc.
		visualiser = (function visualiser () {

			var $visus = [],
				$millesimes = $("#millesimes"),
				$croiser = $("#croiser"),
				$ml = $("#meta a"),
				valindex = 0;

			cles.forEach(function (val) {
				$("#meta [href='#" + val + "']").css("box-shadow", "2px 1px 0 1px " + $("#" + val + " th").css("background-color") + " inset");
			});

			$("#m").on("click", function (e) { //replier et déplier les analyses détaillées des millésimes
				e.preventDefault();
				$(this).toggleClass("visu");
				$millesimes.toggleClass("visu");
				$span.text($span.text() == "→" ? "X" : "→");
			});


	//Fonction constructrice : qui sera instanciée pour autant de liens que dans #meta
			function Visu (ind) {
				if (! this instanceof Visu)
					throw new Error("Attention à l'instanciation");
				this.etats = {
					passage: false,
					etape: false,
				}
				this.approprier(ind);
				this.gerer();
			}
			Visu.passage = false;
			Visu.etape = false;
			Visu.base = false;

			Visu.debug = false;


	//Comme setter
			Visu.prototype.approprier = function (ind) {
				var $champsD3indirect = $();

				this.$lien = $ml.eq(ind);
				this.$lien.data("instance", this);

				this.ide = this.$lien.attr("href").split("#")[1];
				this.nombre = this.$lien.data("nombre");
				this.croisement = this.$lien.data("croisement");
				this.taille = this.$lien.data("taille");
				this.croisementtype = this.$lien.data("croisementtype");

				this.$champ = $("#" + this.ide);
				this.$champsD2D3 = $("tbody tr:not(#" + this.ide + ") td." + this.ide);
				this.$champsD3direct = this.$champ.find("[data-xection='" + this.taille + "']");
				storage = this.ide;
				this.$champsD3direct.each(function () {
					$champsD3indirect = $champsD3indirect.add($("tbody tr:not(#" + storage + ") [data-nombre='" + $(this).data("nombre") + "']"));
				});
				this.$champsD3indirect = $champsD3indirect;
				this.$champs = this.$champsD2D3.add(this.$champsD3direct).add(this.$champsD3indirect);

				this.$label = this.$champ.find("label");

				this.$option = $croiser.find("option:eq(" + (ind + 1) + ")");
				this.$option.data("instance", this);

				this.$champs.each(function () {
					var $ti = $(this);
					$ti.data("classes", $ti.attr("class"));
				});

				this.indexSource = ind;
				this.indexBut = this.$champ.index();
			}


	//Gérer les événements
			Visu.prototype.gerer = function () {
				this.$lien.on("mouseover keyup", Visu.passer);
				this.$lien.on("mouseout blur", Visu.depasser);
				this.$lien.on("click", Visu.visiter);
			}


			Visu.passer = function () {
				$(this).data("instance").passer();
			}

	//Activer provisoirement
			Visu.prototype.passer = function (select) {
				var clss = "passage intersection";

				if (this.etats.passage == true || this.etats.etape == true) //est déjà mouseover, keyup ou clic positif
					return;

				if (Visu.debug) console.log("passer", Visu.etape, Visu.base, this.ide, this.indexSource);

				Visu.etape //un autre est déjà clic positif : le mémoriser pour une restitution onmouseout ou onblur (depasser())
				&& (storage = Visu.etape)
				&& ! (Visu.etape.etats.etape = false)
				&& Visu.etape.boucler(select) /* (plus de trigger donc plus besoin de promesses) */
				&& (Visu.base = storage);

				if (Visu.debug) console.log("passer", Visu.etape, Visu.base, this.ide, this.indexSource);

				Visu.passage //un autre est déjà mouseover ou keyup
				&& Visu.passage.depasser(select, true);

				if (Visu.debug) console.log("passer", Visu.etape, Visu.base, this.ide, this.indexSource);

				this.$label.attr("data-intersection", this.croisement + " : " + this.taille); //activation
				this.croisementtype.indexOf("d2") >= 0
				&& (clss += " intersectionD2");
				this.croisementtype == "d3"
				&& (clss += " intersectionD3")
				&& this.$champsD3direct.addClass("diasection");
				this.croisementtype.indexOf("d3") >= 0
				&& this[this.croisementtype == "d2d3" ? "$champsD2D3" : "$champsD3indirect"].addClass("intersexion intersexion" + (this.indexBut + 1));
				this.$champ.addClass(clss);

				! select
				&& $croiser.val(this.indexSource); //adapter la valeur de la boîte de sélection

				this.etats.passage = true; //est activé
				Visu.passage = this; //passage actuel

				return true;
			}


			Visu.depasser = function () {
				$(this).data("instance").depasser();
			}

	//Désactiver
			Visu.prototype.depasser = function (select, passant) {

				if (Visu.debug) console.log("depasser", this.ide, this.indexSource);

				if (this.etats.passage == false || this.etats.etape == true) //est déjà désactivé, ou est en clic positif
					return;

				if (Visu.debug) console.log("depasser", this.ide, this.indexSource);

				if (! passant && Visu.base) { //restituer précédent clic positif mémorisé (entamer, d'où passer, d'où de nouveau depasser, puis fin passer, puis fin entamer)
					storage = Visu.base; //l'étape mémorisée
					storage.$lien.removeClass("consigne");
					Visu.base = false;
					return storage.entamer(select);
				}

				if (Visu.debug) console.log("depasser", this.ide, this.indexSource);

				this.$label.attr("data-intersection", "");
				this.$champs.each(function () {
					var $ti = $(this);
					$ti.attr("class", $ti.data("classes"));
				});
				this.$champ.attr("class", "");

				! select
				&& $croiser.val(-1); //reset de la valeur de la boîte de sélection

				this.etats.passage = false; //est effacé
				Visu.passage = false; //aucun passage actuel

				return true;
			}


			Visu.visiter = function (e) {
				e.preventDefault();
				$(this).data("instance").visiter();
			}

	//Confirmer ou infirmer l'état actif
			Visu.prototype.visiter = function (select) {
				storage = Visu.base; //l'étape mémorisée
				$(".consigne").removeClass("consigne");
				Visu.base = false;

				if (Visu.debug) console.log("visiter", storage, Visu.etape, this.ide, this.indexSource);

				Visu.etape
				&& Visu.etape.indexSource != this.indexSource
				&& Visu.etape.boucler(select); //effacer l'étape actuelle

				if (Visu.debug) console.log("visiter", storage, Visu.etape, this.ide, this.indexSource);

				storage
				&& storage.indexSource != this.indexSource
				&& storage.boucler(select); //oublier l'étape mémorisée

				if (Visu.debug) console.log("visiter", storage, Visu.etape, this.ide, this.indexSource);

				this.etats.etape == false
				&& this.entamer(select) //n'est pas déjà cliqué : -> clic positif
				|| this.boucler(select); //est déjà cliqué : -> clic négatif

				if (Visu.debug) console.log("visiter", storage, Visu.etape, this.ide, this.indexSource);

				return true;
			}

	//Confirmer l'état actif
			Visu.prototype.entamer = function (select) {

				if (Visu.debug) console.log("entamer", this.ide, this.indexSource);

				! this.etats.passage //n'est pas déjà mouseover ou keyup (cf. mélanges navigation clavier et souris ; et cf. base) : l'activer
				&& this.passer(select);
				this.etats.etape = true;
				this.$lien.addClass("visiteur consigne");
				this.$champ.addClass("visite");
				Visu.etape = this; //etape actuelle
				! select
				&& $croiser.val(this.indexSource); //adapter la valeur de la boîte de sélection

				if (Visu.debug) console.log("entamer", this.ide, this.indexSource);
				return true;
			}

	//Infirmer l'état actif
			Visu.prototype.boucler = function (select) {

				if (Visu.debug) console.log("boucler", this.ide, this.indexSource);

				this.etats.etape = false;
				this.depasser(select);
				this.$lien.removeClass("visiteur");
				this.$champ.removeClass("visite");
				Visu.etape = false; //aucune étape actuelle
				! select
				&& $croiser.val(-1); //reset de la valeur de la boîte de sélection

				if (Visu.debug) console.log("boucler", this.ide, this.indexSource);

				return true;
			}


	//Ajuster la boîte de sélection
			Visu.prototype.correler = function (ind, tps) {
				clearTimeout(latence);
				! Visu.select
				&& (latence = setTimeout(function () {
					$croiser.val(ind); //valeur de la boîte de sélection
				}, tps));
				Visu.select == this
				&& (Visu.select = (this.select = false));
			}


	//Instanciation
			$ml.each(function (ind) {
				$visus.push(new Visu(ind));
			});


	//La boîte de sélection
			$croiser.append(
				intersectionsQuali.map(function (val, ind) {
					return intersections[ind].map(function (v) {
						return '<option value="' + (valindex++) + '">' + val + " : " + v + '</option>';
					})
					.join("")
				})
				.join("")
			)
			.on("change keyup", function () {
				var va = parseInt($(this).val());
				va > -1
				&& $ml.eq(va).data("instance").visiter(true)
				|| Visu.etape
				&& Visu.etape.visiter(true);
			});

			return visualiser;
		})();
//fin du code à orientation prototypale (visualiser les intersections extrèmes)




//Neutraliser la soumission du formulaire
	$f.on("submit", function (e) {
		e.preventDefault();
	});




//Rétablir l'affichage par défaut
	$("#defaut").on("click", function (e) {
		e.preventDefault;
		$f.get(0).reset();
		$(":checkbox, :radio[checked], select").trigger("change");
		$(".contribuer, #aideUtilisation:not(.sans) #mdemploi").click();
	});




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
	$datas.on("change", function (e, r) {
		var va = $(this).val();
		$f.removeClass("settled"); //remis dans .interface.js cf interfacter()
		$("#jsdatas").remove();
		var $s = $("<script>", {
			id: "jsdatas",
			on: {
				"load": function () {
					analyser();
					interfacter();
					visualiser();
					r //promesse depuis localStorage
					&& r();
		}	}	})
		.appendTo($b);
		if (va != "perso")
			return $s.attr("src", va);
		$s.text(localStorage.getItem("perso"))
		.trigger("load");

	})
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
			charge = new FileReader();
/*			$s = $("<script>", {
				id: "jsdatas",
				on: { //pb accent sur Chrome, cf. plus loin (quoi qu'il en soit, devrait être là où désormais inséré)
					"load": function () {
						analyser();
						interfacter();
			}	}	})
			.appendTo($b);*/

		charge.onload = function() {
			var verification = eclaircir(this.result),
				erreur = [];

			try {

		//test 1
				for (var k in re) {
					re[k].lastIndex = 0;
					! re[k].test(verification)
					&& erreur.push("la variable '" + k + "'");
				}
				if (erreur.length > 0)
					throw "vérifier " + erreur.join(" et ");

		//test 2
				eval(this.result);

				$f.removeClass("settled"); //remis dans .interface.js cf interfacter()
				$("#jsdatas").remove();
				$("<script>", {
					id: "jsdatas",
					text: this.result
				})
				.appendTo($b);

				$fichier.text(thisName);

				drop == true
				&& ($modifier.get(0).value = "");

				localStorage.setItem("perso", this.result);
				localStorage.setItem("optionPerso", '<option id="perso" value="perso">Personnelles : ' + thisName + '</option>');
				! $("#perso").length
				&& $datas.append(localStorage.getItem("optionPerso"))
				|| $("#perso").text("Données personnalisées : " + thisName);
				localStorage.setItem("datas", "perso");
				$datas.val("perso");

				analyser();
				interfacter();
				visualiser();
/*
	accents ne passent pas sur Chrome :
				$s.attr("src", "data:text/javascript;base64," + btoa(unescape(encodeURIComponent(this.result)))); //https://developer.mozilla.org/fr/docs/Décoder_encoder_en_base64

//	http://stackoverflow.com/questions/14535484/how-to-encode-utf8-characters-into-base64-in-javascript
//	decodeURIComponent(escape(window.atob(window.btoa(unescape(encodeURIComponent("‌​東京"))))))	*/

			}
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
		charge.readAsText(this.files[0]);
	}




//Mémoriser les paramètres d'affichage de l'analyse et du mode d'emploi, les restituer
	if (! "debut" in localStorage || Date.now() - parseInt(localStorage.getItem("debut")) > 2592000000) { //30 jours
		localStorage.clear();
		localStorage.setItem("debut", Date.now());
	}
	else {
		"optionPerso" in localStorage
		&& $datas.append(localStorage.getItem("optionPerso"))
		storage = localStorage.getItem("datas");
		new Promise(function (resolve) {
			$datas.val() != storage
			&& $datas.val(storage).trigger("change", [resolve])
			|| resolve();
		})
		.then(function () {
			var tempo,
				$tempo = [$("tbody :checkbox"), $("tbody :radio")];

			storage = localStorage.getItem("presentation") == "true";
			$pres.eq(storage ? 0 : 1).prop("checked", true).trigger("change");

			storage = parseInt(localStorage.getItem("liste9"));
			$("[name='liste9']").eq(storage).prop("checked", true).trigger("change");

			storage = JSON.parse(localStorage.getItem("mdemploi"));
			$mde.prop("checked", storage).trigger("change");

			storage = JSON.parse(localStorage.getItem("analyse"));
			$analyse.prop("checked", storage).trigger("change");

			storage = parseInt(localStorage.getItem("amplitude"));
			$("#croiser").val(storage).trigger("change");

			for (var k in localStorage) //organisation du tableau
				if (k.indexOf("presentationC") == 0) {
					tempo = parseInt(k.split("presentationC")[1]);

					storage = JSON.parse(localStorage.getItem(k));
					$tempo[0].eq(tempo).prop("checked", storage).trigger("change");

					storage = parseInt(localStorage.getItem("presentationR"));
					$tempo[1].eq(tempo * 2 + storage).prop("checked", true).trigger("change");
	}	});	}
	window.onunload = function () {
		localStorage.setItem("datas", $datas.val()); //set de données
		localStorage.setItem("presentation", $("#pres1").is(":checked")); //ligne ou colonne
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
