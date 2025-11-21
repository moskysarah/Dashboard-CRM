import React, { useState } from "react";
import { Button } from "../../components/ui/Button";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface Props {
  onSwitchMode: (mode: "login" | "register" | "otp" | "forgot" | "resetPassword") => void;
}

const ForgotPasswordPage: React.FC<Props> = ({ onSwitchMode }) => {
  const [forgotPhone, setForgotPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Mot de passe oublié pour :", forgotPhone);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PhoneInput
        country="cd"
        value={forgotPhone}
        onChange={setForgotPhone}
        inputStyle={{ width: "100%", height: "45px", borderRadius: "8px" }}
      />

      <Button type="submit" variant="primary" className="w-full">
        Envoyer le code
      </Button>

      <Button variant="ghost" onClick={() => onSwitchMode("login")}>
        Retour à la connexion
      </Button>
    </form>
  );
};

export default ForgotPasswordPage;
