import { html } from "htm/react";
import css from "./button.css" assert { type: "css" };

document.adoptedStyleSheets = [...document.adoptedStyleSheets, css];

export function Button() {
  const button = document.createElement("button");
  button.innerText = "Click Me";
  button.onclick = () => {
    confetti();
  };
  document.body.append(button);
}
