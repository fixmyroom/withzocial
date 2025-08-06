// ===============================
// FixMyRoom - Utility Functions
// ===============================

/**
 * Show alert messages (toast-style)
 * @param {string} message - Message to show
 * @param {string} type - "success", "error", "warning", "info"
 */
function showAlert(message, type = "success") {
  const alertBox = document.createElement("div");
  alertBox.className = `custom-alert alert-${type}`;
  alertBox.innerHTML = `<span>${message}</span>`;

  document.body.appendChild(alertBox);

  setTimeout(() => {
    alertBox.classList.add("show");
  }, 100);

  setTimeout(() => {
    alertBox.classList.remove("show");
    setTimeout(() => alertBox.remove(), 300);
  }, 4000);
}

/**
 * Capitalize first letter of a string
 * @param {string} str
 * @returns {string}
 */
function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format date from timestamp
 * @param {number} ts - Timestamp in ms
 * @returns {string}
 */
function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleString();
}
