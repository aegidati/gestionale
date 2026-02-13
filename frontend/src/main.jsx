import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./auth/AuthProvider";
import { setupInterceptors } from "./api/setupInterceptors";
import { storage } from "./utils/storage";

// Logout “hard” se refresh fallisce
setupInterceptors(() => {
  storage.clearTokens();
  storage.clearActiveAccountId();
  window.location.href = "/login";
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
