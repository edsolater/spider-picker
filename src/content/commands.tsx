import { isString } from "@edsolater/fnkit"
import { deserializeData, serializeData } from "../utils/serialize"

const currentWorkspace = `extension:${"cross-tab-speaker"}`

export function runContentLogicCode() {
  /**
   * get message from main page
   */
  window.addEventListener("message", async ({ data: message }) => {
    requestCommandToBackground(message)
  })

  /**
   * receive message from extension's background.js
   */
  chrome.runtime.onMessage.addListener(respondCommandFromBackground)
}

interface MessageItem {
  command: string // command of message (e.g. "respeak")
  status?: string // status of message (e.g. "success")
  data: any // message data
}

interface MessageSpeakerItem extends MessageItem {
  to?: { tabId?: number }
  command: `${typeof currentWorkspace}.${"send-message" | "receive-message" | "status:ready"}`
  data: any
}

async function respondCommandFromBackground(message: any) {
  const isFromBackground = message?.isBackgroundCommandResponse
  if (isFromBackground) {
    const deserializedData = await deserializeData(message.data)
    const backCommand = `__@back__${currentWorkspace}.${message.command}`
    console.log("[content.js] deserializ extension background's Data: ", deserializedData, backCommand)
    globalThis.postMessage({
      command: backCommand,
      data: deserializedData,
    })
  }
}

async function requestCommandToBackground(message: any) {
  const isMessageTowardsExtension = isString(message?.command) && message.command.startsWith(currentWorkspace)
  if (isMessageTowardsExtension) {
    console.log("[content.js] receive pageUI's message: ", message)
    const detailCommand = message?.command.slice((currentWorkspace + ".").length)
    const serializedData = await serializeData(message.data)
    console.log("[content.js] serialize pageUI's Data: ", serializedData)
    chrome.runtime.sendMessage({ command: detailCommand, data: serializedData }, (responseMessage) => {
      respondCommandFromBackground(responseMessage)
    })
  }
}
