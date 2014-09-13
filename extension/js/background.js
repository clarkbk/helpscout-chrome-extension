var setBadgeAppearance = function(count, max) {
  if (count !== 0 && !count) {
    chrome.browserAction.setBadgeText({text: '...'});
    chrome.browserAction.setBadgeBackgroundColor({color: '#666666'});
    return;
  }
  var h, hsv, rgba;
  h = count < max ? Math.round((max-count)/max*110) : 0;
  hsv = {h: h, s: 80, v: 75};
  rgba = _.values(tinycolor(hsv).toRgb());
  rgba[3] = Math.round(rgba[3]*255);

  chrome.browserAction.setBadgeText({text: count.toString()});
  chrome.browserAction.setBadgeBackgroundColor({color: rgba});
};

var updateBadgeAction = function(config) {
  chrome.browserAction.setPopup({'popup': ''});
  chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.create({
      url: "https://secure.helpscout.net/dashboard/"
    });
  });
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

var timer = null;
var startPolling = function(config) {
  updateBadgeAction(config);
  var apiUrl = 'https://api.helpscout.net/v1/';
  clearTimeout(timer);

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
        setBadgeAppearance(unassignedCount, config.color_threshold);
      }
    });
    timer = setTimeout(getUnreadCount, config.poll_interval*1000);
  })();
};

(function() {
  setBadgeAppearance();
  getApiConfig(function(config) {
    startPolling(config);
  });
})();
