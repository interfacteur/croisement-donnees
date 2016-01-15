;(function () {
	"use strict";

/* aide - 01/2016 */
	var $b = $("body"),
		$aide = $("#aide"),
		$big = $("#big"),
		exemple = $("[title='exemple']").attr("href");



//Déplier l'aide
	$("#lire-mode-d-emploi").on("click", function (e) {
		e.preventDefault();
		$aide.toggleClass("sans");
	});

//Replier et déplier l'analyse des croisements
	$("#masquage").on("change", function (e) {
		$meta.attr("class", $(this).is(":checked") ? "sans" : "");
	})
	.trigger("change");

//Charger de nouvelles données
	$("#modification").on("change", function () {
		var charge = new FileReader(),
			$s = $("<script>", {
				on : {
					"load": function () {
						analyser();
						interfacter();
			}	}	})
			.appendTo($b);
		charge.onload = function() {
			$s.attr("src", this.result);
		}
		charge.readAsDataURL(this.files[0]);
	});

//Aide contextuelle pour les nouvelles données
	$big.on("focus mouseover click", function (e) {
		e.preventDefault();
		$(".contribuer").length == 0
		&& $(this).after($("<p>", {
			class: "contribuer",
			html: $(this).attr("title")
				.replace(/…/g, ".<br>")
				.replace(/(http:\/\/.+)\.$/, '<a href="$1" onclick="event.stopPropagation();">contact</a>.') //to do : pourquoi pas après ligne suivante ?
				.replace(/(exemple(-là)?)/g, '<a href="' + exemple + '" onclick="event.stopPropagation();">$1</a>')
				.replace(/\(([^\)]+)\)/, '- <a href="' + exemple.replace("2", "") + '" onclick="event.stopPropagation();">$1</a> -'),
			on: {
				"click": function (e) {
					e.preventDefault();
					$(".contribuer").remove();
	}	}	}));});
	$("[href='#big").on("click", function (e) {
		e.preventDefault();
		$big.trigger("click");

	})


/* to do: cookie pour Chrome ? */



})();
