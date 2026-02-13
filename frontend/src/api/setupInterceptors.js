import { api } from "./client";
import { refreshAccess } from "./auth";
import { storage } from "../utils/storage";

// evita refresh multipli in parallelo
let isRefreshing = false;
let pendingQueue = [];

function processQueue(error, token = null) {
  pendingQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  pendingQueue = [];
}

export function setupInterceptors(onLogout) {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error.config;

      // Se non c'è response (network/cors ecc.)
      if (!error.response) {
        return Promise.reject(error);
      }

      // Se è 401 e non abbiamo già ritentato
      if (error.response.status === 401 && !original._retry) {
        original._retry = true;

        const refresh = storage.getRefresh();
        if (!refresh) {
          onLogout?.();
          return Promise.reject(error);
        }

        // Se un refresh è già in corso, metti in coda questa request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            pendingQueue.push({ resolve, reject });
          }).then((newToken) => {
            original.headers.Authorization = `Bearer ${newToken}`;
            return api(original);
          });
        }

        isRefreshing = true;

        try {
          const data = await refreshAccess(refresh);
          storage.setAccess(data.access);

          processQueue(null, data.access);

          // ritenta la request originale col token nuovo
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          onLogout?.();
          return Promise.reject(refreshErr);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
}
