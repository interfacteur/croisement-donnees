;(function () {
	"use strict";

/* aide - 01/2016 */
	var $b = $("body"),
		$aideU = $("#aideUtilisation"),
		$modifier = $("#modifier"),
		$aideP = $("#aidePersonnalisation"),
		exemple = $("#exemple").attr("href"),
		message = "Les données chargées ne correspondraient pas à la forme attendue",
		fermeture = $(".fermeture").get(0)
			.outerHTML
			.replace(/(href="#)[^"]+"/, '$1javascript:void(0);"'),
		clearLineJS = function (str) {
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




//Déplier le mode d'emploi
	$("#mdemploi, [href='#mdemploi']").on("click", function (e) {
		e.preventDefault();
		$aideU.toggleClass("sans");
	});

//Afficher le mode d'emploi
	$("#mde").on("change", function () {
		$aideU[($(this).is(":checked") ? "remove" : "add") + "Class"]("nulle");
	})
	.trigger("change");


//Replier et déplier l'analyse des croisements
	$("#analyse").on("change", function (e) {
		$meta.attr("class", $(this).is(":checked") ? "" : "sans");
	})
	.trigger("change");


//Charger de nouvelles données
	$modifier.on("change", function () {
		var charge = new FileReader(),
			$s = $("<script>", {
				on : {
					"load": function () {
						analyser();
						interfacter();
			}	}	})
			.appendTo($b);
		charge.onload = function() {
			try {
				var verification = clearLineJS(this.result),
					erreur = [];
				for (var k in re)
					! re[k].test(verification)
					&& erreur.push("la variable '" + k + "'");
				if (erreur.length > 0)
					throw "vérifier " + erreur.join(" et ");
				eval(this.result);
				$s.attr("src", "data:text/javascript;base64," + btoa(unescape(encodeURIComponent(this.result)))); //https://developer.mozilla.org/fr/docs/Décoder_encoder_en_base64
				$f.removeClass("settled");
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
	})
	.on("focus", function () {
		$(".contribuer").remove();
	});


//Aide contextuelle pour les nouvelles données, à partir de l'atribut "title"
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
				.replace(/(exemple(-là)?)/g, '<a href="' + exemple + '" onclick="event.stopPropagation();">$1</a>')
				.replace(/\(([^\)]+)\)/, '- <a href="' + exemple.replace("2", "") + '" onclick="event.stopPropagation();">$1</a> -')
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



	setTimeout(function () {
		$b.removeClass("init");
	}, 1000);

})();
