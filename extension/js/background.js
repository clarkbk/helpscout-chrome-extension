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

var openMailboxUrl = function(config, folderId) {
  chrome.storage.sync.get(['config', 'folderId'], function(data) {
    var mailbox = JSON.parse(data.config.mailbox);
    chrome.tabs.create({
      url: "https://secure.helpscout.net/mailbox/" + mailbox.slug + "/" + data.folderId + "/"
    });
  });
};

var setBadgeAction = function() {
  chrome.browserAction.setPopup({'popup': ''});
  if(!chrome.browserAction.onClicked.hasListeners()) {
    chrome.browserAction.onClicked.addListener(openMailboxUrl);
  }
};

var getUnassignedFolder = function(config, callback) {
  var apiAuth = 'Basic ' + Base64.encode(config.api_key + ':X');
  var request = {
    'headers': {
      'Authorization': apiAuth,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    'baseUrl': 'https://api.helpscout.net/v1/'
  };
  var endpoint = request.baseUrl + 'mailboxes/' + JSON.parse(config.mailbox).id + '/folders.json';

  $.ajax({
    url: endpoint,
    headers: request.headers,
    dataType: "json",
    success: function(data) {
      var unassignedFolder = _.find(data.items, {'type': 'open'});
      chrome.storage.sync.set({'folderId': unassignedFolder.id});
      callback(unassignedFolder);
    }
  });
};

var timer = null;
var startPolling = function(config) {
  clearTimeout(timer);
  (function repeat(){
    getUnassignedFolder(config, function(data) {
      var unassignedFolder = data;
      var unassignedCount = data.activeCount;
      setBadgeAppearance(unassignedCount, config.color_threshold);
      setBadgeAction(config, unassignedFolder.id);
    });
    timer = setTimeout(repeat, config.poll_interval*1000);
  })();
};

(function() {
  setBadgeAppearance();
  chrome.storage.sync.get('config', function(data) {
    if (!_.isEmpty(data)) {
      startPolling(data.config);
    }
  });
})();
