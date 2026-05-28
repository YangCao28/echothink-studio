const modeButtons = document.querySelectorAll("[data-mode]");
const panels = document.querySelectorAll("[data-panel]");
const activeTabLabel = document.querySelector("#active-tab-label");

function setMode(mode) {
  modeButtons.forEach((button) => {
    const isActive = button.dataset.mode === mode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  panels.forEach((panel) => {
    panel.classList.toggle("is-hidden", panel.dataset.panel !== mode);
  });
}

async function updateActiveTabLabel() {
  if (!globalThis.chrome?.tabs?.query || !activeTabLabel) {
    return;
  }

  const [tab] = await globalThis.chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!tab?.url) {
    return;
  }

  try {
    activeTabLabel.textContent = new URL(tab.url).hostname || "Current page";
  } catch {
    activeTabLabel.textContent = "Current page";
  }
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});

document.querySelector(".composer")?.addEventListener("submit", (event) => {
  event.preventDefault();
});

updateActiveTabLabel().catch((error) => {
  console.warn("Unable to read active tab", error);
});
