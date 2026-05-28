const SIDE_PANEL_PATH = "sidepanel.html";

async function configureSidePanel(tabId) {
  if (!chrome.sidePanel?.setOptions || typeof tabId !== "number") {
    return;
  }

  await chrome.sidePanel.setOptions({
    tabId,
    path: SIDE_PANEL_PATH,
    enabled: true,
  });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel
    ?.setPanelBehavior?.({ openPanelOnActionClick: true })
    ?.catch((error) => {
      console.warn("Unable to set side panel action behavior", error);
    });
});

chrome.tabs.onActivated.addListener(({ tabId }) => {
  configureSidePanel(tabId).catch((error) => {
    console.warn("Unable to configure side panel for active tab", error);
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status !== "loading") {
    return;
  }

  configureSidePanel(tabId).catch((error) => {
    console.warn("Unable to configure side panel for updated tab", error);
  });
});
