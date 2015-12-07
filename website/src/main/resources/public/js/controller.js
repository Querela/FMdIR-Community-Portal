/*
 * This Coltroller.js file control whole website work flow
 *
 * Copyright (c) 2016 http://wortschatz.uni-leipzig.de/
 * Copyright (c) 2016 Immanuel Plath
 * Copyright (c) 2016 Erik Körner
 */
 
$(document).ready(function () {
	// inti website
	// ================================================
	// workaround if browser not detect that buttons are disabled
	$('#thirdStep').attr( 'disabled', 'disabled');
	$('#secondStep').attr( 'disabled', 'disabled');
	$('#firstStep').attr( 'disabled', 'disabled');
		
	// Global Variables
	// ================================================
	var activeSubmitt = false;
	
	// Click Events
	// ================================================
	$('#firstStep').click(function () {
		$("#intro").slideUp();
	});
	
	$('#secondStep').click(function () {
		if( ! activeSubmitt ) {
			activeSubmitt = true;
			performStepOne();
		}
	});
	
	$('#menuAddLinks').click(function () {
		$("#yourResults").slideUp();
		$("#intro").slideUp();
		$(".wizard").slideDown();
	});
	
	$('#menuResults').click(function () {
		$("#intro").slideUp();
		$(".wizard").slideUp();
		$("#results").hide();
		$("#formResults").val('');
		$("#yourResults").slideDown();
	});
	
	$('#logoLink').click(function () {
		$("#intro").slideDown();
	});
	
	$('#linkToResults').click(function () {
		$("#intro").slideUp();
		$(".wizard").slideUp();
		$("#yourResults").slideDown();
		$("#formResults").val( $("#ticket").val() );
	});
	
	$('#sendToken').click(function () {
		sendTicketID();
	});
	
	$('#restart').click(function () {
		$('.wizard .nav-tabs li').addClass('disabled').removeClass('active');
		$('#firstTab').removeClass('disabled').addClass('active');
		$('#complete').removeClass('active');
		$('#step1').addClass('active');
		$("#langChooser").val('');
		$("#urlField").val('');
		$("#ticket").val('');
		$('#urlList').html('');
		$('#errorInfo').hide();
		$('#thirdStep').attr( 'disabled', 'disabled');
		$('#secondStep').attr( 'disabled', 'disabled');
		$('#firstStep').attr( 'disabled', 'disabled');
		activeSubmitt = false;
	});
	
	$('#langChooser').on('input', function() {
		checkLang();
	});
	
	$('#urlField').on('input', function() {
		checkUrlField();
	});
	
	// Functions
	// ================================================
	
	// function to check if a language is selected
	function checkLang() {
		var text = $("#langChooser").val();
		if(text.length == 0){
			$("#firstStep").attr( 'disabled', 'disabled');
		} else {
			$("#firstStep").removeAttr('disabled');
		}
	}
	
	// function to check if url field contains url's and not more than 1000 urls
	function checkUrlField() {
		var text = $("#urlField").val();
		var lines = text.split('\n').length;
		$("#numberUrls").html(lines);
		if(text.length == 0){
			$("#secondStep").attr( 'disabled', 'disabled');
		} else {
			$("#secondStep").removeAttr('disabled');
		}
		if( lines > 1000 ) {
			$("#numberUrls").css('color', 'red');
			$("#secondStep").attr( 'disabled', 'disabled');
		} else {
			$("#numberUrls").css('color', '');
			$("#secondStep").removeAttr('disabled');
		}
	}
	
	// this function perform first step of transmitting data (clear old sessions)
	function performStepOne() {
		// hide warning field
		$('#errorInfo').hide();
		// reset progressbar
		$('.progress-bar').css('width', 0+'%').attr('aria-valuenow', 0);
		// read url inputfield
		var processItems = $('#urlField').val().split('\n').length + 3;
		var process = 0;
		// clear session
		$('#proecssText').attr('placeholder', 'Reseting old session ... [Progress: ' + process + '%]');
		$('.progress-bar').css('width', process+'%').attr('aria-valuenow', process);
		$.get( "/api/clearsession", function( data ) {
			if( ( data.sessionState.localeCompare( "empty" ) == 0 ) || ( data.sessionState.localeCompare( "cleared" ) == 0 ) ) {
				performStepTwo( processItems );
			} else {
				$('#errorInfoText').html('Failed to clear session!');
				$('#errorInfo').show();
			}
		});
	}
	
	// this function perform second step of transmitting data (start new sessions)
	function performStepTwo( processItems ) {
		// start new session
		var process = Math.round( 2 / processItems * 100 );
		$('#proecssText').attr('placeholder', 'Set up a new session ... [Progress: ' + process + '%]');
		$('.progress-bar').css('width', process+'%').attr('aria-valuenow', process);
		$.get( "/api/startSession", function( data ) {
			if( data.sessionState.localeCompare( "started" ) == 0 ) {
				performStepThree( processItems );
			} else {
				$('#errorInfoText').html('Failed to start new session!');
				$('#errorInfo').show();
			}
		});
		
	}
	
	// this function perform third step of transmitting data (send destination language to server)
	function performStepThree( processItems ) {
		// set language of provide urls
		var process = Math.round( 3 / processItems * 100 );
		$('#proecssText').attr('placeholder', 'Sending url language to server ... [Progress: ' + process + '%]');
		$('.progress-bar').css('width', process+'%').attr('aria-valuenow', process);
		var lang = $("#langChooser").val();
		$.post("/api/addlanguage", {
				language: lang,
			},
			function (data, status) {
				//console.log(data.uploadState);
				if (data.uploadState == 'ok' ) {
					performStepFour( processItems );
                } else {
					$('#errorInfoText').html('Failed to send choosen language to server!');
					$('#errorInfo').show();
                }
        });
	}
	
	// this function perform fourth step of transmitting data (send urls to server)
	function performStepFour( processItems ) {
		// sending urls
		var process = 0;
		var lines = $('#urlField').val().split('\n');
		if ( lines.length > 0 ) {
			for( var i = 0;i < lines.length;i++ ){
				process = Math.round( (i+3) / processItems * 100 );
				if( i == (lines.length-1) ) {
					sendURL( lines[i].trim(), process, processItems, true );
				} else {
					sendURL( lines[i].trim(), process, processItems, false );
				}
			}
		} else {
			$('#errorInfoText').html('Faild to find provided URL\'s!');
			$('#errorInfo').show();
		}
	}
	
	// this function send a url to webserver and add answer to dom
	function sendURL(url, process, processItems, lastItem) {
		$.post("/api/addurl", {
				url: url,
			},
			function (data, status) {
				if( lastItem ){
					$('#proecssText').attr('placeholder', 'Finished! Please click "Continue" Button! [Progress: 100%]');
					$('.progress-bar').css('width', 100+'%').attr('aria-valuenow', 100);
					// get user ticket for last step
					getTicket();
					// activate last step
					$("#thirdStep").removeAttr('disabled');
				} else {
					if ( process > $('.progress-bar').attr('aria-valuenow') ) {
						$('#proecssText').attr('placeholder', 'Uploading URL: ' + url + ' [Progress: ' + process + '%]');
						$('.progress-bar').css('width', process+'%').attr('aria-valuenow', process);
					}
				}
				if ( data.uploadState == 'ok' ) {
					addUrlOK( url );
                } else if ( data.uploadState == 'alreadyExist' ) {
					addUrlWarning( url );
                } else {
					addUrlError( url );
				}
        });
	}
	
	// this function request a ticket from server (ticket to request crawling state of submmitted urls)
	function getTicket() {
		$.get( "/api/getticket", function( data ) {
			if( data.ticketid.length > 0 ) {
				$("#ticket").val( data.ticketid );
			} else {
				//show warning;
			}
		});
	}
	
	// this function send a ticket to server and request crawling state of urls belong to ticket 
	function sendTicketID() {
		var ticketID = $("#formResults").val();
		$("#intro").slideUp();
		$(".wizard").slideUp();
		$("#yourResults").slideUp();
		$.post("/api/getresult", {
				ticket: ticketID,
			},
			function (data, status) {
				if ( data.result == 'ready' ) {
					$("#results").slideDown();
					$("#resultWait").hide();
					$("#resultReady").show();
                } else {
					$("#results").slideDown();
					$("#resultReady").hide();
					$("#resultWait").show();
				}
        });
	}
	
	// this function add url result to dom
	function addUrlOK( url ) {
		var html = '<div class="form-group has-success has-feedback"><div class="input-group"><span class="input-group-addon"><span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span></span><input type="text" class="form-control" id="inputGroupSuccess1" aria-describedby="inputGroupSuccess1Status" value="' + url + '"></div><span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span><span id="inputGroupSuccess1Status" class="sr-only">(success)</span></div>';
		$('#urlList').append( html );
		$('#urlList').i18n();
	}
	
	// this function add url result to dom
	function addUrlWarning( url ) {
		var html = '<div class="form-group has-warning has-feedback"><label class="control-label" for="inputWarning2" data-i18n="wizard.stepThree.warning"></label><div class="input-group"><span class="input-group-addon"><span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span></span><input type="text" class="form-control" id="inputWarning2" aria-describedby="inputWarning2Status" value="' + url + '"></div><span class="glyphicon glyphicon-warning-sign form-control-feedback" aria-hidden="true"></span><span id="inputWarning2Status" class="sr-only">(warning)</span></div>';
		$('#urlList').append( html );
		$('#urlList').i18n();
	}
	
	// this function add url result to dom
	function addUrlError( url ) {
		var html = '<div class="form-group has-error has-feedback"><label class="control-label" for="inputError2" data-i18n="wizard.stepThree.error"></label><div class="input-group"><span class="input-group-addon"><span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span></span><input type="text" class="form-control" id="inputError2" aria-describedby="inputError2Status" value="' + url + '"></div><span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span><span id="inputError2Status" class="sr-only">(error)</span></div>';
		$('#urlList').append( html );
		$('#urlList').i18n();
	}

});