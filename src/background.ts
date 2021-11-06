/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

const gardenInspect = (tabId?: number, toggle?: boolean): void => {
  const key = tabId === undefined ? 'garden-inspect' : `garden-inspect-${tabId}`;

  const version = async (): Promise<string> => {
    try {
      const response = await fetch('https://registry.npmjs.org/@zendeskgarden/react-theming');
      const json = (await response.json()) as { 'dist-tags': { latest: string } };

      return json['dist-tags'].latest;
    } catch {
      return '8.x';
    }
  };

  const execute = (on: boolean): void => {
    chrome.storage.local.set({ [key]: on }, () => {
      if (on) {
        version().then(
          value => {
            chrome.browserAction.setIcon({ path: 'images/on.png', tabId });
            chrome.tabs
              .executeScript({ code: `window.GARDEN_VERSION = '${value}';` })
              .catch(console.error);
            chrome.tabs.executeScript({ file: 'scripts/on.js' }).catch(console.error);
          },
          async () => chrome.storage.local.set({ [key]: false })
        );
      } else {
        chrome.browserAction.setIcon({ path: 'images/off.png', tabId });
        chrome.tabs.executeScript({ file: 'scripts/off.js' }).catch(console.error);
      }
    });
  };

  if (toggle === undefined) {
    chrome.storage.local.get(result => {
      const on = result[key] === undefined ? true : !(result[key] as boolean);

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
  if (changes.url !== undefined) {
    gardenInspect(tabId, false /* toggle */);
  }
});
