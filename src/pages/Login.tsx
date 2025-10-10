import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import api from "../services/api";
import loginImage from "../assets/two_person_whith_phone-removebg-preview.png";
import registerImage from "../assets/man_who_point_hand-removebg-preview.png";
import girlPhoneImage from "../assets/girl-showing-phone.png";
import { useAuth } from "../store/auth";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { LOCAL_STORAGE_KEYS } from "../config/constants";
import type { User } from "../types/domain";

const Login = () => {
  const navigate = useNavigate();
  const login = useAuth((state) => state.login);

  // États login/register/forgotPassword
  const [loginPhoneOrEmail, setLoginPhoneOrEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginRole, setLoginRole] = useState<"Admin" | "Marchand" | "Distributeur" | "">("");
  const [registerNom, setRegisterNom] = useState("");
  const [registerPrenom, setRegisterPrenom] = useState("");
  const [registerPhoneOrEmail, setRegisterPhoneOrEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerRole, setRegisterRole] = useState<"Admin" | "Marchand" | "Distributeur" | "">("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState(""); // Pour mot de passe oublié
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirmation mot de passe
  const [resetToken, setResetToken] = useState(""); // Token reçu par mail/SMS
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [lockoutError, setLockoutError] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "register" | "otp" | "forgotPassword">("login");

  // Réinitialiser les champs lors du changement de mode
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
    } else if (mode === "forgotPassword") {
      setLoginPhoneOrEmail(loginPhoneOrEmail);
      setNewPassword("");
      setConfirmPassword("");
      setResetToken("");
    }
    setOtp("");
    setOtpError(false);
    setLockoutError(null);
  }, [mode]);

  const isValidPhone = (input: string) => /^\d{10}$/.test(input);
  const isValidEmail = (input: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  const validatePhoneOrEmail = (input: string) => isValidPhone(input) || isValidEmail(input);

  // --- Login ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("accounts/otp/request/", {
        phone: loginPhoneOrEmail,
        password: loginPassword,
      });
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_PHONE, loginPhoneOrEmail);
      localStorage.setItem(LOCAL_STORAGE_KEYS.MASKED_PHONE, "•••••••••••••");
      setMode("otp");
      setLockoutError(null);
    } catch (err: any) {
      if (err.response?.data?.lockout) setLockoutError(err.response.data.lockout);
      else alert(err.response?.data?.detail || "Identifiants incorrects.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Register ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!registerNom || !registerPrenom || !validatePhoneOrEmail(registerPhoneOrEmail) || !registerPassword || !registerRole) {
      alert("Veuillez remplir correctement tous les champs.");
      return;
    }
    if (registerPassword.length < 8) {
      alert("Le mot de passe doit contenir au moins 8 caractères.");
      setIsLoading(false);
      return;
    }
    try {
      await api.post("/accounts/users", {
        first_name: registerNom,
        last_name: registerPrenom,
        username: registerPhoneOrEmail,
        password: registerPassword,
        role: registerRole,
      });
      alert("Compte créé avec succès ");
      setMode("login");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  // --- OTP ---
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!/^\d{4,6}$/.test(otp)) {
      alert("Le code OTP doit contenir 4 à 6 chiffres.");
      setIsLoading(false);
      return;
    }
    const phone = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_PHONE);
    const code = otp || localStorage.getItem(LOCAL_STORAGE_KEYS.OTP_CODE);
    if (!phone || !code) {
      alert("Une erreur est survenue. Veuillez recommencer le processus de connexion.");
      setIsLoading(false);
      setMode("login");
      return;
    }
    try {
      const response = await api.post("/accounts/otp/login/", { phone, otp: code });
      if (response.status === 200 && response.data.access && response.data.refresh && response.data.data) {
        login(response.data.data as User, { access: response.data.access, refresh: response.data.refresh });
        navigate("/dashboard");
      } else setOtpError(true);
    } catch (err: any) {
      console.error(err);
      setOtpError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Mot de passe oublié : demande de réinitialisation ---
  const handleForgotPasswordRequest = async () => {
    if (!validatePhoneOrEmail(loginPhoneOrEmail)) {
      alert("Veuillez entrer un email ou téléphone valide.");
      return;
    }
    setIsLoading(true);
    try {
      await api.post("/accounts/password-reset/", { phone_or_email: loginPhoneOrEmail });
      alert("Un lien de réinitialisation a été envoyé à votre email/téléphone.");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Erreur lors de la demande de réinitialisation.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Mot de passe oublié : confirmation ---
  const handlePasswordResetConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }
    setIsLoading(true);
    try {
      await api.post("/accounts/password-reset-confirm/", {
        token: resetToken,
        new_password: newPassword,
      });
      alert("Mot de passe réinitialisé avec succès !");
      setMode("login");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Erreur lors de la réinitialisation du mot de passe.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Animation ---
  const slide = { initial: { opacity: 0, x: -50 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 50 }, transition: { duration: 0.5, ease: easeInOut } };
  const Spinner = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <div className="min-h-screen flex font-sans overflow-hidden">
      {/* Partie gauche */}
      <div className="w-1/2 flex flex-col justify-center items-center p-10 bg-white shadow-lg relative">
        <AnimatePresence mode="wait">
          {mode === "login" && (
            <motion.div key="login" {...slide} className="w-full max-w-sm text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Se connecter</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input type="text" value={loginPhoneOrEmail} onChange={(e) => setLoginPhoneOrEmail(e.target.value)} placeholder="Téléphone ou Email" />
                <Input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Mot de passe" />
                <div className="text-right mb-2">
                  <Button type="button" variant="ghost" className="w-auto p-0 text-sm" onClick={() => setMode("forgotPassword")}>
                    Mot de passe oublié ?
                  </Button>
                </div>
                <select value={loginRole} onChange={(e) => setLoginRole(e.target.value as any)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="">-- Rôle --</option>
                  <option value="Admin">Admin</option>
                  <option value="Marchand">Marchand</option>
                  <option value="Distributeur">Distributeur</option>
                </select>
                <Button type="submit" variant="primary" disabled={isLoading || !!lockoutError} className="flex justify-center items-center">
                  {isLoading ? <Spinner /> : lockoutError ? lockoutError : "Se connecter"}
                </Button>
              </form>
              <p className="mt-4">Pas de compte ? <Button type="button" variant="link" onClick={() => setMode("register")}>S'inscrire</Button></p>
            </motion.div>
          )}

          {mode === "register" && (
            <motion.div key="register" {...slide} className="w-full max-w-sm text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">S'inscrire</h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <Input type="text" value={registerNom} onChange={(e) => setRegisterNom(e.target.value)} placeholder="Nom" />
                <Input type="text" value={registerPrenom} onChange={(e) => setRegisterPrenom(e.target.value)} placeholder="Prénom" />
                <Input type="text" value={registerPhoneOrEmail} onChange={(e) => setRegisterPhoneOrEmail(e.target.value)} placeholder="Téléphone ou Email" />
                <Input type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} placeholder="Mot de passe" />
                <select value={registerRole} onChange={(e) => setRegisterRole(e.target.value as any)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="">-- Rôle --</option>
                  <option value="Admin">Admin</option>
                  <option value="Marchand">Marchand</option>
                  <option value="Distributeur">Distributeur</option>
                </select>
                <Button type="submit" variant="primary" disabled={isLoading} className="flex justify-center items-center">
                  {isLoading ? <Spinner /> : "S'inscrire"}
                </Button>
              </form>
              <p className="mt-6">Déjà un compte ? <Button  type="button" variant="link" onClick={() => setMode("login")}>Se connecter</Button></p>
            </motion.div>
          )}

          {mode === "otp" && (
            <motion.div key="otp" {...slide} className="w-full max-w-sm text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Vérification OTP</h2>
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <Input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Code OTP" />
                {otpError && <p className="text-red-500">Code OTP incorrect.</p>}
                <Button type="submit" variant="primary" disabled={isLoading} className="flex justify-center items-center">
                  {isLoading ? <Spinner /> : "Vérifier"}
                </Button>
              </form>
              <Button onClick={() => setMode("login")} variant="ghost" className="mt-4">Retour</Button>
            </motion.div>
          )}

          {mode === "forgotPassword" && (
            <motion.div key="forgotPassword" {...slide} className="w-full max-w-sm text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Réinitialiser le mot de passe</h2>
              <Input type="text" value={loginPhoneOrEmail} onChange={(e) => setLoginPhoneOrEmail(e.target.value)} placeholder="Téléphone ou Email" className="mb-4" />
              <Button type="button" onClick={handleForgotPasswordRequest} disabled={isLoading} className="w-full mb-4">{isLoading ? <Spinner /> : "Envoyer la demande"}</Button>
              <form onSubmit={handlePasswordResetConfirm} className="space-y-4">
                <Input type="text" value={resetToken} onChange={(e) => setResetToken(e.target.value)} placeholder="Token reçu par email/SMS" />
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nouveau mot de passe" />
                <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirmer le mot de passe" />
                <Button type="submit" variant="success" disabled={isLoading}>{isLoading ? <Spinner /> : "Réinitialiser"}</Button>
              </form>
              <Button onClick={() => setMode("login")} variant="primary" className="mt-4">Retour à la connexion</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Partie droite inchangée */}
      <div className="w-1/2 bg-[#0176D3] text-white flex flex-col justify-center items-center p-10 relative">
        <AnimatePresence mode="wait">
          {mode && (
            <motion.img
              key={mode + "-image"}
              src={mode === "login" ? loginImage : mode === "register" ? registerImage : girlPhoneImage}
              alt={mode}
              className="w-80 mb-10 rounded-full"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Login;








