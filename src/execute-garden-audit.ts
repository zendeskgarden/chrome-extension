/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

(function () {
  const ATTRIBUTE_GARDEN_ID = 'data-garden-id';
  const ATTRIBUTE_GARDEN_VERSION = 'data-garden-version';
  const ATTRIBUTE_GARDEN_CONTAINER_ID = 'data-garden-container-id';
  const ATTRIBUTE_GARDEN_CONTAINER_VERSION = 'data-garden-container-version';
  const COLOR_AZURE = '#3091EC';
  const COLOR_CRIMSON = '#C72A1C';
  const COLOR_LEMON = '#FFD424';
  const COLOR_LIME = '#43B324';
  const COLOR_PURPLE = '#B552E2';
  const CURRENT_MAJOR = 8;

  function addHighlight(component, id, version) {
    const excludeIds = ['chrome.main', 'grid.grid', 'grid.col', 'grid.row'];

    if (excludeIds.indexOf(id) === -1) {
      let color;

      if (id.indexOf('chrome') !== -1) {
        color = COLOR_AZURE;
      } else {
        const major = parseInt(version[0], 10);

        if (major >= CURRENT_MAJOR) {
          color = COLOR_LIME; // up-to-date
        } else if (major === CURRENT_MAJOR - 1) {
          color = COLOR_LEMON; // one version back
        } else {
          color = COLOR_CRIMSON; // out-of-date
        }
      }

      const clientRects = component.getClientRects();

      for (let i = 0; i < clientRects.length; i++) {
        const clientRect = clientRects[i];
        const spread = clientRect.width > clientRect.height ? clientRect.width : clientRect.height;

        component.style.boxShadow = `inset 0 0 0 ${spread}px ${color}50`;
      }
    }
  }

  function replaceTitle(component, id, version) {
    const title = component.getAttribute('title');

    if (title) {
      // Save for restore on audit removal.
      component.setAttribute('data-garden-title', title);
    }

    component.setAttribute('title', `${id} - ${version}`);
  }

  const components = [];

  const audit = doc => {
    const elements = doc.querySelectorAll(`[${ATTRIBUTE_GARDEN_ID}]`);
    const containers = doc.querySelectorAll(
      `[${ATTRIBUTE_GARDEN_CONTAINER_ID}]:not([${ATTRIBUTE_GARDEN_ID}])`
    );

    elements.forEach(element => {
      const id = element.getAttribute(ATTRIBUTE_GARDEN_ID);
      const version = element.getAttribute(ATTRIBUTE_GARDEN_VERSION);

      components.push({ id, version });
      addHighlight(element, id, version);
      replaceTitle(element, id, version);
    });

    containers.forEach(container => {
      const id = `${container.getAttribute(ATTRIBUTE_GARDEN_CONTAINER_ID)}`;
      const version = container.getAttribute(ATTRIBUTE_GARDEN_CONTAINER_VERSION);

      components.push({ id, version });
      container.style.outline = `2px dashed ${COLOR_PURPLE}`;
      container.style.outlineOffset = '-2px';
      replaceTitle(container, id, version);
    });
  };

  audit(document);

  const iframes = document.getElementsByTagName('iframe');

  for (let iframe of iframes) {
    if (iframe.contentDocument) {
      audit(iframe.contentDocument);
    } else {
      console.log('Garden Audit is unable to access cross-origin iframe:', iframe);
    }
  }

  if (components.length > 0) {
    console.table(components);
  }

  console.log(`A total of ${components.length} Zendesk Garden components were found on the page.`);
})();
