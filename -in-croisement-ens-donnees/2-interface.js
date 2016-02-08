;var interfacter = (function interfacter () {
	"use strict";

/* code août 2014, procédural
	révision skin en 2015f
	analyse des données 2015-2016

	FONCTIONNALITES

	to do : analyse des croisements les plus riches entre deux tableaux
		comme un bouton cliquable plus que comme une analyse

	to do : analyse du croisement minimal entre tous les tableaux
		comme un bouton cliquable plus que comme une analyse

	to do : avec d'autres données que numériques

	ACCESSIBILITÉ

	to do : couche ARIA ?

	to do : tester Voice Over ou NVDA : .on("keyup",
		cf. this.$lien.on("mouseover keyup", Visu.passer);

	COMPATIBILITÉ

	to do : tests sur MSIE

	DÉVELOPPEMENT

	to do : reprendre en orientation prototypale, ou orienté objet ES6 ?
		- evenements.js OK

	to do : $c.remove(); //to do: detach() pour tous cas semblables ?

	PRESENTATION

	to do : effets de transition (notamment sur Chrome ?)

*/


	if (! conditions) //cf. 1-analyse-donnees.js
		return;


	var collection = cles, //cf. 1-analyse-donnees.js
		listes = [],
		longueur = 0,
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
		ordres = ["Ordre d'origine&nbsp;:", "Ordre numérique&nbsp;:", "Tout sélectionner&nbsp;:", "|| Tout désélectionner&nbsp;:"],
		charge = [$("table")]; //n'existe pas au chargement donc n'a pas de .length


	! charge[0].length //au chargement
	&& $f.get(0).reset();



	//placer en-têtes les séries aux surfaces d'extension les plus riches
	collection.sort(function (a, b) { return extensions[b] - extensions[a]; });


	$("#titre").html(informations.titre);
	charge[charge[0].length] = charge[0].hasClass("colonne"); //au chargement : length == 0 ; nouvelles données : length == 1
	$("table").remove();
	$(".presentation input").off(); //cf. commentaire début de evenements.js


	for (var i=0,l=collection.length;i<l;++i) {
		listes.push($.map(datas[collection[i]],function(zel) { return zel; }));
		listes[i].unshift(listes[i].pop());
		longueur = listes[i].length > longueur ? listes[i].length : longueur;
	}
	for (var i=0;i<l;++i) {
		code.push('<tr id="' + collection[i] + '"><th scope="row">'
			+ manu[0] + i + manu[1] + i + 0 + manu[8] + 0 + manu[2]
			+ manu[0] + i + manu[1] + i + 1 + manu[8] + 1 + manu[3]
			+ manu[4] + i + 2 + manu[3]
			+ '<label for="' + manu[7] + i + 2 + '" class="nb" title="' + extensions[collection[i]] + ' valeurs partagées pour ' + listes[i][0] + '">' + extensions[collection[i]] + "</label>"
			+ '<br><label class="label" for="' + manu[7] + i + 2 + '">' + listes[i][0] + "</label>");
		for (var i2=1;i2<longueur;++i2){
			code.push('<td data-item="' + i2 + '" data-nombre="' + (listes[i][i2] || 100000000000) + '">' + (listes[i][i2] || "") + "</td>");
		}
		code.push("</tr>");
	}
	code.push("</tbody>");
	code.unshift('<thead><tr><td colspan="' + longueur + '"> '
		+ '<label for="croiser" class="croiser">Amplitudes extrêmes : </label>'
		+ '<select id="croiser"><option value="-1">… … … …</option></select>'
		+ manu[5] + 90 + manu[3] + ordres[0] + manu[6]
		+ manu[0] + 9 + manu[1] + 90 + manu[8] + 0 + manu[2]
		+ manu[5] + 91 + manu[3] + ordres[1] + manu[6]
		+ manu[0] + 9 + manu[1] + 91 + manu[8] + 1 +  manu[3]
		+ manu[5] + 92 + manu[3] + ordres[2] + manu[6]
		+ manu[0] + 9 + manu[1] + 92 + manu[8] + 2 +  manu[3]
		+ manu[5] + 93 + manu[3] + ordres[3] + manu[6]
		+ manu[0] + 9 + manu[1] + 93 + manu[8] + 3 +  manu[3]
		+ "</td></tr></thead>");

	$ta = $("<table>", {
		data: { width : [12 + longueur * 4, l * 7], state: Date.now() },
		class: charge.slice(-1)[0] == true ? "colonne" : "",
		html: code.join("")}
	)
	.appendTo($f.addClass("settled"));

	$("header, form").css("width", 12 + longueur * 4 > 65 ? (12 + longueur * 4 < 80 ? 12 + longueur * 4 + "em" : "80em") : "65em");
	$b.removeClass("prinit");


/*
	à la fin de 1-analyse-donnees.js :
		$meta.html(code.join(""));
		$(".typeTab1").text(typeTab[0]); etc.

*/


	var $ta = $("table"),
		$tb = $("tbody"),
		$td = $("tbody td:not(:empty)"),
		$g = $("[colspan] input"),
		$i = $("tbody input"),
		$i0 = $i.filter("[id$='0']"),
		$i1 = $i.filter("[id$='1']"),
		$i2 = $i.filter("[id$='2']"),
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
			$ta = $("table"); //(?)
		if (choix == "pres1")
			$ta.removeClass("colonne").css("width",$ta.data("width")[0] + "em");
		else
			$ta.addClass("colonne").css("width",$ta.data("width")[1] + "em");
		$td.each(function(zi) {
			var $t = $(this);
			$t.css("box-shadow",$t.data(choix));
	});	}
	if (charge.length == 2 || localStorage.length == 0 || localStorage.getItem("presentation") === null || localStorage.getItem("presentation") == "0")
		redeployer.call("[type='radio']:checked:eq(0)");
	$(".presentation input").on({ "change": redeployer });



	function trier(crible) {
		var $t = $(this),
			$p = $t.parents("tr"),
			$c = $p.find("td"),
			c = $.map($c,function(zel) { return $(zel).clone(true); });
		c.sort(function(a,b) {
			return parseInt($(a).data(crible)) - parseInt($(b).data(crible));
		});
		$c.remove(); //to do: detach() pour tous cas semblables ?
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
			lotir.call($i0,"item");
	}	});
	$g.eq(1).on({
		change: function() {
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
		change: function() {
			var $t = $(this),
				$p = $t.parents("tr");
			$g.prop("checked",false);
			retablir();
			if ($t.is(":checked"))
				$p.addClass("axe");
			else
				$p.removeClass("axe");
			var configuration = $(".axe").length;
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
