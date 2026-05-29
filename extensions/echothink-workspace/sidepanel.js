const SIDE_PANEL_MODE_STORAGE_KEY = "echothink.sidePanel.mode";
const SIDE_PANEL_LOCAL_STATE_STORAGE_KEY = "echothink.sidePanel.localState";
const SIDE_PANEL_LOCAL_STATE_UPDATE_TYPE = "echothink.sidePanel.localState.update";
const WORKSPACE_CONTEXT_STORAGE_KEY = "echothink.workspaceContext.snapshot";
const WORKSPACE_CONTEXT_UPDATE_TYPE = "echothink.workspaceContext.update";
const ALPHA_MODES = Object.freeze(["chat", "workspace_context"]);
const DEFAULT_MODE = "chat";
const DEFAULT_LOCAL_STATE = "ready";
const CHAT_STREAM_ENDPOINT = "https://api.echothink.ai/v1/chat/stream";
const LOGIN_URL = "https://auth.echothink.ai/login";
const DEVICE_ENROLLMENT_URL = "https://auth.echothink.ai/device/enroll";
const SUPPORT_URL = "https://app.echothink.ai/support";
const SIDEPANEL_URL = "https://app.echothink.ai/sidepanel";
const CHAT_CLIENT = Object.freeze({
  source: "echothink_browser_side_panel",
  version: "0.1.0",
});
const STREAM_DONE = Symbol("stream_done");
const DEVICE_BRIDGE_MESSAGE_TYPE = "echothink.device.bridge";
const REQUEST_PROOF_TYPE = "echothink-request-proof-v1";
const PROOF_HEADER = "DPoP";
const DEVICE_ID_HEADER = "X-Echothink-Device-ID";
const PROOF_SIGNING_ALLOWLIST = Object.freeze([
  { origin: "https://api.echothink.ai", pathPrefix: "/v1/" },
  { origin: "https://auth.echothink.ai", pathPrefix: "/browser/" },
  { origin: "https://auth.echothink.ai", pathPrefix: "/device/" },
  { origin: "https://app.echothink.ai", pathPrefix: "/api/" },
]);
const PROOF_ERROR_LOCAL_STATE = Object.freeze({
  missing_device: "no_device_identity",
  locked_key: "no_device_identity",
  reset: "no_device_identity",
  unauthorized_extension: "no_device_identity",
  invalid_payload: "remote_service_error",
  disallowed_destination: "remote_service_error",
  bridge_error: "remote_service_error",
});
const CHAT_SCOPE_LABELS = Object.freeze({
  current_page: "Current page",
  project: "Current project",
  app_domain: "Current App Domain",
  task_wave: "Current Task Wave",
  artifacts: "Recent artifacts",
  organization: "Organization workspace",
});
const LOCAL_STATE_COPY = Object.freeze({
  ready: {
    title: "",
    description: "",
    actions: [],
  },
  signed_out: {
    title: "Sign in required",
    description: "Sign in before opening Chat or Workspace Context content.",
    actions: [
      { label: "Sign in", href: LOGIN_URL },
      { label: "Enroll device", href: DEVICE_ENROLLMENT_URL },
      { label: "Support", href: SUPPORT_URL },
    ],
  },
  no_device_identity: {
    title: "Device enrollment required",
    description: "Enroll this browser before protected workspace content is shown.",
    actions: [
      { label: "Enroll device", href: DEVICE_ENROLLMENT_URL },
      { label: "Sign in", href: LOGIN_URL },
      { label: "Support", href: SUPPORT_URL },
    ],
  },
  unauthorized_scope: {
    title: "Scope not authorized",
    description: "This account is not authorized for the selected workspace scope.",
    actions: [
      { label: "Open Echothink", href: SIDEPANEL_URL },
      { label: "Support", href: SUPPORT_URL },
    ],
  },
  offline: {
    title: "Offline",
    description: "Reconnect to use Chat and refresh Workspace Context.",
    actions: [
      { label: "Retry", action: "retry" },
      { label: "Support", href: SUPPORT_URL },
    ],
  },
  remote_service_error: {
    title: "Service unavailable",
    description: "Echothink services did not respond. Try again or contact support.",
    actions: [
      { label: "Retry", action: "retry" },
      { label: "Support", href: SUPPORT_URL },
    ],
  },
});
const BLOCKING_LOCAL_STATES = new Set([
  "signed_out",
  "no_device_identity",
  "unauthorized_scope",
]);
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
const LOCAL_STATE_MESSAGE_ORIGINS = new Set([
  "https://app.echothink.ai",
  "https://auth.echothink.ai",
]);
const SERVICE_LINK_ORIGINS = new Set([
  "https://app.echothink.ai",
  "https://auth.echothink.ai",
  "https://search.echothink.ai",
]);

