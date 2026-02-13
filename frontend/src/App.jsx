import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import SelectAccount from "./pages/SelectAccount";
import Customers from "./pages/Customers";
import RequireAuth from "./auth/RequireAuth";
import RequireAccount from "./auth/RequireAccount";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/select-account"
          element={
            <RequireAuth>
              <SelectAccount />
            </RequireAuth>
          }
        />

        <Route
          path="/customers"
          element={
            <RequireAuth>
              <RequireAccount>
                <Customers />
              </RequireAccount>
            </RequireAuth>
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
