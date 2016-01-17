;var $f = $("form"),

	interfacter = (function interfacter () {
	"use strict";

/* code août 2014, procédural
	révision skin en 2015

	to do : ARIA

	to do : reprendre en orientation prototypale, ou orienté objet ES6 ?

*/


	if (! Array.prototype.forEach)
		return;

	var collection = cles, //cf. analyse-donnees.js
		listes = [],
		longueur = 0,
		code = [],
		manu = [
			'<input type="radio" name="liste',
			'" id="liste',
			'" checked>',
			'">',
			'<input type="checkbox" name="commun" id="commun',
			'<label for="liste',
			'</label>',
			'commun'
		],
		ordres = ["Ordre d'origine :", "Ordre numérique :", "Tout sélectionner :", "|| Tout désélectionner :"];


	$("#titre").html(informations.titre);
	$("table").remove();
	$(".interaction > input").off();


	for (var i=0,l=collection.length;i<l;++i) {
		listes.push($.map(datas[collection[i]],function(zel) { return zel; }));
		listes[i].unshift(listes[i].pop());
		longueur = listes[i].length > longueur ? listes[i].length : longueur;
	}
	for (var i=0;i<l;++i) {
		code.push('<tr><th scope="row">'
			+ manu[0] + i + manu[1] + i + 0 + manu[2]
			+ manu[0] + i + manu[1] + i + 1 + manu[3]
			+ manu[4] + i + 2 + manu[3]
			+ '<br><label for="' + manu[7] + i + 2 + '">' + listes[i][0] + "</label>");
		for (var i2=1;i2<longueur;++i2){
			code.push('<td data-item="' + i2 + '" data-oeuvre="' + (listes[i][i2] || 100000000000) + '">' + (listes[i][i2] || "") + "</td>");
		}
		code.push("</tr>");
	}
	code.unshift('<tr><td colspan="' + longueur + '"> '
		+ manu[5] + 90 + manu[3] + ordres[0] + manu[6]
		+ manu[0] + 9 + manu[1] + 90 + manu[2]
		+ manu[5] + 91 + manu[3] + ordres[1] + manu[6]
		+ manu[0] + 9 + manu[1] + 91 + manu[3]
		+ manu[5] + 92 + manu[3] + ordres[2] + manu[6]
		+ manu[0] + 9 + manu[1] + 92 + manu[3]
		+ manu[5] + 93 + manu[3] + ordres[3] + manu[6]
		+ manu[0] + 9 + manu[1] + 93 + manu[3]
		+ "</td></tr>");
	$("<table>", { data : { width : [12 + longueur * 4,l * 7] }, html : code.join("")})
	.appendTo($f.addClass("settled"));


/*
	à la fin de analyse-donnees.js :
		$meta.html(code.join(""));
		$(".typeTab1").text(typeTab[0]); etc.

*/


	var $ta = $("table"),
		$td = $("tr + tr td:not(:empty)"),
		$g = $("[colspan] input"),
		$i = $("tr + tr input"),
		$i0 = $i.filter("[id$='0']"),
		$i1 = $i.filter("[id$='1']"),
		$i2 = $i.filter("[id$='2']"),
		bordures = ["3.3em 0 #FFF inset, ","5.95em 0 #FFF inset, "],
		bordures = ["",""];
	$td.each(function(i) {
		var $t = $(this);
		if ($t.data("pres1"))
			return;
		var cellules = $($("[data-oeuvre='" + $t.data("oeuvre") + "']").get().reverse()),
			styles = "";
		cellules.each(function() {
			styles += $(this).css("box-shadow") + ", ";
		});
		styles = styles.slice(0,-2);
		cellules.each(function() {
			$(this).data("pres1",bordures[0] + styles).data("pres2",bordures[1] + styles);
	});	});

	function redeployer() {
		var choix = $(this).attr("id");
		if (choix == "pres1")
			$ta.removeClass("colonne").css("width",$ta.data("width")[0] + "em");
		else
			$ta.addClass("colonne").css("width",$ta.data("width")[1] + "em");
		$td.each(function(zi) {
			var $t = $(this);
			$t.css("box-shadow",$t.data(choix));
	});	}
	redeployer.call("[type='radio']:checked:eq(0)");
	$(".interaction > input").on({
		change: redeployer
	});



	function trier(crible) {
		var $t = $(this),
			$p = $t.parents("tr"),
			$c = $p.find("td"),
			c = $.map($c,function(zel) { return $(zel).clone(true); });
		c.sort(function(a,b) {
			return parseInt($(a).data(crible)) - parseInt($(b).data(crible));
		});
		$c.remove();
		c.forEach(function(cel) {
			$(cel).appendTo($p);
		});
		$td = $("tr + tr td:not(:empty)");
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
			lotir.call($i1,"oeuvre");
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
			viser.call(this,"oeuvre",1);
	}	});






	function retablir(axe) {
		$(".axes, .secondaire, .absent, .visible").removeClass("axes secondaire absent visible");
		axe && $(".axe").removeClass("axe");

		$(".present, .axe").each(function() {
			var $t = $(this),
				$ti = $t.find(":checked");
			trier.call($ti,$ti.attr("id").match(/0$/) ? "item" : "oeuvre");
			$t.removeClass("present");
	});	}
	function aligner(n) {
		var $extension = $(),
			opus = [];
		$ta.addClass("axes");
		$(".axe td:not(:empty)").addClass("secondaire");
		$("tr + tr:not(.axe)").addClass("absent");
		$(".axe:eq(0) .secondaire").each(function() {
			var $t = $(this),
				o = $t.data("oeuvre");
			var classe = $(".secondaire[data-oeuvre='" + o + "']");
			if (n == classe.length) {
				opus.push(o);
				classe.removeClass("secondaire");
				var reclasse = $(".absent [data-oeuvre='" + o + "']");
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
			$extension.filter("[data-oeuvre='" + zo + "']").each(function() {
				var $t = $(this);
				if (0 == zi)
					$t.insertAfter($("th",$t.data("alignement")));
				else
					$t.insertAfter($t.data("alignement").find("td").eq(zi - 1));
				$t.removeData("alignement");
		});	});
		$td = $("tr + tr td:not(:empty)");
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
					$selection.each(function(zi) {
						var $t = $(this),
							classe = $("[data-oeuvre='" + $t.data("oeuvre") + "']").not($t);
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
					$td = $("tr + tr td:not(:empty)");
					$("tr + tr:not(:has(td.visible))").not($p).addClass("absent");
					$("tr:has(.visible)").addClass("present");
					break;
				default:
					aligner(configuration);
	}	}	});
	$g.eq(2).on({
		change: function() {
			$i2.prop("checked",true);
			$("tr + tr").each(function() {
				var $t = $(this);
				$t.addClass("axe");
			});
			$i2.eq(0).trigger("change");
	}	});
	$g.eq(3).on({
		change: function() {
			$i2.prop("checked",false);
			$("tr + tr").each(function() {
				var $t = $(this);
				$t.removeClass("axe");
			});
			$i2.eq(0).trigger("change");
	} 	});

	return interfacter;
})();
