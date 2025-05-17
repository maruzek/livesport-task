import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
//@ts-expect-error fontsource doesn't have types
import "@fontsource-variable/inter";
//@ts-expect-error fontsource doesn't have types
import "@fontsource-variable/tektur";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
