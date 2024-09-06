// Store tab ID and domain mapping
const tabInfos = new Map<number /* Tab id */, chrome.tabs.Tab>()

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("receive message in background: ", message)
  if (message.command === "registerTabId") {
    // NOTE: no need registered, just `chrome.tabs.query` to get tab ids
    // Register the domain for the tab
    if (sender.tab?.id != null) {
      tabInfos.set(sender.tab.id, sender.tab)
      sendResponse({ status: "registered" })
      updateAllTabInfos()
    }
  } else if (message.command === "unregisterTabId") {
    if (sender.tab?.id != null) {
      tabInfos.delete(sender.tab.id)
      sendResponse({ status: "unregistered" })
      updateAllTabInfos()
    }
  } else if (message.command === "postMessageToTab") {
    updateAllTabInfos()
    // send cross-tab message
    const tabInfo = tabInfos.has(message.tabId) ? tabInfos.get(message.tabId) : sender.tab
    const targetTabId = tabInfo?.id
    if (targetTabId != null) {
      sendResponse({ status: "success" })
      chrome.tabs.sendMessage(targetTabId, {
        command: "messageFromBackground",
        from: sender.tab,
        data: message.data,
      })
    } else {
      console.error("Tab ID not found for URL: ", targetTabId, "maybe not registered yet")
      sendResponse({ status: "error", message: "Tab ID not found for URL" })
    }
  } else if (message.command === "queryTabInfos") {
    console.log("load from background")
    // Get the current tab's domain
    updateAllTabInfos()
    sendResponse({ status: "success", data: { tabs: Array.from(tabInfos) } })
  }
})
function updateAllTabInfos() {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    for (const tab of tabs) {
      if (tab.id != null) {
        tabInfos.set(tab.id, tab)
      }
    }
  })
}