const workspaceShell = document.querySelector("#workspace-shell");
const modeButtons = document.querySelectorAll("[data-mode]");
const panels = document.querySelectorAll("[data-panel]");
const activeTabLabel = document.querySelector("#active-tab-label");
const localStateCard = document.querySelector("#local-state-card");
const localStateTitle = document.querySelector("[data-local-state-title]");
const localStateDescription = document.querySelector("[data-local-state-description]");
const localStateActions = document.querySelector("[data-local-state-actions]");
const protectedContent = document.querySelectorAll("[data-protected-content]");
const scopeSelect = document.querySelector("#scope-select");
const scopeSummary = document.querySelector("#scope-summary");
const chatTranscript = document.querySelector("#chat-transcript");
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
let currentSidePanelLocalState = { state: DEFAULT_LOCAL_STATE, detail: "" };
let cachedDeviceId = "";

function isSupportedMode(mode) {
  return ALPHA_MODES.includes(mode);
}

function isSupportedScope(scopeType) {
  return Object.hasOwn(CHAT_SCOPE_LABELS, scopeType);
}

function getSelectedScopeType() {
  return isSupportedScope(scopeSelect?.value) ? scopeSelect.value : "current_page";
}

function isSupportedLocalState(state) {
  return Object.hasOwn(LOCAL_STATE_COPY, state);
}

function normalizeSidePanelLocalState(value) {
  const state = typeof value === "string" ? value : value?.state;
  const normalizedState = isSupportedLocalState(state) ? state : DEFAULT_LOCAL_STATE;
  const detail = typeof value === "object" ? textOrEmpty(value?.detail).slice(0, 180) : "";
  const scopeType =
    typeof value === "object" && isSupportedScope(value?.scope_type)
      ? value.scope_type
      : undefined;

  return {
    state: normalizedState,
    detail,
    scope_type: scopeType,
  };
}

function isBlockingLocalState(localState = currentSidePanelLocalState) {
  return BLOCKING_LOCAL_STATES.has(localState?.state);
}

function isChatInputBlockedByLocalState(localState = currentSidePanelLocalState) {
  return isBlockingLocalState(localState) || localState?.state === "offline";
}

function createLocalStateAction(action) {
  if (action.action === "retry") {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = action.label;
    button.addEventListener("click", () => {
      retryLocalState().catch((error) => {
        console.warn("Unable to retry side panel state", error);
      });
    });
    return button;
  }

  const href = serviceLinkOrEmpty(action.href);
  if (!href) {
    return undefined;
  }

  const link = document.createElement("a");
  link.href = href;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = action.label;
  return link;
}

function renderLocalStateActions(actions) {
  clearElement(localStateActions);

  actions.forEach((action) => {
    const actionElement = createLocalStateAction(action);
    if (actionElement) {
      localStateActions?.append(actionElement);
    }
  });
}

function ensureChatEmptyState() {
  if (!chatTranscript || chatTranscript.querySelector("#chat-empty-state")) {
    return;
  }

  const emptyState = document.createElement("li");
  emptyState.className = "chat-empty-state";
  emptyState.id = "chat-empty-state";
  emptyState.setAttribute("role", "status");
  emptyState.textContent = "No messages yet.";
  chatTranscript.append(emptyState);
}

function resetChatTranscript() {
  clearElement(chatTranscript);
  ensureChatEmptyState();
}

function resetWorkspaceContextContent() {
  setTextWithDefault(workspaceOverviewTitle, "");
  setTextWithDefault(workspaceOverviewSummary, "");

  workspaceContextSections.forEach((section) => {
    const titleElement = section.querySelector("[data-context-title]");
    const statusElement = section.querySelector("[data-context-status]");
    const emptyElement = section.querySelector("[data-context-empty]");
    const itemsElement = section.querySelector("[data-context-items]");
    const actionsElement = section.querySelector("[data-context-actions]");

    setTextWithDefault(titleElement, "");
    setTextWithDefault(statusElement, "");
    statusElement?.classList.remove("has-content");
    setTextWithDefault(emptyElement, "");
    if (emptyElement) {
      emptyElement.hidden = false;
    }
    clearElement(itemsElement);
    clearElement(actionsElement);
  });
}

function clearProtectedContentForBlockingState() {
  resetChatTranscript();
  resetWorkspaceContextContent();
}

function applySidePanelLocalState(localState) {
  const copy = LOCAL_STATE_COPY[localState.state] || LOCAL_STATE_COPY.ready;
  const isReady = localState.state === DEFAULT_LOCAL_STATE;
  const blocksProtectedContent = isBlockingLocalState(localState);

  workspaceShell?.classList.remove("is-state-pending");
  if (localStateCard) {
    localStateCard.hidden = isReady;
  }
  setTextWithDefault(localStateTitle, copy.title);
  setTextWithDefault(localStateDescription, localState.detail || copy.description);
  renderLocalStateActions(copy.actions);

  protectedContent.forEach((element) => {
    element.hidden = blocksProtectedContent;
  });

  if (blocksProtectedContent) {
    clearProtectedContentForBlockingState();
  }

  if (messageInput) {
    messageInput.disabled = isChatInputBlockedByLocalState(localState);
  }

  updateSendButtonState();
}

