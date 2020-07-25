/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

const gardenInspect = (tabId?: number) => {
  const key = 'garden-inspect';

  chrome.storage.local.get(key, result => {
    result[key] = result[key] === undefined ? true : !result[key];

    chrome.storage.local.set(result, () => {
      if (result[key]) {
        chrome.browserAction.setIcon({ path: 'images/on.png', tabId });
        chrome.tabs.executeScript({ file: 'scripts/on.js' });
      } else {
        chrome.browserAction.setIcon({ path: 'images/off.png', tabId });
        chrome.tabs.executeScript({ file: 'scripts/off.js' });
      }
    });
  });
};

chrome.browserAction.onClicked.addListener(tab => {
  gardenInspect(tab.id);
});

chrome.commands.onCommand.addListener(command => {
  if (command === 'toggle-garden-inspect') {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
      gardenInspect(tabs[0].id);
    });
  }
});
