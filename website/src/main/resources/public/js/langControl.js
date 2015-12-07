$(document).ready(function () {
    //Initialize language default english
    var options ={
		lng: "en" ,
		resGetPath: 'locales/en/translation.json'
	};
	
	i18n.init(options, function(t) {
		$(".navbar").i18n();
        $(".container").i18n();
		//Re-Initialize tooltips
		$('.nav-tabs > li a[title]').tooltip();
	});
	
	$('#german').click(function () {
		options.lng = "de";
		options.resGetPath = 'locales/de/translation.json';
		i18n.init(options, function(t) {
           $(".navbar").i18n();
           $(".container").i18n();
		});
	});
	
	$('#english').click(function () {
		options.lng = "en";
		options.resGetPath = 'locales/en/translation.json';
		i18n.init(options, function(t) {
           $(".navbar").i18n();
           $(".container").i18n();
		});
	});
});