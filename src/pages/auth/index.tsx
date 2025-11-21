import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import twoPersonImage from "../../assets/two_person_whith_phone-removebg-preview.png";
import manPointImage from "../../assets/man_who_point_hand-removebg-preview.png";
import girlPhoneImage from "../../assets/girl-showing-phone.png";

import LoginPage from "./LoginPage.tsx";
import RegisterPage from "./RegisterPage.tsx";
import OtpPage from "./RequestOtpPage.tsx";
import ForgotPasswordPage from "./ForgotPasswordPage.tsx";
import ResetPasswordPage from "./PasswordResetPage.tsx";

const AuthIndex = () => {
  const [mode, setMode] = useState<"login" | "register" | "otp" | "forgot" | "resetPassword">("login");

  const slide = {
    initial: { x: 300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 },
    transition: { duration: 0.5 },
  };

  const renderForm = () => {
    switch (mode) {
      case "register":
        return <RegisterPage onSwitchMode={setMode} />;
      case "otp":
        return <OtpPage onSwitchMode={setMode} />;
      case "forgot":
        return <ForgotPasswordPage onSwitchMode={setMode} />;
      case "resetPassword":
        return <ResetPasswordPage onSwitchMode={setMode} />;
      default:
        return <LoginPage onSwitchMode={setMode} />;
    }
  };

  const imageMap: Record<string, string> = {
    login: twoPersonImage,
    register: manPointImage,
    otp: girlPhoneImage,
    forgot: girlPhoneImage,
    resetPassword: girlPhoneImage,
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen flex flex-col md:flex-row font-sans overflow-hidden"
    >
      {/* Partie gauche (formulaire) */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-white p-6 md:p-10">
        <AnimatePresence mode="wait">
          <motion.div key={mode} {...slide} className="w-full max-w-sm text-center">
            {renderForm()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Partie droite (image et texte) */}
      <div className="w-full md:w-1/2 bg-[#0176D3] text-white flex flex-col justify-center items-center p-6 md:p-10">
        <AnimatePresence mode="wait">
          <motion.img
            key={mode + "-image"}
            src={imageMap[mode]}
            alt={mode}
            className="w-40 md:w-60 mb-4 md:mb-6 rounded-full"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        </AnimatePresence>
        <h2 className="text-4xl font-bold mb-4">
          {mode === "login" && "Bonjour!"}
          {mode === "register" && "Créer un compte"}
          {mode === "otp" && "Vérification OTP"}
          {mode === "forgot" && "Mot de passe oublié"}
          {mode === "resetPassword" && "Nouveau mot de passe"}
        </h2>
        <p className="mb-6 text-center max-w-sm">
          {mode === "login" && "Pour rester connecté(e), veuillez vous connecter avec vos informations personnelles."}
          {mode === "register" && "Rejoignez notre plateforme et commencez dès maintenant."}
          {mode === "otp" && "Saisissez le code OTP envoyé sur votre téléphone."}
          {mode === "forgot" && "Réinitialisez votre mot de passe facilement."}
          {mode === "resetPassword" && "Créez un nouveau mot de passe sécurisé."}
        </p>
      </div>
    </motion.div>
  );
};

export default AuthIndex;
