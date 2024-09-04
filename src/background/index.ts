
// Store tab ID and domain mapping
const tabIds = new Map<string /* URL */, number | undefined>()

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const [type, command] = message.type.split(":")
  if (type === "register") {
    // Register the domain for the tab
    if (command === "tabId" && sender.tab?.id != null && sender.url != null) {
      tabIds.set(sender.url, sender.tab.id)
      sendResponse({ status: "registered" })
    }
  }
  if (type === "proxyPost") {
    if (command === "postToMessageToTab") {
      const targetTabId = tabIds.get(message.url)
      if (targetTabId != null) {
        sendResponse({ status: "success" })
        chrome.tabs.sendMessage(targetTabId, message.data)
      } else {
        console.error("Tab ID not found for URL: ", message.url, "maybe not registered yet")
        sendResponse({ status: "error", message: "Tab ID not found for URL" })
      }
    }
  }
})

// register Broadcast message(define in content.js) to all tabs
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {})

// background.js request activeTab
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "command:requestActiveTabCurrentDomain") {
    console.log("load from background")
    // Get the current tab's domain
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const tab = tabs[0]
        if (tab.id != null) {
          chrome.tabs.sendMessage(tab.id, { type: "command:requestActiveTabCurrentDomain" }, (response) => {
            sendResponse(response)
          })
        }
      }
    })
    return true
  }
})
