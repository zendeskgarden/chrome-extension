function init() {
  const GARDEN_AUDIT_SELECTOR = "[data-garden-audit]";
  const GARDEN_COMPONENT_SELECTOR = "[data-garden-id]";

  class GardenAudit {
    constructor(componentId, version) {
      this.componentId = componentId;
      this.version = version;
    }
  }

  function removeAuditOverlays() {
    document.querySelectorAll(GARDEN_AUDIT_SELECTOR).forEach(auditItem => {
      auditItem.parentNode.removeChild(auditItem);
    });
  }

  function addAuditOverlays(doc) {
    const audits = [];
    let hasFoundChrome;

    doc.querySelectorAll(GARDEN_COMPONENT_SELECTOR).forEach(item => {
      const componentId = item.getAttribute("data-garden-id");
      const componentVersion = item.getAttribute("data-garden-version");
      const clientRect = item.getClientRects()[0];

      if (!clientRect) {
        return;
      }

      // Skip overlay for all Chrome components to allow other audits to be visible
      if (componentId.indexOf("chrome") !== -1) {
        hasFoundChrome = true;
        return;
      }

      audits.push(new GardenAudit(componentId, componentVersion));

      const overlayElement = createOverlayElement({
        componentId,
        componentVersion,
        clientRect
      });

      document.body.appendChild(overlayElement);
    });

    logAudits(audits, hasFoundChrome);
  }

  function logAudits(audits, hasFoundChrome) {
    if (audits.length > 0) {
      console.table(audits);
    }

    console.log(
      `A total of ${
        audits.length
      } Zendesk Garden components were found on the page.`
    );

    console.log(`Garden Chrome is ${!hasFoundChrome ? "not " : ""}being used.`);
  }

  function createOverlayElement({ componentId, componentVersion, clientRect }) {
    const element = document.createElement("div");
    element.setAttribute("title", `${componentId} - ${componentVersion}`);
    element.setAttribute("data-garden-audit", true);
    element.style.position = "absolute";
    element.style.left = `${clientRect.x}px`;
    element.style.top = `${clientRect.y}px`;
    element.style.width = `${clientRect.width}px`;
    element.style.height = `${clientRect.height}px`;
    element.style.backgroundColor = "#038153";
    element.style.opacity = 0.25;
    element.style.zIndex = 10000;

    return element;
  }

  removeAuditOverlays();
  addAuditOverlays(document);
}

init();
