import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "../utils/storage";
import { listCustomers, createCustomer, deleteCustomer, updateCustomer } from "../api/customers";
import { useAuth } from "../auth/AuthProvider";

export default function Customers() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const accountId = storage.getActiveAccountId();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [error, setError] = useState(null);

  // semplice stato per edit inline
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await listCustomers(accountId);
      setCustomers(data);
    } catch (e) {
      setError("Failed to load customers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);

  async function handleCreate(e) {
    e.preventDefault();
    setError(null);

    try {
      await createCustomer(accountId, { name: name.trim(), email: email.trim() || null });
      setName("");
      setEmail("");
      await load();
    } catch (e) {
      // se sei MEMBER e non ADMIN/OWNER, qui prenderai 403
      setError("Create failed (check role permissions)");
    }
  }

  async function handleDelete(id) {
    setError(null);
    try {
      await deleteCustomer(accountId, id);
      await load();
    } catch (e) {
      setError("Delete failed (check role permissions)");
    }
  }

  function startEdit(c) {
    setEditingId(c.id);
    setEditName(c.name || "");
    setEditEmail(c.email || "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditEmail("");
  }

  async function saveEdit(id) {
    setError(null);
    try {
      await updateCustomer(accountId, id, {
        name: editName.trim(),
        email: editEmail.trim() || null,
      });
      cancelEdit();
      await load();
    } catch (e) {
      setError("Update failed (check role permissions)");
    }
  }

  function changeAccount() {
    storage.clearActiveAccountId();
    navigate("/select-account");
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Customers</h2>

      <div style={{ marginBottom: 12 }}>
        <button onClick={changeAccount}>Change account</button>{" "}
        <button onClick={logout}>Logout</button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <b>Active account:</b> {accountId}
      </div>

      {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}

      <form onSubmit={handleCreate} style={{ marginBottom: 20 }}>
        <div>
          <input
            placeholder="Customer name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: 8 }}>
          <input
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={{ marginTop: 8 }}>
          <button type="submit">Create</button>
        </div>
      </form>

      {loading ? (
        <div>Loading...</div>
      ) : customers.length === 0 ? (
        <div>No customers yet.</div>
      ) : (
        <ul>
          {customers.map((c) => (
            <li key={c.id} style={{ marginBottom: 10 }}>
              {editingId === c.id ? (
                <div>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <input
                    style={{ marginLeft: 8 }}
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="email"
                  />
                  <button style={{ marginLeft: 8 }} onClick={() => saveEdit(c.id)}>
                    Save
                  </button>
                  <button style={{ marginLeft: 6 }} onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <b>{c.name}</b> {c.email ? `(${c.email})` : ""}{" "}
                  <button onClick={() => startEdit(c)}>Edit</button>{" "}
                  <button onClick={() => handleDelete(c.id)}>Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