async function readStoredLocalState() {
  if (!globalThis.chrome?.storage?.local?.get) {
    return normalizeSidePanelLocalState(DEFAULT_LOCAL_STATE);
  }

  const storedValues = await globalThis.chrome.storage.local.get(
    SIDE_PANEL_LOCAL_STATE_STORAGE_KEY,
  );
  return normalizeSidePanelLocalState(storedValues?.[SIDE_PANEL_LOCAL_STATE_STORAGE_KEY]);
}

async function persistLocalState(localState) {
  if (!globalThis.chrome?.storage?.local?.set) {
    return;
  }

  await globalThis.chrome.storage.local.set({
    [SIDE_PANEL_LOCAL_STATE_STORAGE_KEY]: localState,
  });
}

async function setSidePanelLocalState(value, options = {}) {
  const nextState =
    value?.state !== "offline" && navigator.onLine === false
      ? normalizeSidePanelLocalState("offline")
      : normalizeSidePanelLocalState(value);

  currentSidePanelLocalState = nextState;
  applySidePanelLocalState(nextState);

  if (options.persist === false || nextState.state === "offline") {
    return nextState;
  }

  await persistLocalState(nextState);
  return nextState;
}

async function initializeLocalState() {
  const storedState = await readStoredLocalState();
  await setSidePanelLocalState(storedState, { persist: false });
}

async function retryLocalState() {
  if (navigator.onLine === false) {
    await setSidePanelLocalState("offline", { persist: false });
    return;
  }

  const storedState = await readStoredLocalState();
  const nextState =
    storedState.state === "remote_service_error"
      ? normalizeSidePanelLocalState(DEFAULT_LOCAL_STATE)
      : storedState;
  await setSidePanelLocalState(nextState, {
    persist: storedState.state === "remote_service_error",
  });

  if (!isBlockingLocalState()) {
    await initializeWorkspaceContext();
  }
}

