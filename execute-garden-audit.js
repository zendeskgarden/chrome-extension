function addHighlight(component) {
  const id = component.getAttribute("data-garden-id");
  const excludeIds = [
    "chrome.nav",
    "chrome.nav_item",
    "chrome.subnav",
    "chrome.header",
    "chrome.header_item"
  ];

  if (excludeIds.indexOf(id) === -1) {
    const color = id.indexOf("chrome") === -1 ? "#43B324" : "#337FBD";
    const clientRects = component.getClientRects();

    for (let i = 0; i < clientRects.length; i++) {
      const clientRect = clientRects[i];
      const spread =
        clientRect.width > clientRect.height
          ? clientRect.width
          : clientRect.height;

      component.style.boxShadow = `inset 0 0 0 ${spread}px ${color}75`;
    }
  }
}

function addTitle(component) {
  const id = component.getAttribute("data-garden-id");
  const version = component.getAttribute("data-garden-version");

  component.setAttribute("title", `${id} - ${version}`);
}

(function() {
  const components = [];

  document.querySelectorAll("[data-garden-id]").forEach(component => {
    components.push({
      id: component.getAttribute("data-garden-id"),
      version: component.getAttribute("data-garden-version")
    });
    addHighlight(component);
    addTitle(component);
  });

  /* TODO [jtz] query into iframe documents */

  if (components.length > 0) {
    console.table(components);
  }

  console.log(
    `A total of ${
      components.length
    } Zendesk Garden components were found on the page.`
  );
})();
