import reset from "antd/dist/reset.css" assert { type: "css" };
import { html } from "htm/react";
import { createRoot } from "react-dom/client";
import { Main } from "~/layout/main.js";

document.adoptedStyleSheets = [...document.adoptedStyleSheets, reset];

createRoot(document.body).render(html`<${Main} />`);
