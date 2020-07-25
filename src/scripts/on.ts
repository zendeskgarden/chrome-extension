/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

(() => {
  const ATTRIBUTE_GARDEN_ID = 'data-garden-id';
  const ATTRIBUTE_GARDEN_VERSION = 'data-garden-version';
  const ATTRIBUTE_GARDEN_CONTAINER_ID = 'data-garden-container-id';
  const ATTRIBUTE_GARDEN_CONTAINER_VERSION = 'data-garden-container-version';
  const ATTRIBUTE_GARDEN_TITLE = 'data-garden-title';
  const COLOR_CHROME = '#3091EC'; /* azure */
  const COLOR_CONTAINER = '#B552E2'; /* purple */
  const COLOR_CURRENT = '#43B324'; /* lime */
  const COLOR_PAST = '#C72A1C'; /* crimson */
  const COLOR_PREVIOUS = '#FFD424'; /* lemon */
  const CURRENT_MAJOR = 8;

  const addHighlight = (component: HTMLElement, id: string, version: string) => {
    const excludeIds = ['chrome.main', 'grid.grid', 'grid.col', 'grid.row'];

    if (excludeIds.indexOf(id) === -1) {
      let color;

      if (id.indexOf('chrome') === -1) {
        const major = parseInt(version[0], 10);

        if (major >= CURRENT_MAJOR) {
          color = COLOR_CURRENT; // up-to-date
        } else if (major === CURRENT_MAJOR - 1) {
          color = COLOR_PREVIOUS; // one version back
        } else {
          color = COLOR_PAST; // out-of-date
        }
      } else {
        color = COLOR_CHROME;
      }

      const clientRects = component.getClientRects();

      for (let i = 0; i < clientRects.length; i++) {
        const clientRect = clientRects[i];
        const spread = clientRect.width > clientRect.height ? clientRect.width : clientRect.height;

        component.style.boxShadow = `inset 0 0 0 ${spread}px ${color}50`;
      }
    }
  };

  const replaceTitle = (component: Element, id: string, version: string) => {
    const title = component.getAttribute('title');

    if (title) {
      // Save for restore on inspect removal.
      component.setAttribute(ATTRIBUTE_GARDEN_TITLE, title);
    }

    component.setAttribute('title', `${id} - ${version}`);
  };

  const inspect = (doc: Document, data: Array<{ id: string; version: string }>) => {
    const componentSelector = `[${ATTRIBUTE_GARDEN_ID}]`;
    const components = <HTMLElement[]>(<unknown>doc.querySelectorAll(componentSelector));

    components.forEach(element => {
      const id = `${element.getAttribute(ATTRIBUTE_GARDEN_ID)}`;
      const version = `${element.getAttribute(ATTRIBUTE_GARDEN_VERSION)}`;

      data.push({ id, version });
      addHighlight(element, id, version);
      replaceTitle(element, id, version);
    });

    const containerSelector = `[${ATTRIBUTE_GARDEN_CONTAINER_ID}]:not([${ATTRIBUTE_GARDEN_ID}])`;
    const containers = <HTMLElement[]>(<unknown>doc.querySelectorAll(containerSelector));

    containers.forEach(container => {
      const id = `${container.getAttribute(ATTRIBUTE_GARDEN_CONTAINER_ID)}`;
      const version = `${container.getAttribute(ATTRIBUTE_GARDEN_CONTAINER_VERSION)}`;

      data.push({ id, version });
      container.style.outline = `2px dashed ${COLOR_CONTAINER}`;
      container.style.outlineOffset = '-2px';
      replaceTitle(container, id, version);
    });
  };

  const components: Array<{ id: string; version: string }> = [];

  inspect(document, components);

  const iframes = document.getElementsByTagName('iframe');

  for (const iframe of iframes) {
    if (iframe.contentDocument) {
      inspect(iframe.contentDocument, components);
    } else {
      console.log('Garden Inspect is unable to access cross-origin iframe:', iframe);
    }
  }

  if (components.length > 0) {
    console.table(components);
  }

  console.log(`A total of ${components.length} Zendesk Garden components were found on the page.`);
})();
