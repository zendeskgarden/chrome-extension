/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

const gardenInspect = (tabId?: number, toggle?: boolean) => {
  const key = 'garden-inspect';

  const execute = (items: { [key: string]: boolean }) => {
    chrome.storage.local.set(items, () => {
      if (items[key]) {
        chrome.browserAction.setIcon({ path: 'images/on.png', tabId });
        chrome.tabs.executeScript({ file: 'scripts/on.js' });
      } else {
        chrome.browserAction.setIcon({ path: 'images/off.png', tabId });
        chrome.tabs.executeScript({ file: 'scripts/off.js' });
      }
    });
  };

  if (toggle === undefined) {
    chrome.storage.local.get(key, result => {
      result[key] = result[key] === undefined ? true : !result[key];
      execute(result);
    });
  } else {
    execute({ [key]: toggle });
  }
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

chrome.tabs.onUpdated.addListener((tabId, changes) => {
  if (changes.url) {
    gardenInspect(tabId, false /* toggle */);
  }
});
