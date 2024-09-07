import { createSubscribable } from "@edsolater/fnkit"
import { deserializeData, serializeData } from "../utils/serialize"

/** 
 * all action should handle after mainThread connected
 */
function waveWithMainThread() {
  const isInnerJSReady = createSubscribable(false)
  isInnerJSReady.subscribe((isReady) => {
    if (isReady) {
      console.info("✨[content.js] inner js is ready")
      window.postMessage({
        command: "extension:cross-tab-speaker.status:ready",
      })
    }
  })
  window.addEventListener("message", ({ data: message }) => {
    if (message.command === "mainThread.status:ready") {
      console.log("[content.js] receive signal: main thread is ready")
      isInnerJSReady.set(true)
    }
  })
  // init message action
  Promise.resolve().then(() => {
    window.postMessage({
      command: "extension:cross-tab-speaker.status:ready",
    })
  })
  return isInnerJSReady
}

export function contentLogic() {
  const isMainThreadReady = waveWithMainThread()

  chrome.runtime.sendMessage({ command: "registerTabId" }, (response) => {
    if (response.status === "registered") {
      console.info("Tab id registered in background script")
    }
  })

  // receive message from background script
  chrome.runtime.onMessage.addListener(async (message) => {
    if (message?.command === "messageFromBackground") {
      console.info("[content.js] receive message from background: ", message?.data)
      const deserializedData = await deserializeData(message?.data)
      console.info("[content.js] deserializedData: ", deserializedData)
      window.postMessage({
        command: "extension:cross-tab-speaker.receive-message",
        from: message?.from.id,
        data: deserializedData,
      })
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
  console.log("✨[content.js] register onMessage event listener")
  window.addEventListener("message", ({ data: message }) => {
    if (message?.command === "extension:cross-tab-speaker.send-message") {
      console.log("[content.js] receive data: ", message.data)
      postToMessageToTab({ tabId: message.to?.tabId, data: message.data })
    }
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

async function postToMessageToTab(message: { tabId?: number; data: any }) {
  const serializedData = await serializeData(message.data)
  console.log("serializedData: ", serializedData)
  chrome.runtime.sendMessage(
    { command: "postMessageToTab", tabId: message.tabId, data: serializedData },
    (response) => {
      if (response.status === "success") {
        console.log("background: message has sent to tab")
      }
    },
  )
}
