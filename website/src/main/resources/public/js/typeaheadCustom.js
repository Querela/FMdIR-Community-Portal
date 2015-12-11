$(document).ready(function () {

// http://stackoverflow.com/questions/16442422/jquery-populate-select-from-json
// http://stackoverflow.com/questions/10689830/adding-a-dropdown-button-to-twitter-bootstrap-typeahead-component

$.ajax({
  url: "js/map-lng.json",
  dataType: "json",
  success: function(languages) {
    var itemsS = "";
    $.each(languages, function(key, value) {
      itemsS += '<option value="' + key + '">' + value + '</option>'
    });
    $("#langChooser").append(itemsS);

    $("#langChooser").combobox();
  },
  error: function(jqXHR, textStatus, errorThrown) {
    console.log('ERROR', textStatus, errorThrown);
    alert("Couldn't load languages!");
  }
});
    
});