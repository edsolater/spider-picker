import { createSubscribable, isMap } from "@edsolater/fnkit"
import { Box, List, Text, useSubscribable } from "@edsolater/pivkit"
import { onMount } from "solid-js"

const recordsS = createSubscribable(new Map<string, chrome.tabs.Tab>())

export default function App() {
  onMount(() => {
    chrome.runtime.sendMessage({ type: "sidebarQuery", command: "queryTabInfos" }, (response) => {
      if (response.status === "success") {
        const tabInfos = response.data.tabs as Map<string, chrome.tabs.Tab>
        console.log("tabInfos: ", isMap(tabInfos), response)
        recordsS.set(tabInfos)
      }
    })
  })

  const [records] = useSubscribable(recordsS)
  return (
    <div>
      <List items={records} icss={{ display:'flex', flexDirection:'column', gap:'.25em'}}>
        {([, record]) => (
          <Box icss={{ display: "flex", gap: ".2rem" }}>
            <Text icss={{fontWeight:'700'}}>{record.title?.slice(0, 30)}</Text>
            <Text>{record.id}</Text>
          </Box>
        )}
      </List>
    </div>
  )
}
