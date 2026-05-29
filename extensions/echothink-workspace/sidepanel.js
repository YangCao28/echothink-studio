const SIDE_PANEL_MODE_STORAGE_KEY = "echothink.sidePanel.mode";
const WORKSPACE_CONTEXT_STORAGE_KEY = "echothink.workspaceContext.snapshot";
const WORKSPACE_CONTEXT_UPDATE_TYPE = "echothink.workspaceContext.update";
const ALPHA_MODES = Object.freeze(["chat", "workspace_context"]);
const DEFAULT_MODE = "chat";
const WORKSPACE_CONTEXT_SECTIONS = Object.freeze([
  "project",
  "app_domain",
  "task_wave",
  "agent_console",
  "approvals",
  "artifacts",
  "navigation",
  "notifications",
  "quick_actions",
]);
const SERVICE_MESSAGE_ORIGINS = new Set(["https://app.echothink.ai"]);
const SERVICE_LINK_ORIGINS = new Set([
  "https://app.echothink.ai",
  "https://auth.echothink.ai",
  "https://search.echothink.ai",
]);

const modeButtons = document.querySelectorAll("[data-mode]");
const panels = document.querySelectorAll("[data-panel]");
const activeTabLabel = document.querySelector("#active-tab-label");
const workspaceOverviewTitle = document.querySelector("[data-context-overview-title]");
const workspaceOverviewSummary = document.querySelector("[data-context-overview-summary]");
const workspaceContextSections = new Map(
  Array.from(document.querySelectorAll("[data-context-section]")).map((section) => [
    section.dataset.contextSection,
    section,
  ]),
);
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

function textOrEmpty(value) {
  return typeof value === "string" ? value.trim() : "";
}

function defaultText(element) {
  if (!element) {
    return "";
  }

  if (!element.dataset.defaultText) {
    element.dataset.defaultText = element.textContent.trim();
  }

  return element.dataset.defaultText;
}

function setTextWithDefault(element, value) {
  if (!element) {
    return;
  }

  element.textContent = textOrEmpty(value) || defaultText(element);
}

function clearElement(element) {
  if (!element) {
    return;
  }

  while (element.firstChild) {
    element.firstChild.remove();
  }
}

function serviceLinkOrEmpty(value) {
  const candidate = textOrEmpty(value);
  if (!candidate) {
    return "";
  }

  try {
    const url = new URL(candidate);
    return SERVICE_LINK_ORIGINS.has(url.origin) ? url.href : "";
  } catch {
    return "";
  }
}

function sectionSnapshotFrom(snapshot, sectionId) {
  const sections = snapshot?.sections;
  if (Array.isArray(sections)) {
    return sections.find((section) => section?.id === sectionId) || {};
  }

  return sections?.[sectionId] || {};
}

function renderContextItems(container, items) {
  clearElement(container);

  if (!Array.isArray(items)) {
    return 0;
  }

  items.slice(0, 8).forEach((item) => {
    const label = textOrEmpty(item?.label || item?.title || item?.name);
    const value = textOrEmpty(item?.value || item?.summary || item?.status);
    const meta = textOrEmpty(item?.meta || item?.detail || item?.description);

    if (!label && !value && !meta) {
      return;
    }

    const row = document.createElement("li");
    row.className = "context-item";

    if (label) {
      const labelElement = document.createElement("strong");
      labelElement.textContent = label;
      row.append(labelElement);
    }

    if (value) {
      const valueElement = document.createElement("span");
      valueElement.textContent = value;
      row.append(valueElement);
    }

    if (meta) {
      const metaElement = document.createElement("small");
      metaElement.textContent = meta;
      row.append(metaElement);
    }

    container?.append(row);
  });

  return container?.childElementCount || 0;
}

