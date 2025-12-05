/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

((): void => {
  const ATTRIBUTE_GARDEN_ID = 'data-garden-id';
  const ATTRIBUTE_GARDEN_VERSION = 'data-garden-version';
  const ATTRIBUTE_GARDEN_CONTAINER_ID = 'data-garden-container-id';
  const ATTRIBUTE_GARDEN_CONTAINER_VERSION = 'data-garden-container-version';
  const COLOR_CONTAINER = '#B276CD'; /* purple */
  const COLOR_CURRENT = '#45B025'; /* lime */
  const COLOR_NAVIGATION = '#3191EA'; /* azure */
  const COLOR_PAST = '#BE4938'; /* crimson */
  const COLOR_PREVIOUS = '#FFDC4F'; /* lemon */

  const addHighlight = (
    component: HTMLElement,
    id: string,
    version: string,
    latestVersion: string
  ): void => {
    const excludeIds = [
      'chrome.main',
      'grid.grid',
      'grid.col',
      'grid.row',
      'navigation.main',
      'pane',
      'pane.content'
    ];

    if (!excludeIds.includes(id)) {
      let color;

      if (id.includes('navigation') || id.includes('chrome')) {
        color = COLOR_NAVIGATION;
      } else {
        const major = parseInt(version.split('.')[0], 10);
        const currentMajor = parseInt(latestVersion.split('.')[0], 10);

        if (major >= currentMajor) {
          color = COLOR_CURRENT; // up-to-date
        } else if (major === currentMajor - 1) {
          color = COLOR_PREVIOUS; // one version back
        } else {
          color = COLOR_PAST; // out-of-date
        }
      }

      const clientRects = component.getClientRects();

      for (const clientRect of clientRects) {
        const spread = clientRect.width > clientRect.height ? clientRect.width : clientRect.height;

        component.style.boxShadow = `inset 0 0 0 ${spread}px ${color}50`;
      }
    }
  };

  const replaceTitle = (component: Element, id: string, version: string): void => {
    const ATTRIBUTE_GARDEN_TITLE = 'data-garden-title';
    const title = component.getAttribute('title');

    if (title !== null) {
      // Save for restore on inspect removal.
      component.setAttribute(ATTRIBUTE_GARDEN_TITLE, title);
    }

    component.setAttribute('title', `${id} - ${version}`);
  };

  const inspect = (
    doc: Document,
    data: { id: string; version: string }[],
    latestVersion: string
  ): void => {
    const componentSelector = `[${ATTRIBUTE_GARDEN_ID}]`;
    const components = doc.querySelectorAll<HTMLElement>(componentSelector);

    components.forEach(element => {
      const id = element.getAttribute(ATTRIBUTE_GARDEN_ID);
      const version =
        (id?.includes('navigation') ?? false)
          ? '0.0.0' // navigation components do not have version attribute
          : element.getAttribute(ATTRIBUTE_GARDEN_VERSION);

      if (id !== null && version !== null) {
        data.push({ id, version });
        addHighlight(element, id, version, latestVersion);
        replaceTitle(element, id, version);
      }
    });

    const containerSelector = `[${ATTRIBUTE_GARDEN_CONTAINER_ID}]:not([${ATTRIBUTE_GARDEN_ID}])`;
    const containers = doc.querySelectorAll<HTMLElement>(containerSelector);

    containers.forEach(container => {
      const id = container.getAttribute(ATTRIBUTE_GARDEN_CONTAINER_ID);
      const version = container.getAttribute(ATTRIBUTE_GARDEN_CONTAINER_VERSION);

      if (id !== null && version !== null) {
        data.push({ id, version });
        container.style.outline = `2px dashed ${COLOR_CONTAINER}`;
        container.style.outlineOffset = '-2px';
        replaceTitle(container, id, version);
      }
    });
  };

  chrome.runtime.onMessage.addListener((request: { latestVersion: string }) => {
    const components: { id: string; version: string }[] = [];

    inspect(document, components, request.latestVersion);

    const iframes = document.getElementsByTagName('iframe');

    for (const iframe of iframes) {
      if (iframe.contentDocument) {
        inspect(iframe.contentDocument, components, request.latestVersion);
      } else {
        console.log('Garden Inspect is unable to access cross-origin iframe:', iframe);
      }
    }

    if (components.length > 0) {
      console.table(components);
    }

    console.log(
      `A total of ${components.length} Zendesk Garden components were found on the page.`
    );
    console.log(`The latest version of Zendesk Garden components is ${request.latestVersion}.`);
  });
})();
