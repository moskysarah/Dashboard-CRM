import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import twoPersonImage from "../assets/two_person_whith_phone-removebg-preview.png";
import manPointImage from "../assets/man_who_point_hand-removebg-preview.png";
import girlPhoneImage from "../assets/girl-showing-phone.png";
import { useAuth } from "../store/auth";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { LOCAL_STORAGE_KEYS } from "../config/constants";
import type { User } from "../types/domain";

const Login = () => {
  const navigate = useNavigate();
  const login = useAuth((state) => state.login);

  const [loginPhoneOrEmail, setLoginPhoneOrEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginRole, setLoginRole] = useState<"Admin" | "Marchand" | "Distributeur" | "Utilisateur">("Marchand");

  const [registerNom, setRegisterNom] = useState("");
  const [registerPrenom, setRegisterPrenom] = useState("");
  const [registerPhoneOrEmail, setRegisterPhoneOrEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerRole, setRegisterRole] = useState<"Admin" | "Marchand" | "Distributeur" | "Utilisateur">("Marchand");

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState(false);


  const [otpAttempts, setOtpAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const timerIdRef = useRef<number | null>(null);

  const [loginError, setLoginError] = useState("");

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotPhoneOrEmail, setForgotPhoneOrEmail] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [resetPasswordError, setResetPasswordError] = useState("");

  const [mode, setMode] = useState<"login" | "register" | "otp" | "forgot" | "resetPassword">("login");

  // Réinitialisation des champs à chaque montage du composant
  useEffect(() => {
    setLoginPhoneOrEmail("");
    setLoginPassword("");
    setLoginRole("Marchand");
    setRegisterNom("");
    setRegisterPrenom("");
    setRegisterPhoneOrEmail("");
    setRegisterPassword("");
    setRegisterRole("Marchand");
    setOtp("");
    setForgotPhoneOrEmail("");
    setNewPassword("");
    setConfirmNewPassword("");
    setMode("login");
    setLoginError("");
    setOtpError(false);
    setResetPasswordError("");
    setOtpAttempts(0);
    setIsLocked(false);
    setLockoutTime(0);
    if (timerIdRef.current) clearInterval(timerIdRef.current);
    timerIdRef.current = null;
    setIsForgotPassword(false);
  }, []);

  // Réinitialisation des champs
  useEffect(() => {
    if (mode === "login") {
      setLoginPhoneOrEmail("");
      setLoginPassword("");
      setLoginRole("Marchand");
    } else if (mode === "register") {
      // Reset register fields if needed
    }
  }, [mode]);

  // Cleanup du timer
  useEffect(() => {
    return () => {
      if (timerIdRef.current) clearInterval(timerIdRef.current);
    };
  }, []);

  // Validation email/téléphone
  const isValidPhone = (input: string) => /^\d{10}$/.test(input);
  const isValidEmail = (input: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  const validatePhoneOrEmail = (input: string) => isValidPhone(input) || isValidEmail(input);

  // 🔹 LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);

    try {
      await api.post("accounts/otp/request/", {
        phone: loginPhoneOrEmail,
        password: loginPassword,
      });

      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_PHONE, loginPhoneOrEmail);

      const maskedPhone = isValidPhone(loginPhoneOrEmail)
        ? loginPhoneOrEmail.replace(/(\d{3})(\d{3})(\d{4})/, "$1***$2***$3")
        : loginPhoneOrEmail.replace(/(.{3})(.*)(@.*)/, "$1***$3");

      localStorage.setItem(LOCAL_STORAGE_KEYS.MASKED_PHONE, maskedPhone);
      setMode("otp");
    } catch (err: unknown) {
      if (err instanceof Error && 'response' in err && err.response) {
        const response = err.response as { data?: { lockout?: string; detail?: string } };
        if (response?.data?.lockout) {
          setLoginError(response.data.lockout);
        } else {
          setLoginError(response?.data?.detail || "Identifiants incorrects.");
        }
      } else {
        setLoginError("Erreur inconnue lors de la connexion.");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  //  REGISTER
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (
      !registerNom ||
      !registerPrenom ||
      !validatePhoneOrEmail(registerPhoneOrEmail) ||
      !registerPassword ||
      !registerRole
    ) {
      alert("Veuillez remplir correctement tous les champs.");
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

      alert("Compte créé avec succès !");
      setMode("login");
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error && 'response' in err && err.response) {
        const response = err.response as { data?: { detail?: string } };
        alert(response?.data?.detail || "Erreur lors de l'inscription");
      } else {
        alert("Erreur inconnue lors de l'inscription");
      }
    } finally {
      setIsLoading(false);
    }
  };

  //  FORGOT PASSWORD
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!validatePhoneOrEmail(forgotPhoneOrEmail)) {
      alert("Veuillez saisir un téléphone ou email valide.");
      setIsLoading(false);
      return;
    }

    try {
      await api.post("accounts/otp/request/", {
        phone: forgotPhoneOrEmail,
      });

      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_PHONE, forgotPhoneOrEmail);

      const maskedPhone = isValidPhone(forgotPhoneOrEmail)
        ? forgotPhoneOrEmail.replace(/(\d{3})(\d{3})(\d{4})/, "$1***$2***$3")
        : forgotPhoneOrEmail.replace(/(.{3})(.*)(@.*)/, "$1***$3");

      localStorage.setItem(LOCAL_STORAGE_KEYS.MASKED_PHONE, maskedPhone);
      setIsForgotPassword(true);
      setMode("otp");
    } catch (err: unknown) {
      console.error(err);
      alert("Erreur lors de l'envoi de l'OTP. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  //  OTP VALIDATION
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const phone = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_PHONE);
    const code = otp || localStorage.getItem(LOCAL_STORAGE_KEYS.OTP_CODE);

    if (!phone || !code) {
      alert("Une erreur est survenue. Veuillez recommencer la connexion.");
      setIsLoading(false);
      setMode("login");
      return;
    }

    try {
      if (isForgotPassword) {
        // mot de passe oublier, code valide  OTP pour reinitialiser le mot de passe
        const res = await api.post("/accounts/password-reset/confirm/", { phone, otp: code });
        if (res.status === 200) {
          localStorage.setItem(LOCAL_STORAGE_KEYS.OTP_CODE, code); // restore OTP comme token de reinitialisation
          setMode("resetPassword");
        } else {
          setOtpError(true);
        }
      } else {
        // Normal login
        const res = await api.post("/accounts/otp/login/", { phone, otp: code });
        const response = res.data;

        if (res.status === 200 && response.access && response.refresh && response.data) {
          console.log("[SUCCESS] Connexion réussie ");
          setOtpAttempts(0);
          setIsLocked(false);
          setLockoutTime(0);
          if (timerIdRef.current) clearInterval(timerIdRef.current);

          login(response.data as User, {
            access: response.access,
            refresh: response.refresh,
          });

          navigate("/dashboard");
        } else {
          setOtpError(true);
          const newAttempts = otpAttempts + 1;
          setOtpAttempts(newAttempts);
          if (newAttempts >= 2) {
            const lockoutDuration = 30 * Math.pow(2, newAttempts - 2); // 30s, 60s, 120s, etc.
            setIsLocked(true);
            setLockoutTime(lockoutDuration);
            const id = setInterval(() => {
              setLockoutTime((prev) => {
                if (prev <= 1) {
                  setIsLocked(false);
                  setOtpAttempts(0);
                  clearInterval(id);
                }
                return prev - 1;
              });
            }, 1000);
            timerIdRef.current = id;
          }
        }
      }
    } catch (err: unknown) {
      console.error(err);
      if (isForgotPassword) {
        setOtpError(true);
      } else {
        setOtpError(true);
        const newAttempts = otpAttempts + 1;
        setOtpAttempts(newAttempts);
        if (newAttempts >= 2) {
          const lockoutDuration = 30 * Math.pow(2, newAttempts - 2); // 30s, 60s, 120s, etc.
          setIsLocked(true);
          setLockoutTime(lockoutDuration);
          const id = setInterval(() => {
            setLockoutTime((prev) => {
              if (prev <= 1) {
                setIsLocked(false);
                setOtpAttempts(0);
                clearInterval(id);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          timerIdRef.current = id;
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  //  RESET PASSWORD
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetPasswordError("");
    if (newPassword !== confirmNewPassword) {
      setResetPasswordError("Le nouveau mot de passe ne correspod pas.");
      return;
    }
    if (newPassword.length < 8) {
      setResetPasswordError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setIsLoading(true);
    try {
      const phone = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_PHONE);
      const otpToken = localStorage.getItem(LOCAL_STORAGE_KEYS.OTP_CODE);
      await api.post("/accounts/reset-password/", {
        phone,
        otp: otpToken,
        new_password: newPassword
      });
      alert("Mot de passe réinitialisé avec succès !");
      setMode("login");
      // Clear stored data
      localStorage.removeItem(LOCAL_STORAGE_KEYS.OTP_CODE);
    } catch (error: unknown) {
      console.error("Erreur lors de la réinitialisation du mot de passe :", error);
      if (error instanceof Error && 'response' in error && error.response) {
        const response = error.response as { data?: { detail?: string } };
        setResetPasswordError(response?.data?.detail || "Erreur lors de la réinitialisation du mot de passe.");
      } else {
        setResetPasswordError("Erreur inconnue lors de la réinitialisation du mot de passe.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const slide = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
    transition: { duration: 0.5 },
  };

  const Spinner = () => (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
        5.291A7.962 7.962 0 014 12H0c0 
        3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <div className="min-h-screen flex font-sans overflow-hidden">
      {/* Partie gauche : formulaire */}
      <div className="w-1/2 flex flex-col justify-center items-center p-10 bg-white shadow-lg relative">
        <AnimatePresence mode="wait">
          {mode === "login" && (
            <motion.div key="login" {...slide} className="w-full max-w-sm text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Se connecter</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="text"
                  value={loginPhoneOrEmail}
                  onChange={(e) => setLoginPhoneOrEmail(e.target.value)}
                  placeholder="Téléphone ou Email"
                />
                <Input
                  isPassword
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Mot de passe"
                />
                <div className="text-left w-full">
                  <select
                    value={loginRole}
                    onChange={(e) => setLoginRole(e.target.value as "Admin" | "Marchand" | "Distributeur" | "Utilisateur")}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">-- Sélectionner un rôle --</option>
                    <option value="Admin">Admin</option>
                    <option value="Distributeur">Distributeur</option>
                    <option value="Utilisateur">Utilisateur</option>
                  </select>
                </div>

                {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading || isLocked}
                  className="flex justify-center items-center"
                >
                  {isLoading ? <Spinner /> : "Se connecter"}
                </Button>
                <Button onClick={() => setMode("register")} variant="ghost">
                  S'inscrire
                </Button>
                <Button onClick={() => setMode("forgot")} variant="ghost">
                  Mot de passe oublié ?
                </Button>
              </form>
            </motion.div>
          )}

          {mode === "register" && (
            <motion.div key="register" {...slide} className="w-full max-w-sm text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">S'inscrire</h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <Input
                  type="text"
                  value={registerNom}
                  onChange={(e) => setRegisterNom(e.target.value)}
                  placeholder="Nom"
                />
                <Input
                  type="text"
                  value={registerPrenom}
                  onChange={(e) => setRegisterPrenom(e.target.value)}
                  placeholder="Prénom"
                />
                <Input
                  type="text"
                  value={registerPhoneOrEmail}
                  onChange={(e) => setRegisterPhoneOrEmail(e.target.value)}
                  placeholder="Téléphone ou Email"
                />
                <Input
                  isPassword
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="Mot de passe"
                />
                <div className="text-left w-full">
                  
                  <select
                    value={registerRole}
                    onChange={(e) => setRegisterRole(e.target.value as "Admin" | "Marchand" | "Distributeur" | "Utilisateur")}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">-- Sélectionner un rôle --</option>
                    <option value="Admin">Admin</option>
                    <option value="Marchand">Marchand</option>
                    <option value="Distributeur">Distributeur</option>
                    <option value="Utilisateur">Utilisateur</option>
                  </select>
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading}
                  className="flex justify-center items-center"
                >
                  {isLoading ? <Spinner /> : "S'inscrire"}
                </Button>
                <Button onClick={() => setMode("login")} variant="ghost">
                  Retour à la connexion
                </Button>
              </form>
            </motion.div>
          )}

          {mode === "forgot" && (
            <motion.div key="forgot" {...slide} className="w-full max-w-sm text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Mot de passe oublié</h2>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <Input
                  type="text"
                  value={forgotPhoneOrEmail}
                  onChange={(e) => setForgotPhoneOrEmail(e.target.value)}
                  placeholder="Téléphone ou Email"
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading}
                  className="flex justify-center items-center"
                >
                  {isLoading ? <Spinner /> : "Envoyer OTP"}
                </Button>
                <Button onClick={() => setMode("login")} variant="ghost">
                  Retour à la connexion
                </Button>
              </form>
            </motion.div>
          )}

          {mode === "otp" && (
            <motion.div key="otp" {...slide} className="w-full max-w-sm text-center">
              {isLocked ? (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-red-600 mb-4">
                    Trop de tentatives
                  </h2>
                  <p className="text-gray-600">
                    Vous avez dépassé le nombre de tentatives autorisées. Veuillez attendre {lockoutTime} secondes avant de réessayer.
                  </p>
                  <Button onClick={() => setMode("login")} variant="primary">
                    Retour à la connexion
                  </Button>
                </div>
              ) : !otpError ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {isForgotPassword ? "Réinitialiser le mot de passe" : "Entrer le code OTP"}
                  </h2>
                  <form onSubmit={handleOtpSubmit} className="space-y-4">
                    <Input
                      type="password"
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value);
                        localStorage.setItem(LOCAL_STORAGE_KEYS.OTP_CODE, e.target.value);
                      }}
                      placeholder="Code OTP"
                      className="text-center"
                    />
                    <Button
                      type="submit"
                      variant="success"
                      disabled={isLoading || isLocked}
                      className="flex justify-center items-center"
                    >
                      {isLoading ? <Spinner /> : isForgotPassword ? "Réinitialiser" : "Valider"}
                    </Button>
                    <Button onClick={() => setMode("login")} variant="ghost">
                      Retour
                    </Button>
                  </form>
                </>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-red-600 mb-4">
                    Échec de la validation
                  </h2>
                  <p className="text-gray-600">
                    Le code OTP est invalide ou a expiré. Veuillez réessayer.
                  </p>
                  <Button onClick={() => setMode("login")} variant="primary">
                    Retour à la connexion
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {mode === "resetPassword" && (
            <motion.div key="resetPassword" {...slide} className="w-full max-w-sm text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Nouveau mot de passe</h2>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <Input
                  isPassword
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nouveau mot de passe"
                  required
                />
                <Input
                  isPassword
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirmer le nouveau mot de passe"
                  required
                />
                {resetPasswordError && <p className="text-red-500 text-sm">{resetPasswordError}</p>}
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading}
                  className="flex justify-center items-center"
                >
                  {isLoading ? <Spinner /> : "Réinitialiser le mot de passe"}
                </Button>
                <Button onClick={() => setMode("login")} variant="ghost">
                  Retour à la connexion
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Partie droite */}
      <div className="w-1/2 bg-[#0176D3] text-white flex flex-col justify-center items-center p-10 relative">
        <AnimatePresence mode="wait">
          {mode && (
            <motion.img
              key={mode + "-image"}
              src={
                mode === "login"
                  ? twoPersonImage
                  : mode === "register"
                  ? manPointImage
                  : girlPhoneImage
              }
              alt={mode}
              className="w-60 mb-6 rounded-full"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
          )}
        </AnimatePresence>

        {mode === "login" && (
          <>
            <h2 className="text-4xl font-bold mb-4">Bonjour!</h2>
            <p className="mb-6 text-center max-w-sm">
              Pour rester connecté(e) avec nous, veuillez vous connecter avec vos
              informations personnelles
            </p>
          </>
        )}

        {mode === "register" && (
          <>
            <h2 className="text-4xl font-bold mb-4">Créer un compte</h2>
            <p className="mb-6 text-center max-w-sm">
              Rejoignez notre plateforme en créant un compte. Choisissez votre rôle et commencez dès maintenant.
            </p>
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
