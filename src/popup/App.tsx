import type { Component } from "solid-js"

import styles from "./App.module.css"

const App: Component = () => {
  return (
    <div class={styles.App}>
      <header class={styles.header} style={{ width: "30rem", height: "40rem" }}>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>hello world2</p>
        <a class={styles.link} href="https://github.com/solidjs/solid" target="_blank" rel="noopener noreferrer">
          Learn Solid
        </a>
      </header>
    </div>
  )
}

export default App
