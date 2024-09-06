import { isObject } from "@edsolater/fnkit"
import { deserializeData, serializeData } from "../utils/serialize"

export function contentLogic() {
  chrome.runtime.sendMessage({ command: "registerTabId" }, (response) => {
    if (response.status === "registered") {
      console.info("Tab id registered in background script")
    }
  })

  // receive message from background script
  chrome.runtime.onMessage.addListener((message) => {
    if (isObject(message)) {
      const { command, data, from } = message as any
      if (command === "messageFromBackground") {
        window.postMessage({
          command: "extension:cross-tab-speaker.receive-message",
          from: from.id,
          data: deserializeData(data),
        })
      }
    }
  })

  // delete current tab id when tab is closed
  window.addEventListener("unload", () => {
    chrome.runtime.sendMessage({ command: "unregisterTabId" }, (response) => {
      if (response.status === "unregistered") {
        console.info("Tab id unregistered in background script")
      }
    })
  })

  // receive message from other tabs
  console.log("✨ register onMessage event listener")
  window.addEventListener("message", (event) => {
    if (!isObject(event.data)) return
    const { command, data, to } = event.data as MessageSpeakerItem
    if (command === "extension:cross-tab-speaker.send-message") {
      postToMessageToTab({ tabId: to?.tabId, data })
    }
  })
  window.postMessage({
    command: "extension:cross-tab-speaker.status:ready",
    data: "content script is ready",
  })
}

interface MessageItem {
  command: string // command of message (e.g. "respeak")
  status?: string // status of message (e.g. "success")
  data: any // message data
}

interface MessageSpeakerItem extends MessageItem {
  to?: { tabId?: number }
  command:
    | "extension:cross-tab-speaker.send-message"
    | "extension:cross-tab-speaker.receive-message"
    | "extension:cross-tab-speaker.status:ready"
  data: any
}

function postToMessageToTab(message: { tabId?: number; data: any }) {
  chrome.runtime.sendMessage(
    { command: "postMessageToTab", tabId: message.tabId, data: serializeData(message.data) },
    (response) => {
      if (response.status === "success") {
        console.log("background: message has sent to tab")
      }
    },
  )
}
