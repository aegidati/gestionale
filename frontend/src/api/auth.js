import { api } from "./client";

export async function login(username, password) {
  const res = await api.post("/api/token/", { username, password });
  return res.data; // { access, refresh }
}

export async function getMyAccounts() {
  const res = await api.get("/api/accounts/");
  return res.data;
}
