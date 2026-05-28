const BRIDGE_CHANNEL = "echothink.workspace.bridge";
const BRIDGE_VERSION = "0.1.0";
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

window.addEventListener("message", (event) => {
  if (
    event.source !== window ||
    !ALLOWED_PAGE_ORIGINS.has(event.origin) ||
    !isBridgeRequest(event.data)
  ) {
    return;
  }

  window.postMessage(
    {
      channel: BRIDGE_CHANNEL,
      type: "ready",
      version: BRIDGE_VERSION,
      capabilities: [],
    },
    event.origin,
  );
});
