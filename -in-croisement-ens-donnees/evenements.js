;(function () {
	"use strict";

/* aide - 01/2016 */
	var $aide = $("#aide");
	$("#lire-mode-d-emploi").on("click", function (e) {
		e.preventDefault();
		$aide.toggleClass("sans");
	});

	$("#masquage").on("change", function (e) {
		$meta.attr("class", $(this).is(":checked") ? "sans" : "");
	})
	.trigger("change");

	$("#modification").on("click", function () {
		analyser();
		interfacter();
	});


/* to do: cookie pour Chrome ? */



})();
