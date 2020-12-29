/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

((): void => {
  const ATTRIBUTE_GARDEN_ID = 'data-garden-id';
  const ATTRIBUTE_GARDEN_CONTAINER_ID = 'data-garden-container-id';
  const ATTRIBUTE_GARDEN_TITLE = 'data-garden-title';

  const removeHighlight = (component: HTMLElement): void => {
    component.style.boxShadow = '';
    component.style.outline = '';
  };

  const restoreTitle = (component: Element): void => {
    const title = component.getAttribute(ATTRIBUTE_GARDEN_TITLE);

    if (title === null) {
      component.removeAttribute('title');
    } else {
      component.setAttribute('title', title);
      component.removeAttribute(ATTRIBUTE_GARDEN_TITLE);
    }
  };

  const uninspect = (doc: Document): void => {
    const selector = `[${ATTRIBUTE_GARDEN_ID}], [${ATTRIBUTE_GARDEN_CONTAINER_ID}]`;
    const components = (doc.querySelectorAll(selector) as unknown) as HTMLElement[];

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
