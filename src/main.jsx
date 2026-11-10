import "./styles/tokens.css";
import "./styles/base.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { PreferenciasProvider } from "./context/PreferenciasContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PreferenciasProvider>
      <App />
    </PreferenciasProvider>
  </StrictMode>,
);
