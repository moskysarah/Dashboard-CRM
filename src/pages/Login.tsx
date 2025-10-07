import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import googleLogo from "../assets/logo-google.jpg";
import { useAuth } from "../store/auth";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { LOCAL_STORAGE_KEYS } from "../config/constants";
import type { User } from "../types/domain";

const Login = () => {
  const navigate = useNavigate();
  const login = useAuth((state) => state.login);

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
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState(false);

  // États pour le verrouillage après échecs
  // On initialise l'état depuis le localStorage pour la persistance
  const [loginAttempts, setLoginAttempts] = useState(() => {
    const saved = localStorage.getItem("loginAttempts");
    const initialValue = saved ? parseInt(saved, 10) : 0;
    console.log(`[INIT] Tentatives de connexion initiales : ${initialValue}`);
    return initialValue;
  });
  const [lockoutUntil, setLockoutUntil] = useState(() => {
    const saved = localStorage.getItem("lockoutUntil");
    const initialValue = saved ? parseInt(saved, 10) : null;
    if (initialValue) {
      console.log(
        `[INIT] Verrouillage initial jusqu'à : ${new Date(
          initialValue
        ).toLocaleTimeString()}`
      );
    }
    return initialValue;
  });
  const [remainingLockoutTime, setRemainingLockoutTime] = useState(() => {
    const savedLockout = localStorage.getItem("lockoutUntil");
    if (savedLockout) {
      const remaining = Math.ceil(
        (parseInt(savedLockout, 10) - Date.now()) / 1000
      );
      const initialValue = remaining > 0 ? remaining : 0;
      console.log(`[INIT] Temps de verrouillage restant calculé : ${initialValue}s`);
      return initialValue;
    }
    return 0;
  });

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
    setOtpError(false);
    // On ne réinitialise pas le compteur de tentatives si on reste sur le login
    if (mode !== "login") {
      setLoginAttempts(0);
      setLockoutUntil(null);
    }
  }, [mode]);

  // Effet pour gérer le compte à rebours du verrouillage
  useEffect(() => {
    if (lockoutUntil) {
      console.log(
        `[TIMER] Démarrage du minuteur. Verrouillé jusqu'à ${new Date(
          lockoutUntil
        ).toLocaleTimeString()}`
      );
      const interval = setInterval(() => {
        // On recalcule le temps restant à chaque tick à partir de la date de fin
        const newRemaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
        console.log(`[TIMER] Tick. Temps restant : ${newRemaining}s`);

        if (newRemaining > 0) {
          setRemainingLockoutTime(newRemaining);
        } else {
          console.log("[TIMER] Fin du verrouillage. Réinitialisation.");
          setLockoutUntil(null);
          setLoginAttempts(0); // On réinitialise les tentatives une fois le temps écoulé
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockoutUntil]);

  // Effets pour sauvegarder l'état de verrouillage dans le localStorage
  useEffect(() => {
    console.log(
      `[PERSIST] Sauvegarde de loginAttempts dans localStorage : ${loginAttempts}`
    );
    localStorage.setItem("loginAttempts", loginAttempts.toString());
  }, [loginAttempts]);

  useEffect(() => {
    if (lockoutUntil) {
      console.log(
        `[PERSIST] Sauvegarde de lockoutUntil dans localStorage : ${new Date(
          lockoutUntil
        ).toLocaleTimeString()}`
      );
      localStorage.setItem("lockoutUntil", lockoutUntil.toString());
    } else {
      console.log("[PERSIST] Nettoyage des données de verrouillage du localStorage.");
      localStorage.removeItem("lockoutUntil");
      localStorage.removeItem("loginAttempts"); // On nettoie tout si le verrouillage est levé
    }
  }, [lockoutUntil]);

  // Validation aide
  const isValidPhone = (input: string) => /^\d{10}$/.test(input);
  const isValidEmail = (input: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  const validatePhoneOrEmail = (input: string) => isValidPhone(input) || isValidEmail(input);

  // --- c'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (lockoutUntil && Date.now() < lockoutUntil) {
      alert(`Trop de tentatives. Veuillez attendre ${remainingLockoutTime} secondes.`);
      return;
    }

    setIsLoading(true);
    
  // ici je recupere mon token temporaire apres que l'utilisateur se connecte 

    try {
      const res = await api.post("accounts/otp/request/", {
        phone: loginPhoneOrEmail,
        password: loginPassword,
      });
       // je le stocke ici a localstorage ligne sous la clé tempaccesstoken

      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_PHONE, loginPhoneOrEmail);

      const maskedPhone = "•••••••••••••";
      localStorage.setItem(LOCAL_STORAGE_KEYS.MASKED_PHONE, maskedPhone);

      setMode("otp");
    } catch (err: any) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      // Après 2 tentatives, on verrouille
      if (newAttempts >= 2) {
        // Séquence de verrouillage personnalisée en secondes
        const lockoutDurationsInSeconds = [30, 60, 120, 300, 900, 1800, 3600]; // 30s, 1m, 2m, 5m, 15m, 30m, 1h
        // On prend la durée correspondante, ou la dernière si on dépasse le nombre de paliers
        const durationIndex = Math.min(newAttempts - 2, lockoutDurationsInSeconds.length - 1);
        const lockoutDuration = lockoutDurationsInSeconds[durationIndex] * 1000;
        console.log(
          `[LOCK] Tentative ${newAttempts} échouée. Déclenchement d'un verrouillage de ${
            lockoutDuration / 1000
          }s.`
        );

        const newLockoutUntil = Date.now() + lockoutDuration;
        setLockoutUntil(newLockoutUntil);
        setRemainingLockoutTime(Math.ceil(lockoutDuration / 1000));
      }

      console.error(err);
      alert(err.response?.data?.detail || "Identifiants incorrects.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- registre---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  // --- validation otp--- la ligne je repere le token final quand l'otp est correcte

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const phone = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_PHONE);
    const code = otp || localStorage.getItem(LOCAL_STORAGE_KEYS.OTP_CODE);

    if (!phone || !code) {
      alert("Une erreur est survenue. Veuillez recommencer le processus de connexion.");
      setIsLoading(false);
      setMode("login");
      return;
    }
   // la ligne qui valide le code apres se connecter
    try {
      const res = await api.post(
        "/accounts/otp/login/",
        { phone, otp: code }, 
      );

      const response = res.data;
      // La réponse de l'API doit contenir les tokens et les données utilisateur
      if (res.status === 200 && response.access && response.refresh && response.data) {
        // On appelle la fonction centralisée du store pour gérer la session
        console.log("[SUCCESS] Connexion réussie. Réinitialisation du compteur de tentatives.");
        setLoginAttempts(0); // Réinitialise les tentatives en cas de succès
        setLockoutUntil(null);

        login(response.data as User, {
          access: response.access,
          refresh: response.refresh,
        });

        navigate("/dashboard");
      } else {
        setOtpError(true);
      }
    } catch (err: any) {
      console.error(err);
      setOtpError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Animation slide---
  const slide = {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
    transition: { duration: 0.6, ease: "easeInOut" as const },
  };

  const Spinner = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

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
                <Input
                  type="text"
                  value={loginPhoneOrEmail}
                  onChange={(e) => setLoginPhoneOrEmail(e.target.value)}
                  placeholder="Téléphone ou Email"
                />
                <Input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Mot de passe"
                />
                <div className="text-right mb-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-auto p-0 text-sm"
                    onClick={() => alert("Fonction mot de passe oublié")}
                  >
                    Mot de passe oublié ?
                  </Button>
                </div>
                <select
                  value={loginRole}
                  onChange={(e) => setLoginRole(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">-- Rôle (non utilisé pour la connexion) --</option>
                  <option value="admin">Admin</option>
                  <option value="user">Utilisateur (Marchand/Distributeur)</option>
                </select>
                <Button type="submit" variant="primary" disabled={isLoading || !!lockoutUntil} className="flex justify-center items-center">
                  {isLoading 
                    ? <Spinner /> 
                    : lockoutUntil 
                      ? `Réessayer dans ${remainingLockoutTime}s`
                      : 'Se connecter'
                  }
                </Button>
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
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="Mot de passe"
                />
                <select
                  value={registerRole}
                  onChange={(e) => setRegisterRole(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">-- Choisir un rôle --</option>
                  <option value="user">Utilisateur (Marchand/Distributeur)</option>
                </select>
                <Button type="submit" variant="success" disabled={isLoading} className="flex justify-center items-center">
                  {isLoading ? <Spinner /> : 'CRÉER UN COMPTE'}
                </Button>
              </form>
            </motion.div>
          )}

          {/* OTP */}
          {mode === "otp" && (
            <motion.div key="otp" {...slide} className="w-full max-w-sm text-center">
              {!otpError ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Entrer le code OTP</h2>
                  <form onSubmit={handleOtpSubmit} className="space-y-4">
                    <Input
                      type="text"
                      readOnly
                      value={localStorage.getItem(LOCAL_STORAGE_KEYS.MASKED_PHONE) || "•••••••••••••"}
                      placeholder="Numéro masqué"
                      className="hidden text-gray-500 text-center tracking-widest"
                    />
                    <Input
                      type="text"
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value);
                        localStorage.setItem(LOCAL_STORAGE_KEYS.OTP_CODE, e.target.value);
                      }}
                      placeholder="Code OTP"
                      className="text-center"
                    />
                    <Button type="submit" variant="success" disabled={isLoading} className="flex justify-center items-center">
                      {isLoading ? <Spinner /> : 'Valider'}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-red-600 mb-4">Échec de la validation</h2>
                  <p className="text-gray-600">Le code OTP est invalide ou a expiré. Veuillez réessayer.</p>
                  <Button onClick={() => setMode('login')} variant="primary">
                    Retour à la connexion
                  </Button>
                </div>
              )}
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
            <Button onClick={() => setMode("register")} variant="secondary" className="px-8">
              S'inscrire
            </Button>
          </>
        )}

        {mode === "register" && (
          <>
            <h2 className="text-4xl font-bold mb-4">Bon retour!</h2>
            <p className="mb-6 text-center max-w-sm">
              Veuillez vous enregistrer avec vos informations personnelles pour rester connecté
            </p>
            <Button onClick={() => setMode("login")} variant="secondary" className="px-8">
              Se connecter
            </Button>
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
