chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.executeScript({
    file: "execute-garden-audit.js"
  });
});

chrome.commands.onCommand.addListener(function(command) {
  if (command === "execute-garden-audit") {
    chrome.tabs.executeScript({
      file: "execute-garden-audit.js"
    });
  }
});
