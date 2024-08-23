// // Register the current tab's domain with the background script
// chrome.runtime.sendMessage({ type: "register:tabId" }, (response) => {
//   if (response.status === "registered") {
//     console.log("Tab id registered in background script")
//   }
// })

// // Listen for visibility change events
// document.addEventListener("visibilitychange", () => {
//   // Notify background script when the page becomes inactive
//   chrome.runtime.sendMessage({ type: "register:pageActivityChange", active: document.hidden }, (response) => {
//     if (response.status === "notified") {
//       console.log("Background script notified of page activity change")
//     }
//   })
// })

// Listen for messages from other tabs
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "command:requestActiveTabCurrentDomain") {
    sendResponse({ currentUrl: window.location.href, title: document.title })
  }
})
