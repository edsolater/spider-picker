// Store tab ID and domain mapping
const tabInfos = new Map<string /* URL */, chrome.tabs.Tab>()

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type, command } = message
  console.log("receive message in background: ", message)
  if (type === "register") {
    // NOTE: no need registered, just `chrome.tabs.query` to get tab ids
    // Register the domain for the tab
    if (command === "registerTabId" && sender.tab?.id != null && sender.url != null) {
      tabInfos.set(sender.url, sender.tab)
      sendResponse({ status: "registered" })
      collectAllTabs()
    } else if (command === "unregisterTabId" && sender.url != null) {
      tabInfos.delete(sender.url)
      sendResponse({ status: "unregistered" })
      collectAllTabs()
    }
  } else if (type === "speak") {
    if (command === "postMessageToTab") {
      // send cross-tab message
      const tabInfo = tabInfos.get(message.url)
      if (tabInfo?.id != null) {
        sendResponse({ status: "success" })
        chrome.tabs.sendMessage(tabInfo.id, message.data)
      } else {
        console.error("Tab ID not found for URL: ", message.url, "maybe not registered yet")
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
      if (tab.url != null && tab.id != null) {
        tabInfos.set(tab.url, tab)
      }
    }
  })
}
