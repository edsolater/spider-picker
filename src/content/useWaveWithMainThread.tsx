import { createSubscribable } from "@edsolater/fnkit"
import { useSubscribable } from "@edsolater/pivkit"

/**
 * all action should handle after mainThread connected
 */
function waveWithMainThread() {
  const isMainThreadJSReady = createSubscribable(false)
  const isExtensionJSReady = createSubscribable(false)
  isMainThreadJSReady.subscribe((isReady) => {
    if (isReady) {
      console.info("✨[content.js] inner js is ready")
      window.postMessage({
        command: "extension:cross-tab-speaker.status:ready",
      })
    }
  })
  window.addEventListener("message", ({ data: message }) => {
    if (message.command === "mainThread.status:ready") {
      console.log("[content.js] receive signal: main thread is ready")
      isMainThreadJSReady.set(true)
    }
  })
  // init message action
  Promise.resolve().then(() => {
    window.postMessage({
      command: "extension:cross-tab-speaker.status:ready",
    })
    isExtensionJSReady.set(true)
  })
  return { isMainReady: isMainThreadJSReady, isExtensionReady: isExtensionJSReady }
}

export const useWaveWithMainThread = () => {
  const { isMainReady, isExtensionReady } = waveWithMainThread()
  const [isMainThreadReady] = useSubscribable(isMainReady)
  const [isExtensionJSReady] = useSubscribable(isExtensionReady)
  return { isMainReady: isMainThreadReady, isExtensionReady: isExtensionJSReady }
}
