import React, { useState } from "react";
import DashboardLayout from "../layouts/dashboardLayout";
import api from "../services/api"; // Mon axios global 

const Security: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  // Envoyer OTP via API
  const handleSendOTP = async () => {
    if (!phone) return alert("Téléphone requis");
    try {
      const res = await api.post("/smart/send-otp", { phone });
      alert(res.data.message || "OTP envoyé !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l’envoi de l’OTP");
    }
  };

  // Vérifie OTP via API
  const handleVerifyOTP = async () => {
    if (!otp || !phone) return alert("Téléphone et OTP requis");
    try {
      const res = await api.post("/smart/verify-otp", { phone, otp });
      alert(res.data.message || "OTP validé avec succès !");
    } catch (err) {
      console.error(err);
      alert("OTP invalide ou erreur serveur");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Sécurité</h1>

        {/* Envoyer OTP */}
        <div className="mb-8 p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold mb-4">Envoyer OTP</h2>
          <div className="flex gap-4 mb-2">
            <input
              className="p-2 border rounded flex-1"
              type="text"
              placeholder="Téléphone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={handleSendOTP}
            >
              Envoyer OTP
            </button>
          </div>
        </div>

        {/* Vérifie OTP */}
        <div className="mb-8 p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold mb-4">Vérifier OTP</h2>
          <div className="flex gap-4 mb-2">
            <input
              className="p-2 border rounded flex-1"
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={handleVerifyOTP}
            >
              Vérifier
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Security;
