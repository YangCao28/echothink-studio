const SIDE_PANEL_MODE_STORAGE_KEY = "echothink.sidePanel.mode";
const WORKSPACE_CONTEXT_STORAGE_KEY = "echothink.workspaceContext.snapshot";
const WORKSPACE_CONTEXT_UPDATE_TYPE = "echothink.workspaceContext.update";
const ALPHA_MODES = Object.freeze(["chat", "workspace_context"]);
const DEFAULT_MODE = "chat";
const CHAT_STREAM_ENDPOINT = "https://api.echothink.ai/v1/chat/stream";
const CHAT_CLIENT = Object.freeze({
  source: "echothink_browser_side_panel",
  version: "0.1.0",
});
const STREAM_DONE = Symbol("stream_done");
const CHAT_SCOPE_LABELS = Object.freeze({
  current_page: "Current page",
  project: "Current project",
  app_domain: "Current App Domain",
  task_wave: "Current Task Wave",
  artifacts: "Recent artifacts",
  organization: "Organization workspace",
});
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
const scopeSelect = document.querySelector("#scope-select");
const scopeSummary = document.querySelector("#scope-summary");
const chatTranscript = document.querySelector("#chat-transcript");
const chatEmptyState = document.querySelector("#chat-empty-state");
const chatStatus = document.querySelector("#chat-status");
const chatComposer = document.querySelector("#chat-composer");
const messageInput = document.querySelector("#message-input");
const sendButton = document.querySelector("#send-button");
const workspaceOverviewTitle = document.querySelector("[data-context-overview-title]");
const workspaceOverviewSummary = document.querySelector("[data-context-overview-summary]");
const workspaceContextSections = new Map(
  Array.from(document.querySelectorAll("[data-context-section]")).map((section) => [
    section.dataset.contextSection,
    section,
  ]),
);
let hasUserSelectedMode = false;
let isSendingChatMessage = false;
let currentActiveTab;

function isSupportedMode(mode) {
  return ALPHA_MODES.includes(mode);
}

function isSupportedScope(scopeType) {
  return Object.hasOwn(CHAT_SCOPE_LABELS, scopeType);
}

function getSelectedScopeType() {
  return isSupportedScope(scopeSelect?.value) ? scopeSelect.value : "current_page";
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

function setChatStatus(message, options = {}) {
  if (!chatStatus) {
    return;
  }

  chatStatus.textContent = message;
  chatStatus.classList.toggle("is-error", options.kind === "error");
}

function updateSendButtonState() {
  if (!sendButton || !messageInput) {
    return;
  }

  sendButton.disabled = isSendingChatMessage || messageInput.value.trim() === "";
}

function sanitizePageUrl(url) {
  if (!url) {
    return undefined;
  }

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return undefined;
    }

    return parsedUrl.href;
  } catch {
    return undefined;
  }
}

function buildScopeMetadata(scopeType, tab) {
  const selectedScopeType = isSupportedScope(scopeType) ? scopeType : "current_page";
  const metadata = {
    scope_type: selectedScopeType,
  };

  if (selectedScopeType === "current_page") {
    const pageUrl = sanitizePageUrl(tab?.url);
    if (pageUrl) {
      metadata.page_url = pageUrl;
    }
  }

  return metadata;
}

function buildChatRequest(message, tab) {
  return {
    message,
    scope: buildScopeMetadata(getSelectedScopeType(), tab),
    client: CHAT_CLIENT,
    stream: true,
  };
}

function appendChatMessage(role, text = "") {
  if (!chatTranscript) {
    return undefined;
  }

  chatEmptyState?.remove();

  const messageItem = document.createElement("li");
  const roleLabel = document.createElement("strong");
  const body = document.createElement("p");

  messageItem.className = `chat-message is-${role}`;
  roleLabel.textContent = role === "user" ? "You" : "Echothink";
  body.textContent = text;

  messageItem.append(roleLabel, body);
  chatTranscript.append(messageItem);
  chatTranscript.scrollTop = chatTranscript.scrollHeight;

  return body;
}

function appendToMessage(messageBody, text) {
  if (!messageBody || !text) {
    return;
  }

  messageBody.textContent += text;
  chatTranscript.scrollTop = chatTranscript.scrollHeight;
}

function extractTextFromJson(value) {
  if (!value || typeof value !== "object") {
    return "";
  }

  return (
    value.delta ??
    value.text ??
    value.content ??
    value.message?.content ??
    value.choices?.[0]?.delta?.content ??
    value.choices?.[0]?.message?.content ??
    ""
  );
}

function extractStreamText(line) {
  const trimmedLine = line.trim();
  if (!trimmedLine || trimmedLine.startsWith(":")) {
    return "";
  }

  if (
    trimmedLine.startsWith("event:") ||
    trimmedLine.startsWith("id:") ||
    trimmedLine.startsWith("retry:")
  ) {
    return "";
  }

  const payload = trimmedLine.startsWith("data:")
    ? trimmedLine.slice("data:".length).trim()
    : trimmedLine;

  if (!payload || payload === "[DONE]") {
    return payload === "[DONE]" ? STREAM_DONE : "";
  }

  try {
    return extractTextFromJson(JSON.parse(payload));
  } catch {
    return payload;
  }
}