function localStateForChatResponse(response) {
  const serviceState =
    response.headers.get("x-echothink-state") ||
    response.headers.get("x-echothink-error");

  if (/device|enroll/i.test(serviceState || "")) {
    return "no_device_identity";
  }

  if (response.status === 401) {
    return "signed_out";
  }

  if (response.status === 403) {
    return "unauthorized_scope";
  }

  if (response.status === 412 || response.status === 428) {
    return "no_device_identity";
  }

  return "remote_service_error";
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

  const inputBlocked = isChatInputBlockedByLocalState();
  messageInput.disabled = inputBlocked;
  sendButton.disabled =
    inputBlocked || isSendingChatMessage || messageInput.value.trim() === "";
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

  chatTranscript.querySelector("#chat-empty-state")?.remove();

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
  const localState = localStateForChatResponse(response);
  const copy = LOCAL_STATE_COPY[localState] || LOCAL_STATE_COPY.remote_service_error;
  return copy.description || "Chat service error.";
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

function isProofSigningAllowed(targetUrl) {
  let parsedUrl;
  try {
    parsedUrl = new URL(targetUrl);
  } catch {
    return false;
  }

  if (parsedUrl.protocol !== "https:") {
    return false;
  }

  return PROOF_SIGNING_ALLOWLIST.some(
    (entry) =>
      entry.origin === parsedUrl.origin &&
      parsedUrl.pathname.startsWith(entry.pathPrefix),
  );
}

function sendDeviceBridgeMessage(method, payload) {
  if (!globalThis.chrome?.runtime?.sendMessage) {
    return Promise.resolve({ ok: false, error: "unsupported_platform" });
  }

  return new Promise((resolve) => {
    try {
      globalThis.chrome.runtime.sendMessage(
        { type: DEVICE_BRIDGE_MESSAGE_TYPE, method, payload },
        (response) => {
          if (globalThis.chrome.runtime.lastError) {
            resolve({ ok: false, error: "bridge_error" });
            return;
          }

          resolve(response ?? { ok: false, error: "bridge_error" });
        },
      );
    } catch {
      resolve({ ok: false, error: "bridge_error" });
    }
  });
}

async function getDeviceId() {
  if (cachedDeviceId) {
    return cachedDeviceId;
  }

  const status = await sendDeviceBridgeMessage("getDeviceStatus");
  if (status?.ok && typeof status.device_id === "string" && status.device_id) {
    cachedDeviceId = status.device_id;
  }

  return cachedDeviceId || "";
}

async function requestRequestProof(method, targetUrl) {
  if (!isProofSigningAllowed(targetUrl)) {
    return { attached: false };
  }

  const result = await sendDeviceBridgeMessage("signProofPayload", {
    method,
    url: targetUrl,
    timestamp: new Date().toISOString(),
  });

  if (
    result?.ok &&
    result.proof_type === REQUEST_PROOF_TYPE &&
    typeof result.proof === "string" &&
    result.proof
  ) {
    return { attached: true, proof: result.proof };
  }

  // A build without the bundled device bridge cannot produce proofs; fall back
  // to the existing cookie-authenticated request instead of blocking chat.
  if (result?.error === "unsupported_platform") {
    return { attached: false };
  }

  return { attached: false, error: result?.error || "bridge_error" };
}

async function buildProofHeaders(method, targetUrl) {
  const proofResult = await requestRequestProof(method, targetUrl);
  if (proofResult.error) {
    return { error: proofResult.error };
  }

  const headers = {};
  if (proofResult.attached) {
    headers[PROOF_HEADER] = proofResult.proof;
    const deviceId = await getDeviceId();
    if (deviceId) {
      headers[DEVICE_ID_HEADER] = deviceId;
    }
  }

  return { headers };
}

async function submitChatMessage(message) {
  if (isSendingChatMessage || isChatInputBlockedByLocalState()) {
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
    const proof = await buildProofHeaders("POST", CHAT_STREAM_ENDPOINT);
    if (proof.error) {
      const localState =
        PROOF_ERROR_LOCAL_STATE[proof.error] || "remote_service_error";
      const copy =
        LOCAL_STATE_COPY[localState] || LOCAL_STATE_COPY.remote_service_error;
      assistantMessage.textContent = copy.description;
      setChatStatus(copy.description, { kind: "error" });
      await setSidePanelLocalState(localState);
      return;
    }

    const response = await fetch(CHAT_STREAM_ENDPOINT, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream, application/x-ndjson, application/json, text/plain",
        ...proof.headers,
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      const localState = localStateForChatResponse(response);
      const errorMessage = getChatErrorMessage(response);
      assistantMessage.textContent = errorMessage;
      setChatStatus(errorMessage, { kind: "error" });
      await setSidePanelLocalState(localState);
      return;
    }

    await setSidePanelLocalState(DEFAULT_LOCAL_STATE);
    await renderChatResponse(response, assistantMessage);
    setChatStatus("");
  } catch (error) {
    const localState = navigator.onLine ? "remote_service_error" : "offline";
    const copy = LOCAL_STATE_COPY[localState];
    assistantMessage.textContent = copy.description;
    setChatStatus(assistantMessage.textContent, { kind: "error" });
    await setSidePanelLocalState(localState, {
      persist: localState !== "offline",
    });
    console.warn("Unable to send chat message", error);
  } finally {
    isSendingChatMessage = false;
    if (messageInput) {
      messageInput.value = "";
    }
    updateSendButtonState();
    messageInput?.focus();
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

  const snapshotLocalState = snapshot.local_state || snapshot.localState;
  if (snapshotLocalState) {
    const normalizedState = normalizeSidePanelLocalState(snapshotLocalState);
    setSidePanelLocalState(normalizedState).catch((error) => {
      console.warn("Unable to store workspace context state", error);
    });

    if (isBlockingLocalState(normalizedState)) {
      return;
    }
  }

  if (isBlockingLocalState()) {
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
  if (isBlockingLocalState()) {
    return;
  }

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

function isAllowedLocalStateSender(sender) {
  if (!sender?.url) {
    return true;
  }

  try {
    return LOCAL_STATE_MESSAGE_ORIGINS.has(new URL(sender.url).origin);
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

globalThis.addEventListener?.("offline", () => {
  setSidePanelLocalState("offline", { persist: false }).catch((error) => {
    console.warn("Unable to set offline side panel state", error);
  });
});

globalThis.addEventListener?.("online", () => {
  retryLocalState().catch((error) => {
    console.warn("Unable to refresh side panel state", error);
  });
});

globalThis.chrome?.runtime?.onMessage?.addListener?.((message, sender) => {
  if (
    message?.type === SIDE_PANEL_LOCAL_STATE_UPDATE_TYPE &&
    isAllowedLocalStateSender(sender)
  ) {
    setSidePanelLocalState(message.payload).catch((error) => {
      console.warn("Unable to update side panel state", error);
    });
    return;
  }

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

initializeLocalState()
  .then(initializeWorkspaceContext)
  .catch((error) => {
    console.warn("Unable to initialize side panel state", error);
    workspaceShell?.classList.remove("is-state-pending");
  });

updateScopeSummary();
updateSendButtonState();
