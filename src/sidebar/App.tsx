import { createSubscribable } from "@edsolater/fnkit"

const defaultRecords = [] as { url: string; title: string }[]
const records = createSubscribable(defaultRecords)

export default function App() {
  records.subscribe((records) => {
    console.log("records: ", records)
  })
  function hostCommandRequestActiveTabCurrentDomain() {
    chrome.runtime.sendMessage({ type: "command:requestActiveTabCurrentDomain" }, (response) => {
      if (response?.currentUrl && response?.title) {
        records.set((prev) => [...(prev ?? []), { url: response.currentUrl, title: response.title }])
      }
    })
  }
  return (
    <div>
      <button id="update" onClick={hostCommandRequestActiveTabCurrentDomain}>
        Update
      </button>
    </div>
  )
}
