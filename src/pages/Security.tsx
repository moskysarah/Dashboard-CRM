import React, { useState } from "react";
import DashboardLayout from "../layouts/dashboardLayout";

// Types
type User = {
  id: number;
  name: string;
  phone: string;
  otp?: string;
};

type Log = {
  id: number;
  userId: number;
  action: string;
  details: string;
  createdAt: string;
};

// Simulations
let userIdCounter = 1;
let logIdCounter = 1;
const simulatedLogs: Log[] = [];
const simulatedUsers: User[] = [];

// Fonction pour générer OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const Security: React.FC = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>(simulatedUsers);
  const [logs, setLogs] = useState<Log[]>(simulatedLogs);

  // Créer un utilisateur et envoyer OTP
  const handleCreateUser = () => {
    if (!name || !phone) return alert("Nom et téléphone requis");
    const newUser: User = { id: userIdCounter++, name, phone, otp: generateOTP() };
    setUsers([newUser, ...users]);
    setLogs([{ id: logIdCounter++, userId: newUser.id, action: "create_user", details: `OTP ${newUser.otp} envoyé`, createdAt: new Date().toLocaleString() }, ...logs]);
    alert(`Utilisateur créé. OTP: ${newUser.otp}`);
    setName("");
    setPhone("");
  };

  // Vérifier OTP
  const handleVerifyOTP = () => {
    if (!selectedUserId) return alert("Sélectionner un utilisateur");
    const user = users.find(u => u.id === selectedUserId);
    if (!user) return alert("Utilisateur introuvable");
    if (user.otp === otp) {
      setLogs([{ id: logIdCounter++, userId: user.id, action: "verify_otp", details: "OTP validé", createdAt: new Date().toLocaleString() }, ...logs]);
      alert("OTP validé avec succès !");
      user.otp = undefined;
      setOtp("");
    } else {
      alert("OTP invalide");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Sécurité</h1>

        {/* Création utilisateur */}
        <div className="mb-8 p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold mb-4">Créer un utilisateur</h2>
          <div className="flex gap-4 mb-2">
            <input
              className="p-2 border rounded flex-1"
              type="text"
              placeholder="Nom"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              className="p-2 border rounded flex-1"
              type="text"
              placeholder="Téléphone"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleCreateUser}>
              Créer & Envoyer OTP
            </button>
          </div>
        </div>

        {/* Vérification OTP */}
        <div className="mb-8 p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold mb-4">Vérifier OTP</h2>
          <div className="flex gap-4 mb-2">
            <select
              className="p-2 border rounded flex-1"
              value={selectedUserId ?? ""}
              onChange={e => setSelectedUserId(Number(e.target.value))}
            >
              <option value="">Sélectionner un utilisateur</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.phone})
                </option>
              ))}
            </select>
            <input
              className="p-2 border rounded flex-1"
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
            />
            <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleVerifyOTP}>
              Vérifier
            </button>
          </div>
        </div>

        {/* Logs */}
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold mb-4">Logs récents</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-200">
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Utilisateur</th>
                <th className="py-2 px-4 text-left">Action</th>
                <th className="py-2 px-4 text-left">Détails</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => {
                const user = users.find(u => u.id === log.userId);
                return (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{log.createdAt}</td>
                    <td className="py-2 px-4">{user?.name ?? "Inconnu"}</td>
                    <td className="py-2 px-4">{log.action}</td>
                    <td className="py-2 px-4">{log.details}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Security;
