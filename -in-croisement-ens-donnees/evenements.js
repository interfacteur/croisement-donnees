/* Aide, affichages, changer de données - 01/2016 */

;(function () {
	"use strict";


	if (! conditions) //cf. analyse-donnees.js
		return;


	var $b = $("body"),
		$analyse = $("#analyse"),
		$mde = $("#mde"),
		$pres = $("[name='presentation']"),
		$aideU = $("#aideUtilisation"),
		$aideP = $("#aidePersonnalisation"),
		$modifier = $("#modifier"),
		$fichier = $("#fichier"),


		parametres = [
			["analyse", "mde", "pres1"],
			[$analyse, $mde, $pres],
			["checkbox", "checkbox", "radio"]
		],


		message = "Les données chargées ne correspondraient pas à la forme attendue",
		fermeture = $(".fermeture").get(0)
			.outerHTML
			.replace(/(href="#)[^"]+"/, '$1javascript:void(0);"'),


 		gerer = function (e) {
			e.stopPropagation();
			e.preventDefault();
		},
		eclaircir = function (str) { //https://github.com/interfacteur/js-segments/blob/master/regex.fonctions.js
			return str.replace(/\/\/.*/g, "") //sans les commentaires sur une ligne
				.replace(/\/\*([^\*]|\*(?!\/))*\*\//g, "") //sans les commentaires sur plusieurs lignes
				.replace(/^\s*/, "") //sans les espacements initiaux (dont retours)
				.replace(/[\t\v]/g, " ") //remplacer les tabulations horizontales et verticales par un espacement
				.replace(/\x20{2,}/g, " ") //remplacer les espacements multiples par un espacement
				.replace(/[\f\n\r\u2028\u2029]/g, ""); //sans les retours à la page, à la ligne et charriot
		},


		re = {
			informations: /var informations ?= ?{(?=.*"titre" ?: ?(?:(?:"(?:[^"]|\\")*[^\\]")|(?:'(?:[^']|\\')*[^\\]')))(?=.*"typeTableaux" ?: ?\[ ?(?:(?:(?:"(?:[^"]|\\")*[^\\]")|(?:'(?:[^']|\\')*[^\\]'))(?:(?: ?, ?(?=["']))|(?: ?))){3} ?\])(?=.*"genreTableaux" ?: ?(["'])[mf]\1)(?=.*"typeElements" ?: ?\[ ?(?:(?:(?:"(?:[^"]|\\")*[^\\]")|(?:'(?:[^']|\\')*[^\\]'))(?:(?: ?, ?(?=["']))|(?: ?))){2} ?\])(?=.*"genreElements" ?: ?(["'])[mf]\2)/,
			datas: /var datas ?= ?\{ ?(?: ?"[^"]+" ?: ?\{ ?"titre" ?: ?(?:(?:"(?:[^"]|\\")*[^\\]")|(?:'(?:[^']|\\')*[^\\]')) ?, ?(?:"\d+" ?: ?\d+ ?(?:(?:, ?(?=(?:"\d)|\}))|(?=\}))){1,} ?\} ?(?:(?:, ?(?=["}]))|(?=\}))){2,7}\}/
		};




//Replier et déplier l'analyse des croisements
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
	$("#datas").on("change", function () {
		$("#jsdatas").remove();
		var $s = $("<script>", {
			id: "jsdatas",
			on: {
				"load": function () {
					analyser();
					interfacter();
		}	}	})
		.appendTo($b);
		$s.attr("src", $(this).val());
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
	document.ondragenter = gerer;
	document.ondragover = gerer;
	document.ondrop = function (e) {
		gerer(e);
		charger.call(e.dataTransfer, true);
	}
//Charger de nouvelles données
	function charger (drop) {
		$("#jsdatas").remove();
		var thisName = '"' + this.files[0].name + '"',
			charge = new FileReader(),
			$s = $("<script>", {
				id: "jsdatas"/*,
				on: { //pb accent sur Chrome
					"load": function () {
						analyser();
						interfacter();
			}	}*/	})
			.appendTo($b);
		charge.onload = function() {
			var verification = eclaircir(this.result),
				erreur = [];
			try {

		//test 1
				for (var k in re)
					! re[k].test(verification)
					&& erreur.push("la variable '" + k + "'");
				if (erreur.length > 0)
					throw "vérifier " + erreur.join(" et ");

		//test 2
				eval(this.result);

				$s.text(this.result);

				$f.removeClass("settled");
				$fichier.text(thisName);
				drop == true
				&& ($modifier.get(0).value = "");

				analyser();
				interfacter();
/*
	accents ne passent pas sur Chrome :
				$s.attr("src", "data:text/javascript;base64," + btoa(unescape(encodeURIComponent(this.result)))); //https://developer.mozilla.org/fr/docs/Décoder_encoder_en_base64

//	http://stackoverflow.com/questions/14535484/how-to-encode-utf8-characters-into-base64-in-javascript
//	decodeURIComponent(escape(window.atob(window.btoa(unescape(encodeURIComponent("‌​東京"))))))	*/

			}
			catch(e) {
				$b.append($("<p>", {
					class: "message",
					tabindex: 0,
					html: message + "<em>" + e + "</em>" + fermeture
				}))
				.on("click.message", function (e) {
					e.preventDefault();
					$b.off("click.message");
					$(".message").remove();
					$modifier.focus();
				});
				$(".message").focus();
		}	}
		charge.readAsText(this.files[0]);
	}



//Mémoriser les paramètres d'affichage de l'analyse et du mode d'emploi
	if (typeof localStorage != "undefined") {
		if (! "debut" in localStorage || Date.now() - parseInt(localStorage.getItem("debut")) > 2592000000) //30 jours
			localStorage.setItem("debut", Date.now());
		else
			parametres[0].forEach(function (val, ind) {
				val in localStorage
				&& (parametres.choix = parametres[2][ind] == "checkbox" ?
					[1, localStorage.getItem(val) == "true"] :
					[localStorage.getItem(val) == "true" ? 1 : 2, "true"]
				)
				&& parametres[1][ind].eq(--parametres.choix[0]).prop("checked", parametres.choix[1])
				&& parametres[1][ind].eq(parametres.choix[0]).trigger("change");
			});
		window.onunload = function () {
			localStorage.setItem("analyse", $analyse.is(":checked"));
			localStorage.setItem("mde", $mde.is(":checked"));
			localStorage.setItem("pres1", $("#pres1").is(":checked"));
	}	}



	setTimeout(function () {
		$b.removeClass("init");
	}, 1000);

})();
