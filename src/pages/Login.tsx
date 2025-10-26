/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import api from "../services/api";
import twoPersonImage from "../assets/two_person_whith_phone-removebg-preview.png";
import manPointImage from "../assets/man_who_point_hand-removebg-preview.png";
import girlPhoneImage from "../assets/girl-showing-phone.png";
import { useAuth } from "../store/auth";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { LOCAL_STORAGE_KEYS } from "../config/constants";
import T from "../components/translatespace";

const Login = () => {
  const navigate = useNavigate();
  const login = useAuth((state) => state.login);

  const [loginPhoneOrEmail, setLoginPhoneOrEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginRole, setLoginRole] = useState<"superadmin" | "admin" | "agent" | "partner" | "user">("admin");

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerRole, setRegisterRole] = useState<"superadmin" | "admin" | "agent" | "partner" | "user">("admin");
  const [registerUsernameError, setRegisterUsernameError] = useState("");

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotPhoneOrEmail, setForgotPhoneOrEmail] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [resetPasswordError, setResetPasswordError] = useState("");

  const [mode, setMode] = useState<"login" | "register" | "otp" | "forgot" | "resetPassword">("login");
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false);
  const [registeredRole, setRegisteredRole] = useState<"superadmin" | "admin" | "agent" | "partner" | "user">("admin");
  const [modalWidth, setModalWidth] = useState(0);
  const [modalHeight, setModalHeight] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    if (showRegistrationSuccess && modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      setModalWidth(rect.width);
      setModalHeight(rect.height);
    }
  }, [showRegistrationSuccess]);

  const isValidPhone = (input: string) => /^\+?\d{7,15}$/.test(input.replace(/\s+/g, ""));

  // ------------------------ LOGIN ------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);

    const cleanPhone = loginPhoneOrEmail.trim();
    const cleanPassword = loginPassword.trim();

    if (!cleanPhone || !cleanPassword) {
      setLoginError("Veuillez remplir tous les champs.");
      setIsLoading(false);
      return;
    }

    try {
      await api.post("accounts/otp/request/", {
        phone: cleanPhone,
        password: cleanPassword,
      });

      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_PHONE, cleanPhone);
      const maskedPhone = isValidPhone(cleanPhone)
        ? cleanPhone.replace(/(\d{3})(\d{3})(\d{4})/, "$1***$2***$3")
        : cleanPhone.replace(/(.{3})(.*)(@.*)/, "$1***$3");

      localStorage.setItem(LOCAL_STORAGE_KEYS.MASKED_PHONE, maskedPhone);
      setMode("otp");
    } catch (err: any) {
      const message = err?.response?.data?.detail || "Identifiants incorrects.";
      setLoginError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------ REGISTER ------------------------
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterUsernameError("");
    setIsLoading(true);

    const trimmedUsername = registerUsername.trim();
    const cleanPhone = registerPhone.trim();
    const cleanEmail = registerEmail.trim();
    const cleanPassword = registerPassword.trim();

    if (!trimmedUsername) {
      setRegisterUsernameError("Le nom d'utilisateur est requis.");
      setIsLoading(false);
      return;
    }

    try {
      await api.post("/accounts/users/", {
        username: trimmedUsername,
        phone: cleanPhone,
        email: cleanEmail || undefined,
        password: cleanPassword,
        role: registerRole,
      });

      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      setRegisteredRole(registerRole);
      setShowRegistrationSuccess(true);
    } catch (err: any) {
      const message = err?.response?.data?.detail || "Erreur lors de l'inscription";
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------ OTP ------------------------
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
      const res = await api.post("/accounts/otp/login/", { phone, otp: code });
      const response = res.data;

      if (res.status === 200 && response.access && response.refresh && response.data) {
        const roleMap: Record<string, "superadmin" | "admin" | "agent" | "partner" | "user"> = {
          superadmin: "superadmin",
          admin: "admin",
          agent: "agent",
          partner: "partner",
          user: "user",
        };

        const userRole = roleMap[response.data.role] || "user";

        login({ ...response.data, role: userRole }, {
          access: response.access,
          refresh: response.refresh,
        });

        // Redirection selon rôle
        switch (userRole) {
          case "superadmin":
            navigate("/dashboard");
            break;
          case "admin":
            navigate("/merchants");
            break;
          case "agent":
            navigate("/agent");
            break;
          case "partner":
            navigate("/distributor");
            break;
          case "user":
            navigate("/users");
            break;
          default:
            navigate("/");
        }
      } else {
        setOtpError(true);
      }
    } catch {
      setOtpError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------ RESET PASSWORD ------------------------
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetPasswordError("");

    if (newPassword !== confirmNewPassword) {
      setResetPasswordError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const phone = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_PHONE);
      const otpToken = localStorage.getItem(LOCAL_STORAGE_KEYS.OTP_CODE);
      await api.post("/accounts/reset-password/", {
        phone,
        otp: otpToken,
        new_password: newPassword,
      });
      alert("Mot de passe réinitialisé !");
      setMode("login");
      localStorage.removeItem(LOCAL_STORAGE_KEYS.OTP_CODE);
    } catch (err: any) {
      setResetPasswordError(err?.response?.data?.detail || "Erreur inconnue");
    }
  };

  // ------------------------ Continue après inscription ------------------------
  const handleContinue = () => {
    const dashboardRoutes: Record<string, string> = {
      superadmin: "/dashboard",
      admin: "/merchants",
      agent: "/agent",
      partner: "/distributor",
      user: "/users",
    };
    const route = dashboardRoutes[registeredRole] || "/";
    navigate(route);
    setShowRegistrationSuccess(false);
  };

  // ------------------------ Spinner ------------------------
  const Spinner = () => (
    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );

  // ------------------------ Animation ------------------------
  const slide = {
    initial: { x: 300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex flex-col md:flex-row font-sans overflow-hidden"
    >
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      {/* SECTION INSCRIPTION AVEC CHOIX DE ROLE */}
      {mode === "register" && (
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 bg-gray-50">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Créer un compte</h2>
          <form onSubmit={handleRegister} className="w-full max-w-sm space-y-3">
            <Input placeholder="Nom d’utilisateur" value={registerUsername} onChange={(e) => setRegisterUsername(e.target.value)} />
            <Input placeholder="Téléphone" value={registerPhone} onChange={(e) => setRegisterPhone(e.target.value)} />
            <Input placeholder="Email" type="email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
            <Input placeholder="Mot de passe" type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />

            {/* Sélection du rôle */}
        <select
              className="border rounded-md p-2 w-full text-gray-700"
              value={registerRole}
              onChange={(e) =>
                setRegisterRole(e.target.value as "superadmin" | "admin" | "agent" | "partner" | "user")
              }
            >
             <option value="" disabled selected>
                ----- Choisir le rôle -----
              </option>
              <option value="superadmin">Admin</option>
              <option value="admin">Marchant</option>
              <option value="agent">Agent</option>
              <option value="partner">Distributeur</option>
              <option value="user">Client</option>
        </select>
            <Button type="submit" className="w-full bg-indigo-600 text-white mt-4">
              {isLoading ? <Spinner /> : "S’inscrire"}
            </Button>
          </form>

          <p className="text-sm text-gray-500 mt-4">
            Déjà un compte ?{" "}
            <button className="text-indigo-600" onClick={() => setMode("login")}>
              Se connecter
            </button>
          </p>
        </div>
      )}

      {/* Le reste de ton design (images, etc.) reste inchangé */}
    </motion.div>
  );
};

export default Login;
