import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../contexts/userContext";
import api from "../services/api";
import googleLogo from "../assets/logo-google.jpg";

const Login = () => {
  const navigate = useNavigate();
  
  const { setUser } = useContext(UserContext);

  // États login/register
  const [loginPhoneOrEmail, setLoginPhoneOrEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginRole, setLoginRole] = useState<"Admin" | "Marchand" | "Distributeur" | "">("");

  const [registerNom, setRegisterNom] = useState("");
  const [registerPrenom, setRegisterPrenom] = useState("");
  const [registerPhoneOrEmail, setRegisterPhoneOrEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerRole, setRegisterRole] = useState<"Admin" | "Marchand" | "Distributeur" | "">("");

  const [otp, setOtp] = useState("");
  const [mode, setMode] = useState<"login" | "register" | "otp">("login");

  // réinitialiser champs 
  useEffect(() => {
    if (mode === "login") {
      setLoginPhoneOrEmail("");
      setLoginPassword("");
      setLoginRole("");
    } else if (mode === "register") {
      setRegisterNom("");
      setRegisterPrenom("");
      setRegisterPhoneOrEmail("");
      setRegisterPassword("");
      setRegisterRole("");
    }
    setOtp("");
  }, [mode]);

  // Validation aide
  const isValidPhone = (input: string) => /^\d{10}$/.test(input);
  const isValidEmail = (input: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  const validatePhoneOrEmail = (input: string) => isValidPhone(input) || isValidEmail(input);

  // --- c'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    
  // ici je recupere mon token temporaire apres que l'utilisateur se connecte 

    try {
      const res = await api.post("accounts/otp/request/", {
        phone: loginPhoneOrEmail,
        password: loginPassword,
      });
       // je le stocke ici a localstorage ligne sous la clé tempaccesstoken

      localStorage.setItem("tempAccessToken", res.data.tempToken);
      localStorage.setItem("userPhone", loginPhoneOrEmail);

      const maskedPhone = "•••••••••••••";
      localStorage.setItem("maskedPhone", maskedPhone);

      setMode("otp");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Erreur lors de la connexion");
    }
  };

  // --- registre---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !registerNom ||
      !registerPrenom ||
      !validatePhoneOrEmail(registerPhoneOrEmail) ||
      !registerPassword
    ) {
      alert("Veuillez remplir correctement tous les champs.");
      return;
    }

    try {
      await api.post("/accounts/", {
        first_name: registerNom,
        last_name: registerPrenom,
        username: registerPhoneOrEmail,
        password: registerPassword,
      });

      alert("Compte créé avec succès ");
      setMode("login");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Erreur lors de l'inscription");
    }
  };

  // --- validation otp--- la ligne je repere le token final quand l'otp est correcte

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phone = localStorage.getItem("userPhone");
    const code = otp || localStorage.getItem("otpCode");
    const tempToken = localStorage.getItem("tempAccessToken");

    if (!phone || !code || !tempToken) {
      alert("Veuillez entrer le numéro de téléphone et le code OTP.");
      return;
    }
   // la ligne qui valide le code apres se connecter
    try {
      const res = await api.post(
        "/accounts/otp/login/",
        { phone, otp: code }, 
        {
          headers: {
            // Authorization: `Bearer ${tempToken}`, // token temporaire dans le header
          },
        }
      );

      console.log(res)
      const response = res.data;
      console.log(response)
      if (res.status == 200) {
        localStorage.setItem("accessToken", response.access);
        localStorage.setItem("refreshToken", response.refresh);
        localStorage.setItem("user", response.data);
        
        localStorage.setItem("user", JSON.stringify(response.data));
        // localStorage.removeItem("tempAccessToken");

        // localStorage.setItem("maskedPhone", "•••••••••••••");
        // const localUser = localStorage.getItem("user")
        // const user = JSON.parse(localUser);
        // setUser(user);
        
        navigate("/dashboard");
              }
      else {
        alert("OTP invalide ou expiré")
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "OTP invalide ou expiré");
    }
  };

  // --- Animation slide---
  const slide = {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
    transition: { duration: 0.6, ease: "easeInOut" as const },
  };

  return (
    <div className="min-h-screen flex font-sans overflow-hidden">
      {/* partie gauche : formulaire */}
      <div className="w-1/2 flex flex-col justify-center items-center p-10 bg-white shadow-lg relative">
        <AnimatePresence mode="wait">
          {/* LOGIN */}
          {mode === "login" && (
            <motion.div key="login" {...slide} className="w-full max-w-sm text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Se connecter</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="text"
                  value={loginPhoneOrEmail}
                  onChange={(e) => setLoginPhoneOrEmail(e.target.value)}
                  placeholder="Téléphone ou Email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Mot de passe"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
                <div className="text-right mb-2">
                  <button
                    type="button"
                    className="text-sm text-indigo-600 hover:underline"
                    onClick={() => alert("Fonction mot de passe oublié")}
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
                <select
                  value={loginRole}
                  onChange={(e) =>
                    setLoginRole(e.target.value as "Admin" | "Marchand" | "Distributeur")
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Choisir un rôle --</option>
                  <option value="Admin">Admin</option>
                  <option value="Marchand">Marchand</option>
                  <option value="Distributeur">Distributeur</option>
                </select>
                <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-white hover:text-indigo-700 transition cursor-pointer">
                  Se connecter
                </button>
              </form>

              <div className="mt-4 flex justify-center items-center space-x-2">
                <button
                  type="button"
                  className="flex items-center border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition"
                  onClick={() => alert("Login avec Google")}
                >
                  <img src={googleLogo} alt="Google" className="w-6 h-6 mr-2" />
                  Se connecter avec Google
                </button>
              </div>
            </motion.div>
          )}

          {/* REGISTER */}
          {mode === "register" && (
            <motion.div key="register" {...slide} className="w-full max-w-sm text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">S'inscrire</h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <input
                  type="text"
                  value={registerNom}
                  onChange={(e) => setRegisterNom(e.target.value)}
                  placeholder="Nom"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  value={registerPrenom}
                  onChange={(e) => setRegisterPrenom(e.target.value)}
                  placeholder="Prénom"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  value={registerPhoneOrEmail}
                  onChange={(e) => setRegisterPhoneOrEmail(e.target.value)}
                  placeholder="Téléphone ou Email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="Mot de passe"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  value={registerRole}
                  onChange={(e) =>
                    setRegisterRole(e.target.value as "Admin" | "Marchand" | "Distributeur")
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Choisir un rôle --</option>
                  <option value="Admin">Admin</option>
                  <option value="Marchand">Marchand</option>
                  <option value="Distributeur">Distributeur</option>
                </select>
                <button className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition">
                  CRÉER UN COMPTE
                </button>
              </form>
            </motion.div>
          )}

          {/* OTP */}
          {mode === "otp" && (
            <motion.div key="otp" {...slide} className="w-full max-w-sm text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Entrer le code OTP</h2>
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <input
                  type="text"
                  readOnly
                  value={localStorage.getItem("maskedPhone") || "•••••••••••••"}
                  placeholder="Numéro masqué"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 hidden text-gray-500 text-center tracking-widest focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    localStorage.setItem("otpCode", e.target.value);
                  }}
                  placeholder="Code OTP"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 text-center"
                />
                <button className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition">
                  Valider
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* partie droite */}
      <div className="w-1/2 bg-[#0176D3] text-white flex flex-col justify-center items-center p-10 relative">
        <AnimatePresence mode="wait">
          {mode && (
            <motion.img
              key={mode + "-image"}
              src={
                mode === "login"
                  ? "src/assets/two_person_whith_phone-removebg-preview.png"
                  : mode === "register"
                  ? "src/assets/man_who_point_hand-removebg-preview.png"
                  : "src/assets/girl-showing-phone.png"
              }
              alt={mode}
              className="w-60 mb-6 rounded-full"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>

        {mode === "login" && (
          <>
            <h2 className="text-4xl font-bold mb-4">Bonjour!</h2>
            <p className="mb-6 text-center max-w-sm">
              Pour rester connecté(e) avec nous, veuillez vous connecter avec vos informations
              personnelles
            </p>
            <button
              onClick={() => setMode("register")}
              className="border-2 border-white px-8 py-2 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition"
            >
              S'inscrire
            </button>
          </>
        )}

        {mode === "register" && (
          <>
            <h2 className="text-4xl font-bold mb-4">Bon retour!</h2>
            <p className="mb-6 text-center max-w-sm">
              Veuillez vous enregistrer avec vos informations personnelles pour rester connecté
            </p>
            <button
              onClick={() => setMode("login")}
              className="border-2 border-white px-8 py-2 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition"
            >
              Se connecter
            </button>
          </>
        )}

        {mode === "otp" && (
          <>
            <h2 className="text-4xl font-bold mb-4">Vérification OTP</h2>
            <p className="mb-6 text-center max-w-sm">
              Saisissez le code OTP envoyé sur votre téléphone ou votre email.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
