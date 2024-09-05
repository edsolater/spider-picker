import { Box, renderAsHTMLH1, Text } from "@edsolater/pivkit"

export default function App() {
  const useMethod = `
    window.postMessage({
      type: "extension:cross-tab-message",
      to: "https://github.com/edsolater"
      command: "predefined command in extension content.js",
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
