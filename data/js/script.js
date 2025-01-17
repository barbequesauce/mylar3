function initHeader() {
	//settings
	var header = $("#container header");
	var fadeSpeed = 100, fadeTo = 0.5, topDistance = 20;
	var topbarME = function() { $(header).fadeTo(fadeSpeed,1); }, topbarML = function() { $(header).fadeTo(fadeSpeed,fadeTo); };
	var inside = false;
	//do
	$(window).scroll(function() {
		position = $(window).scrollTop();
		if(position > topDistance && !inside) {
			//add events
			topbarML();
			$(header).bind('mouseenter',topbarME);
			$(header).bind('mouseleave',topbarML);
			$("#toTop").fadeIn();
			inside = true;
		}
		else if (position < topDistance){
			topbarME();
			$(header).unbind('mouseenter',topbarME);
			$(header).unbind('mouseleave',topbarML);
			$("#toTop").fadeOut();
			inside = false;
		}
	});
}

function initConfigCheckbox(elem) {
	var config = $(elem).parent().next();
	if ( $(elem).is(":checked") ) {
		config.show();
	} else {
		config.hide();
	}
	$(elem).click(function(){
		var config = $(this).parent().next();
		if ( $(this).is(":checked") ) {
			config.slideDown();
		} else {
			config.slideUp();
		}
	});
}
function initActions() {
    $("#subhead_menu #menu_link_searchmissing").button({ icons: { primary: "ui-icon-circle-zoomout" }  });
    $("#subhead_menu #menu_link_recheck").button({ icons: { primary: "ui-icon-circle-check" }  });
    $("#subhead_menu #menu_link_manualmeta").button({ icons: { primary: "ui-icon-info" }  });
    $("#subhead_menu #menu_link_prevrename").button({ icons: { primary: "ui-icon-image" }  });
    $("#subhead_menu #menu_link_rename").button({ icons: { primary: "ui-icon-transfer-e-w" }  });
    $("#subhead_menu #menu_link_refresh").button({ icons: { primary: "ui-icon-refresh" }  });
    $("#pub_button").button({ icons: { primary: "ui-icon-check" }  });
    $("#btn_menu #menu_link_refresh").button({ icons: { primary: "ui-icon-pencil" }  });
    $("#subhead_menu #menu_link_edit").button({ icons: { primary: "ui-icon-pencil" }  });
    $("#btn_menu #menu_link_edit").button({ icons: { primary: "ui-icon-refesh" }  });
    $("#btn_notifs #menu_link_always").button({ icons: { primary: "ui-icon-refesh" }  });
    $("#btn_notifs #menu_link_edit").button({ icons: { primary: "ui-icon-refesh" }  });
    $("#subhead_menu #menu_link_delete" ).button({ icons: { primary: "ui-icon-trash" } });
    $("#subhead_menu #menu_link_pauze").button({ icons: { primary: "ui-icon-pause"} });
    $("#subhead_menu #menu_link_resume").button({ icons: { primary: "ui-icon-play"} });
    $("#subhead_menu #menu_link_getextra").button({ icons: { primary: "ui-icon-plus"} });
    $("#subhead_menu #menu_link_removeextra").button({ icons: { primary: "ui-icon-minus" } });
    $("#subhead_menu #menu_link_wanted" ).button({ icons: { primary: "ui-icon-heart" } });
    $("#subhead_menu #menu_link_check").button({ icons: { primary: "ui-icon-arrowrefresh-1-w"} });
    $("#subhead_menu #menu_link_skipped").button({ icons: { primary: "ui-icon-seek-end"} });
    $("#subhead_menu #menu_link_retry").button({ icons: { primary: "ui-icon-arrowrefresh-1-e"} });
    $("#subhead_menu #menu_link_new").button({ icons: { primary: "ui-icon-arrowreturnthick-1-s" } });
    $("#subhead_menu #menu_link_shutdown").button({ icons: { primary: "ui-icon-power"} });
    $("#subhead_menu #menu_link_carepackage").button({ icons: { primary: "ui-icon-heart"} });
    $("#subhead_menu #menu_link_scan").button({ icons: { primary: "ui-icon-search"} });
    $("#subhead_menu #menu_link_addalltoRL").button({ icons: { primary: "ui-icon-plus"} });
}

function refreshSubmenu() {
	var url = $(location).attr('href');
	$("#subhead_container").load(url + " #subhead_menu",function(){
		initActions();
	});
}
function refreshTable() {
	var url =  $(location).attr('href');
	$("table.display").load(url + " table.display tbody, table.display thead", function() {
		initThisPage();
	});
}
function refreshTab() {
        var url =  $(location).attr('href');
        var tabId = $('.ui-tabs-panel:visible').attr("id");
        $('.ui-tabs-panel:visible').load(url + " #"+ tabId, function() {
                initThisPage();
        });
}
function refreshLoadSeries() {
	if ( $(".gradeL").length > 0 ) {
		var url =  $(location).attr('href');
		var loadingRow = $("table.display tr.gradeL")
		loadingRow.each(function(){
			var row = $(this).index() + 1;
			var rowLoad = $("table.display tbody tr:nth-child("+row+")");
			$(rowLoad).load(url + " table.display tbody tr:nth-child("+ row +") td", function() {
				if ( $(rowLoad).children("#status").text() == 'Active'  ) {
					// Active
					$(rowLoad).removeClass('gradeL').addClass('gradeZ');
					initThisPage();
				} else {
					// Still loading
					setTimeout(function(){
						refreshLoadSeries();
					},3000);
				}
			});
		});
	}
}

