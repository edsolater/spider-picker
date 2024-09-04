import { createSubscribable, setItem } from "@edsolater/fnkit"
import { Box, Button, List, useSubscribable, Text } from "@edsolater/pivkit"
import { createEffect } from "solid-js"

const defaultRecords = new Map<string, { url: string; title: string }>()
const recordsS = createSubscribable(defaultRecords)

export default function App() {
  function runCommandRequestActiveTabCurrentDomain() {
    chrome.runtime.sendMessage({ type: "command:requestActiveTabCurrentDomain" }, (response) => {
      if (response?.currentUrl && response?.title) {
        recordsS.set((prev) => setItem(prev, response.currentUrl, { url: response.currentUrl, title: response.title }))
      }
    })
  }
  const [records] = useSubscribable(recordsS)
  createEffect(() => {
    console.log("records(): ", records())
  })
  return (
    <div>
      <Button onClick={runCommandRequestActiveTabCurrentDomain}>Record Url</Button>

      <List items={records}>
        {([, record]) => (
          <Box>
            <Text icss={{ fontSize: "1.4em" }}>{record.url.slice(0, 12)}</Text>
            <Text>{record.title}</Text>
          </Box>
        )}
      </List>
    </div>
  )
}
