function init() {
  const GARDEN_AUDIT_SELECTOR = "[data-garden-audit]";

  document.querySelectorAll(GARDEN_AUDIT_SELECTOR).forEach(auditItem => {
    auditItem.parentNode.removeChild(auditItem);
  });
}

init();
