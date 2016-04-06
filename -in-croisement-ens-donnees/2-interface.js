/* "vue" et "contrôle vue" de MVC - 2014, 01-02/2016 */


//Générer l'interface, visualiser les séries par sélection
;var interfacter = (function interfacter () {
	"use strict";

/* code initial août 2014, procédural
	révision skin en 2015
	analyse des données en 2015-2016 cf. 1-analyse-donnes.js et 3-evenements.js */


	if (! conditions) //cf. 1-analyse-donnees.js
		return;


	var collection = cles, //cf. 1-analyse-donnees.js
		listes = [],
		combien,
		longueur = 0,
		longueurs = [],
		total = 0,
		code = ["<tbody>"],
		manu = [
			'<input type="radio" name="liste',
			'" id="liste',
			'" checked>',
			'">',
			'<input type="checkbox" name="commun" id="commun',
			'<label for="liste',
			'</label>',
			'commun',
			'" value="'
		],
		ordres = ["Données dans l'ordre d'origine&nbsp;:", "croissant&nbsp;:", "Sélectionner tout&nbsp;:", "rien&nbsp;:"],
		charge = [$("table")], //$("table") n'existe pas au chargement
		$synthese = $("#synthese"),
		$commentaires = $("#commentaires"),
		tempo,
		equarrir = function (n) {
			return typeof n == "undefined" || n > 9 ? n : "0" + n;
		}





	$("#titre").html(informations.titre);
	charge[charge[0].length] = charge[0].hasClass("colonne"); //au chargement : charge[0].length == 0 ; nouvelles données : charge[0].length == 1 d'où charge.lenght == 2

	$("table").remove();
	$synthese.html("&nbsp;");
	$(".presentation input").off(); //cf. commentaire début de 3-evenements.js

	for (var i=0,l=collection.length;i<l;++i) {
		listes.push($.map(datas[collection[i]],function(zel) { return zel; }));
		listes[i].unshift(listes[i].pop());
		longueurs.push(listes[i].length - 1);
		total += listes[i].length - 1;
		longueur = listes[i].length > longueur ? listes[i].length : longueur;
	}
	combien = listes.length;
	for (var i=0;i<l;++i) {
		code.push('<tr id="' + collection[i] + '"><th scope="row" data-qte="' + longueurs[i] + '">'
			+ manu[0] + i + manu[1] + i + 0 + manu[8] + 0 + manu[2]
			+ manu[0] + i + manu[1] + i + 1 + manu[8] + 1 + manu[3]
			+ '<label for="' + manu[7] + i + 2 + '" class="nb1" title="Surface d\'extension de ' + extensions[collection[i]][0] + extension
			+ ' pour &#x22;' + listes[i][0] + '&#x22;">' + extensions[collection[i]][0] + "</label>"
			+ manu[4] + i + 2 + manu[3]
			+ '<span class="nb2" title="Largeur d\'extension de ' + extensions[collection[i]][1] + extension
			+ ' pour &#x22;' + listes[i][0] + '&#x22;" tabindex="0">' + extensions[collection[i]][1] + '</span>'
			+ '<br><label class="label" for="' + manu[7] + i + 2 + '">' + listes[i][0] + " </label>");
		if (typeof zero == "undefined")
			for (var i2=1;i2<longueur;++i2)
				code.push('<td data-item="' + i2 + '" data-nombre="' + (listes[i][i2] || 100000000000) + '">' + (listes[i][i2] || "") + "</td>");
		else
			for (var i2=1;i2<longueur;++i2) {
				tempo = equarrir(listes[i][i2]);
				code.push('<td data-item="' + i2 + '" data-nombre="' + (tempo || 100000000000) + '">' + (tempo || "") + "</td>");
			}
		code.push("</tr>");
	}
	code.push("</tbody>");

	code.unshift('<thead><tr><td colspan="' + longueur + '">'

		+ '<p class="cloison">'

		+ '<label for="croiser" class="croiser">Entre 1 série et les autres, </label>'
		+ '<select id="croiser"><option value="-1">série dont le partage sur l\'ensemble est :</option>'
		+ amplitudes
		+ '</select>'

		+ '<select id="intersection">'
		+ '<option selected value="-1">Intersections maximales et minimales entre 2 séries</option>'
		+ '<optgroup label="Paires à intersection maximale :">'
		+ intersections[0]
		+ '</optgroup><optgroup label="Paires à intersection minimale :" id="intersection2">'
		+ intersections[1]
		+ '</optgroup></select>'

		+ '</p>'
		+ '<p class="cloison">'

		+ manu[5] + 90 + manu[3] + ordres[0] + manu[6]
		+ manu[0] + 9 + manu[1] + 90 + manu[8] + 0 + manu[2]
		+ manu[5] + 91 + manu[3] + ordres[1] + manu[6]
		+ manu[0] + 9 + manu[1] + 91 + manu[8] + 1 +  manu[3]

		+ manu[5] + 92 + manu[3] + ordres[2] + manu[6]
		+ manu[0] + 9 + manu[1] + 92 + manu[8] + 2 +  manu[3]
		+ manu[5] + 93 + manu[3] + ordres[3] + manu[6]
		+ manu[0] + 9 + manu[1] + 93 + manu[8] + 3 +  manu[3]

		+ '</p>'

		+ (typeof commentaires != "undefined" ? '<p class="cloison" id="commentaires">' + commentaires + '</p>' : "")

		+ "</td></tr>"
		+ '<tr><th scope="col">' + informations.typeTableaux[1] + "</th>"
		+ '<th scope="col" colspan="' + (longueur - 1) + '">' + informations.typeElements[1] + "</th>");


	$synthese.html(combien + ' ' + informations.typeTableaux[1] + ' avec '
		+ total + ' occurrences de '											//nombre d'occurrences des éléments spécifiques
		+ communs[2] + ' ' + informations.typeElements[1] + ' : '				//nombre d'éléments spécifiques
		+ ' <a href="#" id="singleton">'
		+ (communs[2] - communs[0]) + ' singletons</a> + '						//nombre d'éléments non répétés
		+ ' <a href="#" id="commun">' + communs[1] + ' occurrences</a>'			//nombre de répétitions
		+ ' de ' + communs[0] + ' ' + informations.typeElements[1]				//nombre d'éléments répétés
	);


	$ta = $("<table>", {
		data: { width : [12 + longueur * 3.3, l * 7.7 + .1], state: Date.now() },
		class: charge.slice(-1)[0] == true ? "colonne" : "",
		html: code.join("")}
	)
	.appendTo($f.addClass("settled"));

	$("header, form").css("width", 12 + longueur * 3 > 65 ? (12 + longueur * 3 < 80 ? 12 + longueur * 3 + "em" : "80em") : "65em");
	setTimeout(function () {
		$b.removeClass("prinit");
		$f.addClass("settled"); //Chrome ?
	}, 225);


/*
	à la fin de 1-analyse-donnees.js :
		$meta.html(code.join(""));
		$(".typeTab1").text(typeTab[0]); etc.

*/


	var $ta = $("table"),
		$tb = $("tbody"),
		$td = $("tbody td:not(:empty)"),
		$g = $("thead input"),
		$i = $("tbody input"),
		$i0 = $i.filter("[id$='0']"),
		$i1 = $i.filter("[id$='1']"),
		$i2 = $i.filter("[id$='2']"),
		$intersection = $("#intersection"),
		$commentaires = $("#commentaires"), //faculatifs
		bordures = ["3.3em 0 #FFF inset, ","5.95em 0 #FFF inset, "],
		bordures = ["",""],
		choix = "pres" + charge.slice(-1)[0] == true ? 2 : 1;

	$td.each(function(i) {
		var $t = $(this);
		if ($t.data("pres1"))
			return;
		var cellules = $($("[data-nombre='" + $t.data("nombre") + "']").get().reverse()),
			styles = "",
			extension = {}; //ajouté le 160127
		cellules.each(function() {
			styles += $(this).css("box-shadow") + ", ";
			extension[$(this).parent().attr("id")] = true;
		});
		extension = Object.keys(extension).join(" ");
		styles = styles.slice(0,-2);
		cellules.each(function() {
			$(this).data("pres1",bordures[0] + styles)
			.data("pres2",bordures[1] + styles)
			.addClass(extension + (cellules.length > 1 ? " multi" : ""))
			.attr("data-xection", cellules.length);
	});	});

	function redeployer(e) {
		var choix = $(this).attr("id"),
			$ta = $("table"), //(?)
			$tbodytd = $("tbody td"),
			$theadtd = $("thead td"),
			$cloisons = $commentaires.length == 1 ? [$(".cloison:eq(0)"), $(".cloison:eq(1)")] : null,
			ampli = $(".passage").length == 1 ? $(".passage").attr("id") : "", //couleurs de fond
			largeurTbody, largeurThead; //patch pour $("#intersection")
		if (choix == "pres1") {
			$ta.removeClass("colonne").css("width",$ta.data("width")[0] + "em");
			$intersection.css("margin", null);
			$commentaires.length == 1
			&& $commentaires.css("width",
				$theadtd.width()
				- $cloisons[0].outerWidth() - parseInt($cloisons[0].css("margin-right"))
				- $cloisons[1].outerWidth() - parseInt($cloisons[1].css("margin-right"))
				- 84
			);
		} else {
			$commentaires.length == 1
			&& $commentaires.css("width", "auto");
			$intersection.css("margin", null);
			$ta.addClass("colonne").css("width",$ta.data("width")[1] + "em");
			largeurTbody = $tbodytd.outerWidth() * combien; //patch pour $("#intersection")
			largeurThead = $theadtd.outerWidth() - 4;
			$intersection.css("margin", largeurThead > largeurTbody ? "1em " + (largeurTbody - largeurThead) / 2 + "px" : null);
		}
		$td.each(function(zi) {
			var $t = $(this);
			$t.css("box-shadow",$t.data(choix + ($t.data("ampli") == true ? ampli : "")));
	});	}
	if (charge.length == 1 && localStorage.getItem("presentation") !== null)
		$(".presentation input").eq(parseInt(localStorage.getItem("presentation"))).prop("checked", true);
	redeployer.call(".presentation input:checked");
	$(".presentation input").on({ "change": redeployer });



	function trier(crible) {
		var $t = $(this),
			$p = $t.parents("tr"),
			$c = $p.find("td"),
			c = $.map($c,function(zel) { return $(zel).clone(true); });
		c.sort(function(a,b) {
			return parseInt($(a).data(crible)) - parseInt($(b).data(crible));
		});
		$c.remove(); /* to do: detach() pour tous cas semblables ? */
		c.forEach(function(cel) {
			$(cel).appendTo($p);
		});
		$td = $("tbody td:not(:empty)");
		$ta.data("state", Date.now());
	}
	function lotir(crible) {
		retablir(true);
		$i2.prop("checked",false);
		this.prop("checked",true).each(function() {
			trier.call(this,crible);
	});	}
	$g.eq(0).on({
		change: function() {
			$intersection.val(-1);
			lotir.call($i0,"item");
	}	});
	$g.eq(1).on({
		change: function() {
			$intersection.val(-1);
			lotir.call($i1,"nombre");
	}	});




	function viser(crible,n) {
		var $c = $(this).parent().find("[type='checkbox']"),
			contingence = $c.is(":checked");
		$g.prop("checked",false);
		if (! contingence)
			retablir(true);
		trier.call(this,crible);
		if (contingence)
			return $c.trigger("change");
		$i.filter("[id$='" + n + "']:checked").length == l
			&& $g.eq(n).prop("checked",true);
	}
	$i0.on({
		change: function() {
			viser.call(this,"item",0);
	}	});
	$i1.on({
		change: function() {
			viser.call(this,"nombre",1);
	}	});






	function retablir(axe) {
		$(".axes, .secondaire, .absent, .visible").removeClass("axes secondaire absent visible");
		$tb.attr("class", "");
		axe && $(".axe").removeClass("axe");

		$(".present, .axe").each(function() {
			var $t = $(this),
				$ti = $t.find(":checked");
			trier.call($ti,$ti.attr("id").match(/0$/) ? "item" : "nombre");
			$t.removeClass("present");
	});	}
	function aligner(n) {
		var $extension = $(),
			opus = [];
		$ta.addClass("axes");
		$(".axe td:not(:empty)").addClass("secondaire");
		$("tbody tr:not(.axe)").addClass("absent");
		$(".axe:eq(0) .secondaire").each(function() {
			var $t = $(this),
				o = $t.data("nombre");
			var classe = $(".secondaire[data-nombre='" + o + "']");
			if (n == classe.length) {
				opus.push(o);
				classe.removeClass("secondaire");
				var reclasse = $(".absent [data-nombre='" + o + "']");
				reclasse.length > 0
					&& reclasse.addClass("visible")
					&& (classe = classe.add(reclasse));
				classe.each(function() {
					var $t = $(this),
						$c = $t.clone(true);
					$t.addClass("peremption");
					$c.data("alignement",$t.parent());
					$extension = $extension.add($c);
		});	}	});
		if (0 == opus.length)
			return;
		opus.sort(function(a,b) {
			return a - b;
		})
		$(".absent:has(.visible)").removeClass("absent").addClass("present");
		$(".peremption").remove();
		opus.forEach(function(zo,zi) {
			$extension.filter("[data-nombre='" + zo + "']").each(function() {
				var $t = $(this);
				if (0 == zi)
					$t.insertAfter($("th",$t.data("alignement")));
				else
					$t.insertAfter($t.data("alignement").find("td").eq(zi - 1));
				$t.removeData("alignement");
		});	});
		$td = $("tbody td:not(:empty)");
		$ta.data("state", Date.now());
	}
	$i2.on({
		change: function(e, select) {
			var $t = $(this),
				$p = $t.parents("tr");
			tempo = [];
			$g.prop("checked",false);
			retablir();
			if ($t.is(":checked"))
				$p.addClass("axe");
			else
				$p.removeClass("axe");
			var configuration = $(".axe").length;
			typeof select == "undefined"
			&& $intersection.val(-1);
			for (var i = configuration == 0 ? 0 : 2;i<3;i++) {
				if ($i.filter("[id$='" + i + "']:checked").length == l) {
					$g.eq(i).prop("checked",true);
					break;
			}	}
			switch (configuration) {
				case 0:
					return;
				case 1:
					var $p = $(".axe"),
						$selection = $("td:not(:empty)",$p),
						$extension = $();

					$tb.addClass("axe" + ($p.index() + 1));

					$selection.each(function(zi) {
						var $t = $(this),
							classe = $("[data-nombre='" + $t.data("nombre") + "']").not($t);
						classe.addClass("visible");
						0 == classe.length && $t.addClass("secondaire");
						classe.each(function() {
							var $t = $(this),
								$c = $t.clone(true);
							$c.data("alignement",[zi - 1,$t.parent()]);
							$extension = $extension.add($c);
					});	});
					$(".visible").remove();
					$extension.each(function() {
						var $t = $(this),
							item = parseInt($t.data("alignement")[0]);
						if (-1 == item)
							$t.insertAfter($("th",$t.data("alignement")[1]));
						else
							$t.insertAfter($t.data("alignement")[1].find("td").eq(item));
						$t.removeData("alignement");
					});
					$td = $("tbody td:not(:empty)");
					$ta.data("state", Date.now());
					$("tbody tr:not(:has(td.visible))").not($p).addClass("absent");
					$("tr:has(.visible)").addClass("present");
					break;
				case 2: //coordonner avec la boîte de sélection des intersections
					typeof select == "undefined"
					&& $("tbody :checkbox:checked").each(function () {
						tempo.push($(this).parents("tr").attr("id"));
					})
					&& (tempo = $("[value~=" + tempo[0] + "][value~=" + tempo[1] + "]"))
					&& tempo.length > 0
					&& $intersection.val(tempo.attr("value"));
				default:
					aligner(configuration);
	}	}	});
	$g.eq(2).on({
		change: function() {
			$i2.prop("checked",true);
			$("tbody tr").each(function() {
				var $t = $(this);
				$t.addClass("axe");
			});
			$i2.eq(0).trigger("change");
	}	});
	$g.eq(3).on({
		change: function() {
			$i2.prop("checked",false);
			$("tbody tr").each(function() {
				var $t = $(this);
				$t.removeClass("axe");
			});
			$i2.eq(0).trigger("change");
	} 	});

	return interfacter;
})();
