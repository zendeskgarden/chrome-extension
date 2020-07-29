/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

const gardenInspect = (tabId?: number, toggle?: boolean) => {
  const key = `garden-inspect-${tabId}`;

  const version = async () => {
    try {
      const response = await fetch('https://registry.npmjs.org/@zendeskgarden/react-theming');
      const json = await response.json();

      return json['dist-tags'].latest;
    } catch {
      return '8.x';
    }
  };

  const execute = (on: boolean) => {
    chrome.storage.local.set({ [key]: on }, () => {
      if (on) {
        version().then(value => {
          chrome.browserAction.setIcon({ path: 'images/on.png', tabId });
          chrome.tabs.executeScript({ code: `window.GARDEN_VERSION = '${value}';` });
          chrome.tabs.executeScript({ file: 'scripts/on.js' });
        });
      } else {
        chrome.browserAction.setIcon({ path: 'images/off.png', tabId });
        chrome.tabs.executeScript({ file: 'scripts/off.js' });
      }
    });
  };

  if (toggle === undefined) {
    chrome.storage.local.get(result => {
      const on = result[key] === undefined ? true : !result[key];

      execute(on);
    });
  } else {
    execute(toggle);
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
