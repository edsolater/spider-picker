
export function contentLogic() {
  chrome.runtime.sendMessage({ type: "register:tabId" }, (response) => {
    if (response.status === "registered") {
      console.info("Tab id registered in background script")
    }
  })

  Object.assign(window, { proxyPostPorter: portManager })
}

function postToMessageToTab(message: { url: string;  data: any }) {
  chrome.runtime.sendMessage(
    { type: "proxyPost:postToMessageToTab", url: message.url, data: message.data },
    (response) => {
      if (response.status === "success") {
        console.log("Message sent to tab")
      }
    },
  )
}

function addEventListenerForProxyPost(cb: (messageData: any) => void) {
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "proxyPost:postToMessageToTab") {
      message.data && cb(message.data)
    }
  })
}

const portManager = { postMessage: postToMessageToTab, addMessageListener: addEventListenerForProxyPost }
Object.assign(window, { proxyPostPorter: portManager })
