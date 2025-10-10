// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserProvider } from "./contexts/userContext";
import { TranslationProvider } from "./contexts/translateContext";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <TranslationProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </TranslationProvider>
  </React.StrictMode>
   
    
);
