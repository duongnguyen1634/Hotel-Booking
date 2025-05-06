import React from "react";
import ReactDOM from "react-dom/client";
import "flowbite";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./pages/SSO/Login/authContext";
import { Flowbite } from "flowbite-react";
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <Flowbite>
      <AuthProvider>
          <App />
        
      </AuthProvider>
    </Flowbite>
  </React.StrictMode>
);
