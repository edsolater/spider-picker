import { createEffect, onMount } from "solid-js"
import { contentLogic } from "./retransformMessage"
import { useWaveWithMainThread } from "./useWaveWithMainThread"
import { Box, Group, Panel, Text } from "@edsolater/pivkit"

export default function App() {
  const { isMainReady, isExtensionReady } = useWaveWithMainThread()

  onMount(() => {
    contentLogic()
  })

  createEffect(() => {
    console.log("[extension:Cross-Tab-Speaker] isReady: ", isExtensionReady())
  })

  createEffect(() => {
    console.log("[extension:Cross-Tab-Speaker] isMainReady: ", isMainReady())
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
        <StatusDot isReady={isExtensionReady()} />
        <Text>is extension ready</Text>
      </Group>
      <Group icss={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
        <StatusDot isReady={isMainReady()} />
        <Text>main thread has shake hand</Text>
      </Group>
    </Panel>
  )
}
function StatusDot({ isReady }: { isReady: boolean }) {
  return (
    <Box icss={{ width: ".5rem", height: ".5rem", borderRadius: "50%", backgroundColor: isReady ? "green" : "gray" }} />
  )
}
