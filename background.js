var toggle = false;

chrome.browserAction.onClicked.addListener(tab => {
  executeScript(tab.id);
});

chrome.commands.onCommand.addListener(function(command) {
  if (command === 'execute-garden-audit') {
    chrome.tabs.query(
      {
        active: true,
        lastFocusedWindow: true
      },
      function(tabs) {
        var tab = tabs[0];

        executeScript(tab.id);
      }
    );
  }
});

function executeScript(tabId) {
  toggle = !toggle;

  if (toggle) {
    chrome.browserAction.setIcon({
      path: 'images/on.png',
      tabId: tabId
    });

    chrome.tabs.executeScript({
      file: 'execute-garden-audit.js'
    });
  } else {
    chrome.browserAction.setIcon({
      path: 'images/off.png',
      tabId: tabId
    });

    chrome.tabs.executeScript({
      file: 'remove-garden-audit.js'
    });
  }
}
