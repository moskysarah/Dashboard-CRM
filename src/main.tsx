// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserProvider } from "./contexts/userContext.tsx";
import { TranslateProvider } from "./contexts/translateContext.tsx";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <UserProvider>
      <TranslateProvider>
        <App />
      </TranslateProvider>
    </UserProvider>
  </React.StrictMode>
);
