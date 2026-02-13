const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";
const ACCOUNT_KEY = "active_account_id";

export const storage = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  setAccess: (t) => localStorage.setItem(ACCESS_KEY, t),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  setRefresh: (t) => localStorage.setItem(REFRESH_KEY, t),
  clearTokens: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },

  getActiveAccountId: () => localStorage.getItem(ACCOUNT_KEY),
  setActiveAccountId: (id) => localStorage.setItem(ACCOUNT_KEY, String(id)),
  clearActiveAccountId: () => localStorage.removeItem(ACCOUNT_KEY),
};
