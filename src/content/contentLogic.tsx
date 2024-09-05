import { isObject } from "@edsolater/fnkit"

export function contentLogic() {
  chrome.runtime.sendMessage({ type: "register", command: "registerTabId" }, (response) => {
    if (response.status === "registered") {
      console.info("Tab id registered in background script")
    }
  })

  // delete current tab id when tab is closed
  window.addEventListener("unload", () => {
    chrome.runtime.sendMessage({ type: "register", command: "unregisterTabId" }, (response) => {
      if (response.status === "unregistered") {
        console.info("Tab id unregistered in background script")
      }
    })
  })

  window.addEventListener("message", (event) => {
    if (!isObject(event.data)) return
    const { command, type, data, to } = event.data as any
    if (type === "extension:cross-tab-speaker") {
      postToMessageToTab({ url: to, data })
    }
  })

}

function postToMessageToTab(message: { url: string; data: any }) {
  chrome.runtime.sendMessage(
    { type: "speak", command: "postMessageToTab", url: message.url, data: message.data },
    (response) => {
      if (response.status === "success") {
        console.log("Message sent to tab")
      }
    },
  )
}

function addEventListenerForProxyPost(cb: (messageData: any) => void) {
  const callback: (
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void,
  ) => void = (message) => {
    if (message.type === "proxyPost:postToMessageToTab") {
      message.data && cb(message.data)
    }
  }
  chrome.runtime.onMessage.addListener(callback)
  return { removeListener: () => chrome.runtime.onMessage.removeListener(callback) }
}
