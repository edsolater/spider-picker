// Store tab ID and domain mapping
const tabInfos = new Map<number /* Tab id */, chrome.tabs.Tab>()

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type, command } = message
  console.log("receive message in background: ", message)
  if (type === "register") {
    // NOTE: no need registered, just `chrome.tabs.query` to get tab ids
    // Register the domain for the tab
    if (command === "registerTabId" && sender.tab?.id != null) {
      tabInfos.set(sender.tab.id, sender.tab)
      sendResponse({ status: "registered" })
      collectAllTabs()
    } else if (command === "unregisterTabId" && sender.tab?.id != null) {
      tabInfos.delete(sender.tab.id)
      sendResponse({ status: "unregistered" })
      collectAllTabs()
    }
  } else if (type === "speak") {
    if (command === "postMessageToTab") {
      // send cross-tab message
      const tabInfo = tabInfos.get(message.tabId)
      if (tabInfo?.id != null) {
        sendResponse({ status: "success" })
        chrome.tabs.sendMessage(tabInfo.id, message.data)
      } else {
        console.error("Tab ID not found for URL: ", message.tabId, "maybe not registered yet")
        sendResponse({ status: "error", message: "Tab ID not found for URL" })
      }
    }
  } else if (type === "sidebarQuery") {
    if (command === "queryTabInfos") {
      console.log("load from background")
      // Get the current tab's domain
      collectAllTabs()
      sendResponse({ status: "success", data: { tabs: Array.from(tabInfos) } })
    }
  }
})
function collectAllTabs() {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    for (const tab of tabs) {
      if (tab.id != null) {
        tabInfos.set(tab.id, tab)
      }
    }
  })
}
