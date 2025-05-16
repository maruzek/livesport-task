import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/inter";
import "@fontsource-variable/tektur";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
