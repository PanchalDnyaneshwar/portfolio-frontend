import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function AdminContacts() {
  const { API_URL, authHeaders, showToast } = useOutletContext();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/admin/contacts`, {
        headers: authHeaders,
      });
      const data = await res.json();
      setContacts(data.data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const deleteContact = async (id) => {
    if (!confirm("Delete this message?")) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/contacts/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const data = await res.json();
      if (!data.success) throw new Error();
      showToast("Message deleted");
      fetchContacts();
    } catch (err) {
      console.error(err);
      showToast("Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Contact Messages</h2>
      </div>

      {loading && <p className="text-xs text-gray-400">Loading...</p>}

      <div className="grid gap-3">
        {contacts.map((c) => (
          <div
            key={c.id}
            className="bg-dark-200 rounded-xl p-4 border border-dark-100 text-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-white">
                  {c.name}{" "}
                  <span className="text-gray-400 text-[11px]">
                    &lt;{c.email}&gt;
                  </span>
                </p>
                <p className="text-purple text-xs mt-1">{c.subject}</p>
              </div>
              <button
                onClick={() => deleteContact(c.id)}
                className="text-xs text-red-300 hover:text-red-200"
              >
                Delete
              </button>
            </div>

            <p className="text-gray-300 text-xs mt-2 whitespace-pre-line">
              {c.message}
            </p>
            <p className="text-gray-500 text-[10px] mt-1">
              {c.created_at
                ? new Date(c.created_at).toLocaleString()
                : ""}
            </p>
          </div>
        ))}
        {!loading && contacts.length === 0 && (
          <p className="text-xs text-gray-400">No messages yet.</p>
        )}
      </div>
    </div>
  );
}
