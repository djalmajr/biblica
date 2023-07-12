import { Button, Space } from "antd";
import { html } from "htm/react";
import { useState } from "react";
import css from "./main.css" assert { type: "css" };

document.adoptedStyleSheets = [...document.adoptedStyleSheets, css];

export function Main() {
  const [counter, setCounter] = useState(500);

  return html`
    <div className="main__container">
      <h1>CrossBible</h1>
      <${Space} size="large">
        <${Button} onClick=${() => setCounter((s) => s - 1)}>-<//>
        <span>${counter}</span>
        <${Button} onClick=${() => setCounter((s) => s + 1)}>+<//>
      <//>
    </div>
  `;
}
