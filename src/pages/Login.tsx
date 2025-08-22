// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import otpImage from "../assets/girl-showing-phone.png";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Vérification rapide via ton backend
    if (phone && password) {
      setShowOtp(true); // ici j'affiche le champ OTP après  le login
    } else {
      alert("Veuillez entrer un numéro et un mot de passe valides.");
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // je passe la  Vérification de l’OTP (le code de simulation → "654321")
    if (otp === "654321") {
      console.log("OTP validé !");
      navigate("/dashboard"); 
    } else {
      alert("OTP invalide");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Image côté gauche */}
      <div className="hidden md:flex w-1/2 bg-gray-200 items-center justify-center">
        <img src={otpImage} alt="Login illustration" className="object-cover h-full"/>
      </div>

      {/* Formulaire  */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6">Login</h1>
          
          {/* Formulaire login */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Téléphone */}
            <div>
              <label className="block mb-1 text-sm font-medium">Téléphone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Entrez votre numéro"
                required
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block mb-1 text-sm font-medium">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Mot de passe"
                required
              />
            </div>

            {!showOtp && (
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Se connecter
              </button>
            )}
          </form>

          {/* Formulaire OTP */}
          {showOtp && (
            <form onSubmit={handleOtpSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Code OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Entrez le code OTP"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Valider OTP
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
