import { isString, switchCase } from "@edsolater/fnkit"
import { getIDBScreenshot, getIDBStoreValue, setIDBStoreValue } from "@edsolater/pivkit"

// Store tab ID and domain mapping
const tabInfos = new Map<number /* Tab id */, chrome.tabs.Tab>()

// listen message from Content
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const correspondingActionReturnValue = switchCase<
    string,
    true /*  when return ture, extension's sendResponse can be async */ | void
  >(message.command, {
    queryTabInfos: () => {
      chrome.tabs.query({ currentWindow: true }, (tabs) => {
        sendResponse({ status: "success", data: { tabs: Array.from(tabInfos) } })
      })
    },

    // upload page's indexedDB screenshot to extension cache store
    saveScreenshot: () => {
      const { key, screenshot } = message.data
      if (isString(key) && screenshot) {
        setIDBStoreValue({ dbName: "cached-data", storeName: "idb-screenshot" }, key, screenshot).then(() => {
          console.log("[background.js] key, screenshot: ", key, screenshot)
          chrome.tabs.sendMessage(sender.tab?.id ?? 0, {
            command: "saveScreenshot",
            isBackgroundCommandResponse: false,
            state: { status: "success" },
          })
        })
        sendResponse({ status: "ongoing" })
      }
    },

    loadScreenshot: () => {
      const { key } = message.data
      if (isString(key)) {
        const cachedScreenshot = getIDBStoreValue({ dbName: "cached-data", storeName: "idb-screenshot" }, key)
        cachedScreenshot.then((screenshot) => {
          console.log("load screenshot from cache: ", key)
          chrome.tabs.sendMessage(sender.tab?.id ?? 0, {
            command: "loadScreenshot",
            isBackgroundCommandResponse: true,
            data: screenshot,
          })
        })
        sendResponse({ status: "ongoing" })
      }
    },
  })

  return correspondingActionReturnValue
})