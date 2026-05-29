const SIDE_PANEL_MODE_STORAGE_KEY = "echothink.sidePanel.mode";
const ALPHA_MODES = Object.freeze(["chat", "workspace_context"]);
const DEFAULT_MODE = "chat";

const modeButtons = document.querySelectorAll("[data-mode]");
const panels = document.querySelectorAll("[data-panel]");
const activeTabLabel = document.querySelector("#active-tab-label");
let hasUserSelectedMode = false;

function isSupportedMode(mode) {
  return ALPHA_MODES.includes(mode);
}

function setMode(mode) {
  const nextMode = isSupportedMode(mode) ? mode : DEFAULT_MODE;

  modeButtons.forEach((button) => {
    const isActive = button.dataset.mode === nextMode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  panels.forEach((panel) => {
    panel.classList.toggle("is-hidden", panel.dataset.panel !== nextMode);
  });

  return nextMode;
}

async function readStoredMode() {
  if (!globalThis.chrome?.storage?.local?.get) {
    return DEFAULT_MODE;
  }

  const storedValues = await globalThis.chrome.storage.local.get(
    SIDE_PANEL_MODE_STORAGE_KEY,
  );
  return isSupportedMode(storedValues?.[SIDE_PANEL_MODE_STORAGE_KEY])
    ? storedValues[SIDE_PANEL_MODE_STORAGE_KEY]
    : DEFAULT_MODE;
}

async function persistMode(mode) {
  if (!globalThis.chrome?.storage?.local?.set) {
    return;
  }

  await globalThis.chrome.storage.local.set({
    [SIDE_PANEL_MODE_STORAGE_KEY]: mode,
  });
}

async function initializeMode() {
  const storedMode = await readStoredMode();
  if (!hasUserSelectedMode) {
    setMode(storedMode);
  }
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
  button.addEventListener("click", () => {
    hasUserSelectedMode = true;
    const nextMode = setMode(button.dataset.mode);
    persistMode(nextMode).catch((error) => {
      console.warn("Unable to store side panel mode", error);
    });
  });
});

document.querySelector(".composer")?.addEventListener("submit", (event) => {
  event.preventDefault();
});

updateActiveTabLabel().catch((error) => {
  console.warn("Unable to read active tab", error);
});

initializeMode().catch((error) => {
  console.warn("Unable to read side panel mode", error);
  setMode(DEFAULT_MODE);
});
