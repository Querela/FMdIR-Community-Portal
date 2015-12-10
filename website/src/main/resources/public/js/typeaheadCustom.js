$(document).ready(function () {
var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });

    cb(matches);
  };
};

// http://stackoverflow.com/questions/16442422/jquery-populate-select-from-json
// http://stackoverflow.com/questions/10689830/adding-a-dropdown-button-to-twitter-bootstrap-typeahead-component

var states = ['English', 'Spanish', 'German', 'French', 'Italian ',
  'Russian', 'Dari', 'Kimbundu', 'Rangpuri', 'Bouyei', 'Nuosu',
  'Idaho', 'Kabyle', 'Kimbundu', 'Bengali', 'Kituba', 'Alur', 'Koongo'
];

var typeahead = $('#the-basics .typeahead').typeahead({
  hint: true,
  highlight: true,
  minLength: 0
},
{
  name: 'states',
  source: substringMatcher(states)
});
// typeahead.data('typeahead', typeahead);
    
});