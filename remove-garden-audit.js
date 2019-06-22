(function() {
  function removeHighlight(component) {
    component.style.boxShadow = "";
  }

  function restoreTitle(component) {
    const ATTRIBUTE_TITLE = "data-garden-title";
    const title = component.getAttribute(ATTRIBUTE_TITLE);

    if (title) {
      component.setAttribute("title", title);
      component.removeAttribute(ATTRIBUTE_TITLE);
    } else {
      component.removeAttribute("title");
    }
  }

  const unaudit = doc => {
    doc.querySelectorAll("[data-garden-id]").forEach(component => {
      removeHighlight(component);
      restoreTitle(component);
    });
  };

  unaudit(document);

  const iframes = document.getElementsByTagName("iframe");

  for (let iframe of iframes) {
    unaudit(iframe.contentDocument);
  }
})();
