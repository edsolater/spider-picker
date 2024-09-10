import { render } from "solid-js/web"
import App from "./App"

const root = document.createElement("div")
root.id = "crx-spider-picker-content-root"
document.body.append(root)

render(() => <App />, root)
