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
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const json = (await response.json()) as { 'dist-tags': { latest: string } };

      return json['dist-tags'].latest;
    } catch {
      return '8.x';
    }
  };

  const execute = (on: boolean): void => {
    const targetTabId = tabId === undefined ? chrome.tabs.TAB_ID_NONE : tabId;

    chrome.storage.local.set({ [key]: on }, () => {
      if (on) {
        version().then(
          value => {
            chrome.action.setIcon({ path: 'images/on.png', tabId });
            chrome.scripting.executeScript(
              {
                target: { tabId: targetTabId },
                files: ['scripts/on.js']
              },
              () => {
                void chrome.tabs.sendMessage(targetTabId, { latestVersion: value });
              }
            );
          },
          () => {
            void chrome.storage.local.set({ [key]: false });
          }
        );
      } else {
        chrome.action.setIcon({ path: 'images/off.png', tabId });
        void chrome.scripting.executeScript({
          target: { tabId: targetTabId },
          files: ['scripts/off.js']
        });
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

chrome.action.onClicked.addListener(tab => {
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
