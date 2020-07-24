/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

(function () {
  function removeHighlight(component) {
    component.style.boxShadow = '';
    component.style.outline = '';
  }

  function restoreTitle(component) {
    const ATTRIBUTE_TITLE = 'data-garden-title';
    const title = component.getAttribute(ATTRIBUTE_TITLE);

    if (title) {
      component.setAttribute('title', title);
      component.removeAttribute(ATTRIBUTE_TITLE);
    } else {
      component.removeAttribute('title');
    }
  }

  const unaudit = doc => {
    doc.querySelectorAll('[data-garden-id], [data-garden-container-id]').forEach(component => {
      removeHighlight(component);
      restoreTitle(component);
    });
  };

  unaudit(document);

  const iframes = document.getElementsByTagName('iframe');

  for (let iframe of iframes) {
    iframe.contentDocument && unaudit(iframe.contentDocument);
  }
})();
