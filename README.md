# Help Scout Unread Counter

This chrome extension displays a button in the Chrome toolbar with the current number of active, unassigned (i.e. unread) conversations in a given [Help Scout](http://www.helpscout.net/) inbox.

## Installation

You may install the extension:

* from the [Chrome Web Store](https://chrome.google.com/webstore/detail/help-scout-unread-counter/flchjfjjjficloabocjehgndamkgjndh)
* from the compiled .crx file in root directory this repo
* by cloning the repo and [loading it as an unpacked extension](https://developer.chrome.com/extensions/getstarted#unpacked)

For development, you might also consider the [Chrome Apps & Extensions Development](https://chrome.google.com/webstore/detail/chrome-apps-extensions-de/ohmmkhmmmpcnpikjeljgnaoabkaalbgc) extension.

## Usage

After installing the extension:

1. Generate an API key in your Help Scout user account.
2. Open the extension's options page.
3. Enter your key and select the inbox whose unread count you'd like to track.
4. Save.

The badge icon should update quickly with the current unread count.