function renderFinalChatPayload(value, messageBody) {
  const responseText =
    extractTextFromJson(value) || (typeof value === "string" ? value : "");
  messageBody.textContent = responseText || "No response content.";
}

async function renderBufferedChatResponse(response, messageBody) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    renderFinalChatPayload(await response.json(), messageBody);
    return;
  }

  renderFinalChatPayload(await response.text(), messageBody);
}

async function renderStreamingChatResponse(response, messageBody) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let receivedText = false;
  let isDone = false;

  while (!isDone) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() || "";

    for (const line of lines) {
      const text = extractStreamText(line);
      if (text === STREAM_DONE) {
        isDone = true;
        break;
      }

      if (text) {
        receivedText = true;
        appendToMessage(messageBody, text);
      }
    }
  }

  const finalText = extractStreamText(buffer);
  if (finalText && finalText !== STREAM_DONE) {
    receivedText = true;
    appendToMessage(messageBody, finalText);
  }

  if (!receivedText) {
    messageBody.textContent = "No response content.";
  }
}

async function renderRawStreamingChatResponse(response, messageBody) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let receivedText = false;

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }

    const text = decoder.decode(value, { stream: true });
    if (text) {
      receivedText = true;
      appendToMessage(messageBody, text);
    }
  }

  const finalText = decoder.decode();
  if (finalText) {
    receivedText = true;
    appendToMessage(messageBody, finalText);
  }

  if (!receivedText) {
    messageBody.textContent = "No response content.";
  }
}

async function renderChatResponse(response, messageBody) {
  const contentType = response.headers.get("content-type") || "";
  const hasReadableStream = Boolean(response.body);

  if (!hasReadableStream) {
    await renderBufferedChatResponse(response, messageBody);
    return;
  }

  if (
    contentType.includes("text/event-stream") ||
    contentType.includes("application/x-ndjson")
  ) {
    await renderStreamingChatResponse(response, messageBody);
    return;
  }

  if (contentType.includes("text/plain")) {
    await renderRawStreamingChatResponse(response, messageBody);
    return;
  }

  await renderBufferedChatResponse(response, messageBody);
}

function getChatErrorMessage(response) {
  if (response.status === 401) {
    return "Sign in required.";
  }

  if (response.status === 403) {
    return "Scope not authorized.";
  }

  return "Chat service error.";
}

async function getActiveTab() {
  if (!globalThis.chrome?.tabs?.query) {
    return undefined;
  }

  const [tab] = await globalThis.chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  return tab;
}

async function submitChatMessage(message) {
  if (isSendingChatMessage) {
    return;
  }

  isSendingChatMessage = true;
  updateSendButtonState();
  setChatStatus("Sending...");

  const tab = currentActiveTab || (await getActiveTab());
  const requestPayload = buildChatRequest(message, tab);
  appendChatMessage("user", message);
  const assistantMessage = appendChatMessage("assistant");

  try {
    const response = await fetch(CHAT_STREAM_ENDPOINT, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream, application/x-ndjson, application/json, text/plain",
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      assistantMessage.textContent = getChatErrorMessage(response);
      setChatStatus(getChatErrorMessage(response), { kind: "error" });
      return;
    }

    await renderChatResponse(response, assistantMessage);
    setChatStatus("");
  } catch (error) {
    assistantMessage.textContent = navigator.onLine
      ? "Unable to reach chat service."
      : "Offline.";
    setChatStatus(assistantMessage.textContent, { kind: "error" });
    console.warn("Unable to send chat message", error);
  } finally {
    isSendingChatMessage = false;
    messageInput.value = "";
    updateSendButtonState();
    messageInput.focus();
  }
}

function updateScopeSummary() {
  if (!scopeSummary) {
    return;
  }

  const scopeType = getSelectedScopeType();
  const label = CHAT_SCOPE_LABELS[scopeType] || CHAT_SCOPE_LABELS.current_page;
  const pageUrl = buildScopeMetadata(scopeType, currentActiveTab).page_url;
  scopeSummary.textContent =
    scopeType === "current_page" && pageUrl ? new URL(pageUrl).hostname : label;
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
    currentActiveTab = tab;
    activeTabLabel.textContent = new URL(tab.url).hostname || "Current page";
    updateScopeSummary();
  } catch {
    activeTabLabel.textContent = "Current page";
    updateScopeSummary();
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

chatComposer?.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = messageInput?.value.trim();
  if (message) {
    submitChatMessage(message).catch((error) => {
      setChatStatus("Chat service error.", { kind: "error" });
      console.warn("Unable to submit chat message", error);
    });
  }
});

messageInput?.addEventListener("input", updateSendButtonState);

scopeSelect?.addEventListener("change", () => {
  updateScopeSummary();
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
  updateScopeSummary();
});

initializeMode().catch((error) => {
  console.warn("Unable to read side panel mode", error);
  setMode(DEFAULT_MODE);
});

initializeWorkspaceContext().catch((error) => {
  console.warn("Unable to read workspace context snapshot", error);
});

updateScopeSummary();
updateSendButtonState();
