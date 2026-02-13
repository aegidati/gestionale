import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyAccounts } from "../api/auth";
import { storage } from "../utils/storage";
import { useAuth } from "../auth/AuthProvider";

export default function SelectAccount() {
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    async function load() {
      const data = await getMyAccounts();
      setAccounts(data);
    }
    load();
  }, []);

  function selectAccount(id) {
    storage.setActiveAccountId(id);
    navigate("/customers");
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Select Account</h2>

      <button onClick={logout}>Logout</button>

      <ul style={{ marginTop: 20 }}>
        {accounts.map((acc) => (
          <li key={acc.id}>
            <button onClick={() => selectAccount(acc.id)}>
              {acc.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
