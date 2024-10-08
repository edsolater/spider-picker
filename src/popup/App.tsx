import { Box, renderAsHTMLH1, Text } from "@edsolater/pivkit"

export default function App() {
  const useMethod = `
    window.postMessage({
      to: { tabId: 18782991 }, 
      command: "extension:cross-tab-speaker.send-message",
      data: "any JSON serializable data"
    })
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
