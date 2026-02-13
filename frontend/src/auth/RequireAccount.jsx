import { Navigate } from "react-router-dom";
import { storage } from "../utils/storage";

export default function RequireAccount({ children }) {
  const accountId = storage.getActiveAccountId();
  if (!accountId) return <Navigate to="/select-account" replace />;
  return children;
}
