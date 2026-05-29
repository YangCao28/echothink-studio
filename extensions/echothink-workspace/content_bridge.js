const BRIDGE_CHANNEL = "echothink.workspace.bridge";
const BRIDGE_VERSION = "0.1.0";
const SIDE_PANEL_LOCAL_STATE_UPDATE_TYPE = "echothink.sidePanel.localState.update";
const ALLOWED_PAGE_ORIGINS = new Set([
  "https://app.echothink.ai",
  "https://auth.echothink.ai",
]);

function isBridgeRequest(value) {
  return (
    value &&
    typeof value === "object" &&
    value.channel === BRIDGE_CHANNEL &&
    value.type === "ping"
  );
}

function isLocalStateUpdate(value) {
  return (
    value &&
    typeof value === "object" &&
    value.channel === BRIDGE_CHANNEL &&
    value.type === "side_panel_state" &&
    value.payload
  );
}

window.addEventListener("message", (event) => {
  if (event.source !== window || !ALLOWED_PAGE_ORIGINS.has(event.origin)) {
    return;
  }

  if (isBridgeRequest(event.data)) {
    window.postMessage(
      {
        channel: BRIDGE_CHANNEL,
        type: "ready",
        version: BRIDGE_VERSION,
        capabilities: ["side_panel_state"],
      },
      event.origin,
    );
    return;
  }

  if (isLocalStateUpdate(event.data)) {
    chrome.runtime
      ?.sendMessage?.({
        type: SIDE_PANEL_LOCAL_STATE_UPDATE_TYPE,
        payload: event.data.payload,
      })
      ?.catch((error) => {
        console.warn("Unable to forward side panel state", error);
      });
  }
});
