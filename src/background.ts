// // Store tab ID and domain mapping
// /**
//  * @type {Set<number>}
//  */
// let tabIds = new Set()
// let activeTabIds = new Set() // current only one active tab

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.type === "register:tabId") {
//     // Register the domain for the tab
//     if (sender.tab?.id != null) {
//       tabIds.add(sender.tab.id)
//       sendResponse({ status: "registered" })
//     }
//   } else if (message.type === "register:pageActivityChange") {
//     if (message.active) {
//       activeTabIds.add(sender.tab?.id)
//     } else {
//       activeTabIds.delete(sender.tab?.id)
//     }
//   }
// })

// // register Broadcast message(define in content.js) to all tabs
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.type === "broadcastRequest") {
//     // Broadcast message to all other tabs
//     for (const id of tabIds) {
//       if (id != null && id != sender.tab?.id) {
//         chrome.tabs.sendMessage(id, {
//           type: "message",
//           isBroadcast: true,
//           data: message.data,
//         })
//       }
//     }
//   }
// })

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
