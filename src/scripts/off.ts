/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

(() => {
  const ATTRIBUTE_GARDEN_ID = 'data-garden-id';
  const ATTRIBUTE_GARDEN_CONTAINER_ID = 'data-garden-container-id';
  const ATTRIBUTE_GARDEN_TITLE = 'data-garden-title';

  const removeHighlight = (component: HTMLElement) => {
    component.style.boxShadow = '';
    component.style.outline = '';
  };

  const restoreTitle = (component: Element) => {
    const title = component.getAttribute(ATTRIBUTE_GARDEN_TITLE);

    if (title) {
      component.setAttribute('title', title);
      component.removeAttribute(ATTRIBUTE_GARDEN_TITLE);
    } else {
      component.removeAttribute('title');
    }
  };

  const uninspect = (doc: Document) => {
    const selector = `[${ATTRIBUTE_GARDEN_ID}], [${ATTRIBUTE_GARDEN_CONTAINER_ID}]`;
    const components = <HTMLElement[]>(<unknown>doc.querySelectorAll(selector));

    components.forEach(component => {
      removeHighlight(component);
      restoreTitle(component);
    });
  };

  uninspect(document);

  const iframes = document.getElementsByTagName('iframe');

  for (const iframe of iframes) {
    if (iframe.contentDocument) {
      uninspect(iframe.contentDocument);
    }
  }
})();
