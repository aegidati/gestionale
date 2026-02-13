import { createContext, useContext, useState } from "react";
import { storage } from "../utils/storage";
import { login as loginApi } from "../api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!storage.getAccess()
  );

  async function login(username, password) {
    const data = await loginApi(username, password);
    storage.setAccess(data.access);
    storage.setRefresh(data.refresh);
    setIsAuthenticated(true);
  }

  function logout() {
    storage.clearTokens();
    storage.clearActiveAccountId();
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
