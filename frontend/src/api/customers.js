import { api } from "./client";

export async function listCustomers(accountId) {
  const res = await api.get(`/api/accounts/${accountId}/customers/`);
  return res.data;
}

export async function createCustomer(accountId, payload) {
  const res = await api.post(`/api/accounts/${accountId}/customers/`, payload);
  return res.data;
}

export async function updateCustomer(accountId, customerId, payload) {
  const res = await api.patch(`/api/accounts/${accountId}/customers/${customerId}/`, payload);
  return res.data;
}

export async function deleteCustomer(accountId, customerId) {
  await api.delete(`/api/accounts/${accountId}/customers/${customerId}/`);
}
