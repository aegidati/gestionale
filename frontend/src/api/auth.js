import { api, apiPlain } from "./client";

export async function login(username, password) {
  const res = await api.post("/api/token/", { username, password });
  return res.data; // { access, refresh }
}

export async function getMyAccounts() {
  const res = await api.get("/api/accounts/");
  return res.data;
}

export async function refreshAccess(refresh) {
  const res = await apiPlain.post("/api/token/refresh/", { refresh });
  return res.data; // { access }
}

