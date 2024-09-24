import { Box, Group, Panel, Text } from "@edsolater/pivkit"
import { onMount } from "solid-js"
import { runContentLogicCode } from "./commands"

export default function App() {
  onMount(() => {
    runContentLogicCode()
  })

  return (
    <Panel
      icss={{
        padding: ".25rem 1rem",
        width: "18rem",
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        border: "solid max(1px, 0.0625rem)",
        borderRadius: ".375rem",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: "0",
          background: "currentcolor",
          filter: "invert(1)",
          borderRadius: "inherit",
          zIndex: -1,
        },
      }}
    >
      <Group icss={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
        <Text>is extension ready</Text>
      </Group>
    </Panel>
  )
}
function StatusDot({ isReady }: { isReady: boolean }) {
  return (
    <Box icss={{ width: ".5rem", height: ".5rem", borderRadius: "50%", backgroundColor: isReady ? "green" : "gray" }} />
  )
}
