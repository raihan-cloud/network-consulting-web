"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import {
  deleteContact,
  updateContactStatus,
} from "@/lib/contactService";

type ContactStatus = "new" | "contacted" | "closed";

type ContactMessage = {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  serviceType: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt?: any;
};

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadContacts() {
    try {
      setLoading(true);

      const q = query(
        collection(db, "contacts"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as ContactMessage[];

      setContacts(data);
    } catch (error) {
      console.error("LOAD CONTACTS ERROR:", error);
      alert("Gagal memuat pesan contact.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContacts();
  }, []);

  const handleUpdateStatus = async (
    contactId: string,
    status: ContactStatus
  ) => {
    try {
      setUpdatingId(contactId);

      await updateContactStatus(contactId, status);
      await loadContacts();

      alert(`Status contact berhasil diubah menjadi ${status}.`);
    } catch (error) {
      console.error("UPDATE CONTACT ERROR:", error);
      alert("Gagal mengubah status contact.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (contactId: string) => {
    const confirmDelete = confirm(
      "Yakin ingin menghapus pesan contact ini?"
    );

    if (!confirmDelete) return;

    try {
      setUpdatingId(contactId);

      await deleteContact(contactId);
      await loadContacts();

      alert("Pesan contact berhasil dihapus.");
    } catch (error) {
      console.error("DELETE CONTACT ERROR:", error);
      alert("Gagal menghapus pesan contact.");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp?.seconds) return "-";

    return new Date(timestamp.seconds * 1000).toLocaleDateString(
      "id-ID",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getWhatsAppUrl = (phone: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");

    if (cleanPhone.startsWith("0")) {
      return `https://wa.me/62${cleanPhone.slice(1)}`;
    }

    return `https://wa.me/${cleanPhone}`;
  };

  return (
    <section className="admin-content">
      <div className="admin-page-header">
        <div>
          <span>Contacts</span>
          <h1>Contact Messages</h1>
        </div>

        <button
          className="btn btn-warning"
          onClick={loadContacts}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="admin-table-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Sender</th>
                <th>Service</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Status</th>
                <th>Date</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8}>Loading messages...</td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={8}>Belum ada pesan contact.</td>
                </tr>
              ) : (
                contacts.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>#{item.id.slice(0, 8)}</strong>
                    </td>

                    <td>
                      <strong>{item.name}</strong>
                      <br />
                      <small>{item.email}</small>
                      <br />
                      <small>{item.whatsapp}</small>
                    </td>

                    <td>{item.serviceType}</td>

                    <td>{item.subject}</td>

                    <td>{item.message}</td>

                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={item.status}
                        disabled={updatingId === item.id}
                        onChange={(e) =>
                          handleUpdateStatus(
                            item.id,
                            e.target.value as ContactStatus
                          )
                        }
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>

                    <td>{formatDate(item.createdAt)}</td>

                    <td className="text-end">
                      <a
                        href={getWhatsAppUrl(item.whatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary btn-sm me-2"
                      >
                        WhatsApp
                      </a>

                      <button
                        className="btn btn-outline-danger btn-sm"
                        disabled={updatingId === item.id}
                        onClick={() => handleDelete(item.id)}
                      >
                        {updatingId === item.id ? "..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}