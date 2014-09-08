document.addEventListener('DOMContentLoaded', function() {
  var options_link = document.getElementById('options_link');
  options_link.addEventListener('click', function() {
    chrome.tabs.create({url: 'pages/options.html'});
  });
});
