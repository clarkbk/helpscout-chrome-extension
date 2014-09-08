var setBadgeAppearance = function(count) {
  if (!count) {
    chrome.browserAction.setBadgeText({text: '...'});
    chrome.browserAction.setBadgeBackgroundColor({color: '#666666'});
    return;
  }

  var max, h, hsv, rgba;
  max = 150;
  h = count < max ? Math.round((max-count)/max*110) : 0;
  hsv = {h: h, s: 80, v: 75};
  rgba = _.values(tinycolor(hsv).toRgb());
  rgba[3] = Math.round(rgba[3]*255);

  chrome.browserAction.setBadgeText({text: count.toString()});
  chrome.browserAction.setBadgeBackgroundColor({color: rgba});
};

var getApiConfig = function(callback) {
  chrome.storage.sync.get('config', function(data) {
    if (!_.isEmpty(data)) {
      callback(data.config);
    }
  });
};

var createRequest = function(apiKey) {
  var apiAuth = 'Basic ' + Base64.encode(apiKey + ':X');
  var headers = {
    'Authorization': apiAuth,
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  return {
    'headers': headers,
    'baseUrl': 'https://api.helpscout.net/v1/'
  };
};

var startPolling = function(config) {
  var apiUrl = 'https://api.helpscout.net/v1/';

  (function getUnreadCount() {
    var request = createRequest(config.api_key);
    var endpoint = request.baseUrl + 'mailboxes/' + JSON.parse(config.mailbox).id + '/folders.json';

    $.ajax({
      url: endpoint,
      headers: request.headers,
      dataType: "json",
      success: function(data) {
        var unassigned = _.find(data.items, {'type': 'open'});
        var unassignedCount = unassigned.activeCount;
        setBadgeAppearance(unassignedCount);
      }
    });
    setTimeout(getUnreadCount, 60000);
  })();
};

(function() {
  setBadgeAppearance();
  getApiConfig(function(config) {
    startPolling(config);
  });
})();