function showMsg(msg,loader,timeout,ms) {
	var feedback = $("#ajaxMsg");
	update = $("#updatebar");
	if ( update.is(":visible") ) {
		var height = update.height() + 35;
		feedback.css("bottom",height + "px");
	} else {
		feedback.removeAttr("style");
	}
	feedback.fadeIn();
	var message = $("<div class='msg'>" + msg + "</div>");
	if (loader) {
		var message = $("<div class='msg'><img src='images/loader_black.gif' alt='loading' class='loader' style='position: relative;top:10px;margin-top:-15px; margin-left:-10px;'/>" + msg + "</div>");
		feedback.css("padding","14px 10px")
	}
	$(feedback).prepend(message);
	if (timeout) {
		setTimeout(function(){
			message.fadeOut(function(){
				$(this).remove();
				feedback.fadeOut();
			});
		},ms);
	}
}

function doAjaxCall(url,elem,reload,form) {
	// Set Message
	feedback = $("#ajaxMsg");
	update = $("#updatebar");
	if ( update.is(":visible") ) {
		var height = update.height() + 35;
		feedback.css("bottom",height + "px");
	} else {
		feedback.removeAttr("style");
	}

	feedback.fadeIn();
	// Get Form data
	var formID = "#"+url;
	if ( form == true ) {
		var dataString = $(formID).serialize();
	}
	// Loader Image
	var loader = $("<img src='images/loader_black.gif' alt='loading' class='loader'/>");
	// Data Success Message
	var dataSucces = $(elem).data('success');
	if (typeof dataSucces === "undefined") {
		// Standard Message when variable is not set
		var dataSucces = "Success!";
	}
	// Data Errror Message
	var dataError = $(elem).data('error');
	if (typeof dataError === "undefined") {
		// Standard Message when variable is not set
		var dataError = "There was a error";
	}
	// Get Success & Error message from inline data, else use standard message
	var succesMsg = $("<div class='msg'><span class='ui-icon ui-icon-check'></span>" + dataSucces + "</div>");
	var errorMsg = $("<div class='msg'><span class='ui-icon ui-icon-alert'></span>" + dataError + "</div>");

	// Check if checkbox is selected
	if ( form ) {
		if ( $('td#select input[type=checkbox]').length > 0 && !$('td#select input[type=checkbox]').is(':checked') ) {
			feedback.addClass('error')
			$(feedback).prepend(errorMsg);
			setTimeout(function(){
				errorMsg.fadeOut(function(){
					$(this).remove();
					feedback.fadeOut(function(){
						feedback.removeClass('error');
					});
				})
				$(formID + " select").children('option[disabled=disabled]').attr('selected','selected');
			},2000);
			return false;
		}
	}

	// Ajax Call
	$.ajax({
	  url: url,
	  data: dataString,
	  beforeSend: function(jqXHR, settings) {
	  	// Start loader etc.
	  	feedback.prepend(loader);
	  },
	  error: function(jqXHR, textStatus, errorThrown)  {
	  	feedback.addClass('error')
	  	feedback.prepend(errorMsg);
	  	setTimeout(function(){
	  		errorMsg.fadeOut(function(){
	  			$(this).remove();
	  			feedback.fadeOut(function(){
	  				feedback.removeClass('error')
	  			});
	  		})
	  	},2000);
	  },
	  success: function(data,jqXHR) {
	  	feedback.prepend(succesMsg);
	  	feedback.addClass('success')
	  	setTimeout(function(e){
	  		succesMsg.fadeOut(function(){
	  			$(this).remove();
	  			feedback.fadeOut(function(){
	  				feedback.removeClass('success');
	  			});
	  			if ( reload == true ) 	refreshSubmenu();
	  			if ( reload == "table") {
	  				console.log('refresh'); refreshTable();
	  			}
	  			if ( reload == "tabs") 	refreshTab();
	  			if ( form ) {
	  				// Change the option to 'choose...'
	  				$(formID + " select").children('option[disabled=disabled]').attr('selected','selected');
	  			}
	  		})
	  	},2000);
	  },
	  complete: function(jqXHR, textStatus) {
	  	// Remove loaders and stuff, ajax request is complete!
	  	loader.remove();
	  }
	});
}

function resetFilters(text){
	if ( $(".dataTables_filter").length > 0 ) {
		$(".dataTables_filter input").attr("placeholder","filter " + text + "");
	}
}

function preventDefault(){
	$("a[href='#']").live('click', function(){
		return false;
	});
}

function initFancybox() {
	if ( $("a[rel=dialog]").length > 0 ) {
		$.getScript('js/fancybox/jquery.fancybox-1.3.4.js', function() {
			$("head").append("<link rel='stylesheet' href='js/fancybox/jquery.fancybox-1.3.4.css'>");
	 		$("a[rel=dialog]").fancybox();
	 	});
	 }
}

function init() {
	initHeader();
	preventDefault();
}

$(document).ready(function(){
	init();
});
