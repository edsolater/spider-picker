import { Box, renderAsHTMLH1, Text } from "@edsolater/pivkit"

export default function App() {
  const useMethod = `
async function saveScreenshotToExtension() {
  const indexedDBData = await getIDBScreenshot({ dbName: "daily-schedule" })
  console.log("send screenshot to extension", indexedDBData)
  globalThis.postMessage({
    command: "extension:cross-tab-speaker.saveScreenshot",
    data: { key: "daily-schedule-screenshot", screenshot: indexedDBData },
  })
}

/**
 *  fetch screenshot from extension:cross-tab-speaker
 */
async function getScreenshotFromExtension() {
  globalThis.postMessage({
    command: "extension:cross-tab-speaker.loadScreenshot",
    data: { key: "daily-schedule-screenshot" },
  })

  listenDomEvent(globalThis.window, "message", ({ ev: { data: message }, abortListener }) => {
    if (message?.command === "__@back__extension:cross-tab-speaker.loadScreenshot") {
      console.log("receive message.data from extension: ", message.data)
      setIDBFromScreenshot({ dbName: "daily-schedule" }, message.data)
      abortListener()
    }
  })
}
  `
  return (
    <div>
      <Text as={renderAsHTMLH1} icss={{ display: "inline-block", fontSize: "1.8em", fontWeight: "bold" }}>
        HOW TO USE?
      </Text>
      <Box class="code-box" icss={{ padding: ".25rem .5rem", background: "#292C33", borderRadius: "8px" }}>
        <Text icss={{ whiteSpace: "pre-wrap", color: "lightblue" }}>{useMethod}</Text>
      </Box>
    </div>
  )
}
