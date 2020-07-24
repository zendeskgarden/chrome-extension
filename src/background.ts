/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

var toggle = false;

chrome.browserAction.onClicked.addListener(tab => {
  executeScript(tab.id);
});

chrome.commands.onCommand.addListener(function (command) {
  if (command === 'execute-garden-audit') {
    chrome.tabs.query(
      {
        active: true,
        lastFocusedWindow: true
      },
      function (tabs) {
        var tab = tabs[0];

        executeScript(tab.id);
      }
    );
  }
});

function executeScript(tabId?: number) {
  toggle = !toggle;

  if (toggle) {
    chrome.browserAction.setIcon({
      path: 'images/on.png',
      tabId
    });

    chrome.tabs.executeScript({
      file: 'execute-garden-audit.js'
    });
  } else {
    chrome.browserAction.setIcon({
      path: 'images/off.png',
      tabId
    });

    chrome.tabs.executeScript({
      file: 'remove-garden-audit.js'
    });
  }
}
