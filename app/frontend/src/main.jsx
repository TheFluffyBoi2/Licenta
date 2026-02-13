import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "nprogress/nprogress.css";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider
    clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
    language="en"
  >
    <StrictMode>
      <App />
    </StrictMode>
  </GoogleOAuthProvider>,
);
