function init() {
  const GARDEN_AUDIT_SELECTOR = "[data-garden-audit]";
  const GARDEN_COMPONENT_SELECTOR = "[data-garden-id]";

  class GardenAudit {
    constructor(componentId, version) {
      this.componentId = componentId;
      this.version = version;
    }
  }

  function getAuditOverlays() {
    return document.querySelectorAll(GARDEN_AUDIT_SELECTOR);
  }

  function removeAuditOverlays(overlays) {
    overlays.forEach(auditItem => {
      auditItem.parentNode.removeChild(auditItem);
    });
  }

  function addAuditOverlays(doc) {
    const audits = [];

    doc.querySelectorAll(GARDEN_COMPONENT_SELECTOR).forEach(item => {
      const componentId = item.getAttribute("data-garden-id");
      const componentVersion = item.getAttribute("data-garden-version");
      const clientRect = item.getClientRects()[0];
      let isChromeComponent = false;

      if (!clientRect) {
        return;
      }

      // Skip overlay for specific Chrome components to allow other audits to be visible
      if (componentId.indexOf("chrome") !== -1) {
        if (
          componentId !== "chrome.nav" &&
          componentId !== "chrome.nav_item" &&
          componentId !== "chrome.subnav" &&
          componentId !== "chrome.header" &&
          componentId !== "chrome.header_item"
        ) {
          return;
        }

        isChromeComponent = true;
      }

      audits.push(new GardenAudit(componentId, componentVersion));

      const overlayElement = createOverlayElement({
        componentId,
        componentVersion,
        clientRect,
        isChromeComponent
      });

      document.body.appendChild(overlayElement);
    });

    logAudits(audits);
  }

  function logAudits(audits) {
    if (audits.length > 0) {
      console.table(audits);
    }

    console.log(
      `A total of ${
        audits.length
      } Zendesk Garden components were found on the page.`
    );
  }

  function createOverlayElement({
    componentId,
    componentVersion,
    clientRect,
    isChromeComponent
  }) {
    const element = document.createElement("div");
    element.setAttribute("title", `${componentId} - ${componentVersion}`);
    element.setAttribute("data-garden-audit", true);
    element.style.position = "absolute";
    element.style.left = `${clientRect.x}px`;
    element.style.top = `${clientRect.y}px`;
    element.style.width = `${clientRect.width}px`;
    element.style.height = `${clientRect.height}px`;
    element.style.backgroundColor = isChromeComponent ? "#337FBD" : "#67C34B";
    element.style.opacity = 0.3;
    element.style.zIndex = 10000;

    return element;
  }

  const existingAuditOverlays = getAuditOverlays();

  if (existingAuditOverlays.length > 0) {
    removeAuditOverlays(existingAuditOverlays);
  } else {
    addAuditOverlays(document);
  }

  // TODO enable iframe usage
  // document.querySelectorAll("iframe").forEach(item => {
  //   addAuditOverlays(item.contentWindow.document);
  // });
}

init();
