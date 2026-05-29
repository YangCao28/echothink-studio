const SIDE_PANEL_PATH = "sidepanel.html";
const DEVICE_BRIDGE_MESSAGE_TYPE = "echothink.device.bridge";
const DEVICE_BRIDGE_METHODS = new Set([
  "getDeviceStatus",
  "requestEnrollmentChallenge",
  "signProofPayload",
  "clearEnrollment",
]);

function logSidePanelError(action, error) {
  console.warn(`Unable to ${action}`, error);
}

async function enableActionClickOpening() {
  if (!chrome.sidePanel?.setPanelBehavior) {
    return;
  }

  await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
}

async function configureDefaultSidePanel() {
  if (!chrome.sidePanel?.setOptions) {
    return;
  }

  await chrome.sidePanel.setOptions({
    path: SIDE_PANEL_PATH,
    enabled: true,
  });
}

async function configureTabSidePanel(tabId) {
  if (!chrome.sidePanel?.setOptions || !Number.isInteger(tabId)) {
    return;
  }

  await chrome.sidePanel.setOptions({
    tabId,
    path: SIDE_PANEL_PATH,
    enabled: true,
  });
}

async function configureActiveTabSidePanel() {
  if (!chrome.tabs?.query) {
    return undefined;
  }

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  await configureTabSidePanel(tab?.id);
  return tab;
}

async function initializeSidePanelEntry() {
  await configureDefaultSidePanel();
  await enableActionClickOpening();
  await configureActiveTabSidePanel();
}

function scheduleSidePanelInitialization() {
  initializeSidePanelEntry().catch((error) => {
    logSidePanelError("initialize side panel entry", error);
  });
}

function isInternalExtensionPageSender(sender) {
  return (
    sender?.id === chrome.runtime.id &&
    typeof sender.url === "string" &&
    sender.url.startsWith(chrome.runtime.getURL(""))
  );
}

function isDeviceBridgeMessage(message) {
  return (
    message &&
    typeof message === "object" &&
    message.type === DEVICE_BRIDGE_MESSAGE_TYPE &&
    DEVICE_BRIDGE_METHODS.has(message.method)
  );
}

async function invokeDeviceBridge(method, payload) {
  const nativeBridge = chrome.echothinkDevice;
  const bridgeMethod = nativeBridge?.[method];

  if (typeof bridgeMethod !== "function") {
    return {
      ok: false,
      error: "unsupported_platform",
    };
  }

  return new Promise((resolve) => {
    const callback = (result) => {
      const lastError = chrome.runtime.lastError;
      if (lastError) {
        resolve({
          ok: false,
          error: lastError.message || "bridge_error",
        });
        return;
      }

      resolve(result ?? { ok: false, error: "missing_device" });
    };

    if (
      method === "getDeviceStatus" ||
      method === "requestEnrollmentChallenge" ||
      method === "clearEnrollment"
    ) {
      bridgeMethod(callback);
      return;
    }

    bridgeMethod(payload ?? {}, callback);
  });
}

async function openSidePanelFromAction(tab) {
  await configureDefaultSidePanel();
  await configureTabSidePanel(tab?.id);

  if (!chrome.sidePanel?.open || !Number.isInteger(tab?.windowId)) {
    return;
  }

  await chrome.sidePanel.open({ windowId: tab.windowId });
}

scheduleSidePanelInitialization();

chrome.runtime.onInstalled.addListener(scheduleSidePanelInitialization);
chrome.runtime.onStartup?.addListener(scheduleSidePanelInitialization);

chrome.action?.onClicked?.addListener((tab) => {
  openSidePanelFromAction(tab).catch((error) => {
    logSidePanelError("open side panel from toolbar action", error);
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (
    !isDeviceBridgeMessage(message) ||
    !isInternalExtensionPageSender(sender)
  ) {
    return false;
  }

  invokeDeviceBridge(message.method, message.payload)
    .then(sendResponse)
    .catch((error) => {
      sendResponse({
        ok: false,
        error: "bridge_error",
      });
      logSidePanelError("invoke device bridge", error);
    });
  return true;
});

chrome.tabs.onCreated.addListener((tab) => {
  configureTabSidePanel(tab.id).catch((error) => {
    logSidePanelError("configure side panel for new tab", error);
  });
});

chrome.tabs.onActivated.addListener(({ tabId }) => {
  configureTabSidePanel(tabId).catch((error) => {
    logSidePanelError("configure side panel for active tab", error);
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status !== "loading") {
    return;
  }

  configureTabSidePanel(tabId).catch((error) => {
    logSidePanelError("configure side panel for updated tab", error);
  });
});
