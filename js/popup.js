document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get('config', function(data) {
    var mailbox_obj = JSON.parse(data.config.mailbox);
    var mailboxUrl = 'https://secure.helpscout.net/mailbox/' + mailbox_obj.slug;
    var mailboxName = mailbox_obj.name;

    var mailbox_link = document.getElementById('mailbox_link');
    mailbox_link.href = mailboxUrl;
    mailbox_link.innerHTML = mailboxName;

    mailbox_link.addEventListener('click', function() {
      chrome.tabs.create({url: this.href});
    });

    var options_link = document.getElementById('options_link');
    options_link.addEventListener('click', function() {
      chrome.tabs.create({url: 'src/options/index.html'});
    });

    // chrome.cookies.getAll({'domain': 'secure.helpscout.net'}, function(data) {
    //   console.log(data);
    // });

  });
});
