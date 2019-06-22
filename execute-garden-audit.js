(function() {
  const ATTRIBUTE_GARDEN_ID = "data-garden-id";
  const ATTRIBUTE_GARDEN_VERSION = "data-garden-version";
  const COLOR_AZURE = "#3091EC";
  const COLOR_CRIMSON = "#C72A1C";
  const COLOR_LEMON = "#FFD424";
  const COLOR_LIME = "#43B324";

  function addHighlight(component) {
    const id = component.getAttribute(ATTRIBUTE_GARDEN_ID);
    const excludeIds = ["chrome.main", "grid.grid", "grid.col", "grid.row"];

    if (excludeIds.indexOf(id) === -1) {
      let color;

      if (id.indexOf("chrome") !== -1) {
        color = COLOR_AZURE;
      } else {
        const version = component.getAttribute(ATTRIBUTE_GARDEN_VERSION);

        // TODO [jtz] replace with an implementation that fetches package data
        // from registry.npmjs.com and calculates relative age based on
        // `time.created` vs. `time.modified` and applies color accordingly.
        if (version === "0.1.0") {
          color = COLOR_CRIMSON;
        } else {
          const major = parseInt(version[0], 10);

          if (major >= 6) {
            color = COLOR_LIME;
          } else {
            color = COLOR_LEMON;
          }
        }
      }

      const clientRects = component.getClientRects();

      for (let i = 0; i < clientRects.length; i++) {
        const clientRect = clientRects[i];
        const spread =
          clientRect.width > clientRect.height
            ? clientRect.width
            : clientRect.height;

        component.style.boxShadow = `inset 0 0 0 ${spread}px ${color}50`;
      }
    }
  }

  function replaceTitle(component) {
    const title = component.getAttribute("title");

    if (title) {
      // Save for restore on audit removal.
      component.setAttribute("data-garden-title", title);
    }

    const id = component.getAttribute(ATTRIBUTE_GARDEN_ID);
    const version = component.getAttribute(ATTRIBUTE_GARDEN_VERSION);

    component.setAttribute("title", `${id} - ${version}`);
  }

  const components = [];
  const audit = doc => {
    doc.querySelectorAll(`[${ATTRIBUTE_GARDEN_ID}]`).forEach(component => {
      components.push({
        id: component.getAttribute(ATTRIBUTE_GARDEN_ID),
        version: component.getAttribute(ATTRIBUTE_GARDEN_VERSION)
      });
      addHighlight(component);
      replaceTitle(component);
    });
  };

  audit(document);

  const iframes = document.getElementsByTagName("iframe");

  for (let iframe of iframes) {
    audit(iframe.contentDocument);
  }

  if (components.length > 0) {
    console.table(components);
  }

  console.log(
    `A total of ${
      components.length
    } Zendesk Garden components were found on the page.`
  );
})();