function renderContextActions(container, actions) {
  clearElement(container);

  if (!Array.isArray(actions)) {
    return 0;
  }

  actions.slice(0, 6).forEach((action) => {
    const label = textOrEmpty(action?.label || action?.title);
    if (!label) {
      return;
    }

    const href = serviceLinkOrEmpty(action?.href || action?.url);
    const actionElement = href
      ? document.createElement("a")
      : document.createElement("span");
    actionElement.className = "context-action";
    actionElement.textContent = label;

    if (href) {
      actionElement.href = href;
      actionElement.target = "_blank";
      actionElement.rel = "noreferrer";
    } else {
      actionElement.setAttribute("aria-disabled", "true");
    }

    container?.append(actionElement);
  });

  return container?.childElementCount || 0;
}

function renderWorkspaceContextSection(sectionId, sectionSnapshot) {
  const section = workspaceContextSections.get(sectionId);
  if (!section) {
    return;
  }

  const titleElement = section.querySelector("[data-context-title]");
  const statusElement = section.querySelector("[data-context-status]");
  const emptyElement = section.querySelector("[data-context-empty]");
  const itemsElement = section.querySelector("[data-context-items]");
  const actionsElement = section.querySelector("[data-context-actions]");
  const title = textOrEmpty(sectionSnapshot?.title);
  const status = textOrEmpty(sectionSnapshot?.status);
  const summary = textOrEmpty(sectionSnapshot?.summary || sectionSnapshot?.description);
  const renderedItemCount = renderContextItems(itemsElement, sectionSnapshot?.items);
  const renderedActionCount = renderContextActions(actionsElement, sectionSnapshot?.actions);
  const hasContent =
    Boolean(title || status || summary) || renderedItemCount > 0 || renderedActionCount > 0;

  setTextWithDefault(titleElement, title);
  setTextWithDefault(statusElement, status || (hasContent ? "Available" : ""));
  statusElement?.classList.toggle("has-content", hasContent);

  if (emptyElement) {
    emptyElement.textContent = summary || defaultText(emptyElement);
    emptyElement.hidden = hasContent && !summary;
  }
}

function renderWorkspaceContext(snapshot) {
  if (!snapshot || typeof snapshot !== "object") {
    return;
  }

  const overview = snapshot.overview || {};
  setTextWithDefault(workspaceOverviewTitle, overview.title || snapshot.title);
  setTextWithDefault(workspaceOverviewSummary, overview.summary || snapshot.summary);

  WORKSPACE_CONTEXT_SECTIONS.forEach((sectionId) => {
    renderWorkspaceContextSection(sectionId, sectionSnapshotFrom(snapshot, sectionId));
  });
}

async function readWorkspaceContextSnapshot() {
  if (!globalThis.chrome?.storage?.local?.get) {
    return null;
  }

  const storedValues = await globalThis.chrome.storage.local.get(
    WORKSPACE_CONTEXT_STORAGE_KEY,
  );
  const snapshot = storedValues?.[WORKSPACE_CONTEXT_STORAGE_KEY];
  return snapshot && typeof snapshot === "object" ? snapshot : null;
}

async function initializeWorkspaceContext() {
  const snapshot = await readWorkspaceContextSnapshot();
  if (snapshot) {
    renderWorkspaceContext(snapshot);
  }
}

function isAllowedWorkspaceContextSender(sender) {
  if (!sender?.url) {
    return true;
  }

  try {
    return SERVICE_MESSAGE_ORIGINS.has(new URL(sender.url).origin);
  } catch {
    return false;
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

globalThis.chrome?.runtime?.onMessage?.addListener?.((message, sender) => {
  if (
    message?.type !== WORKSPACE_CONTEXT_UPDATE_TYPE ||
    !isAllowedWorkspaceContextSender(sender)
  ) {
    return;
  }

  renderWorkspaceContext(message.payload);
});

updateActiveTabLabel().catch((error) => {
  console.warn("Unable to read active tab", error);
});

initializeMode().catch((error) => {
  console.warn("Unable to read side panel mode", error);
  setMode(DEFAULT_MODE);
});

initializeWorkspaceContext().catch((error) => {
  console.warn("Unable to read workspace context snapshot", error);
});
