import React, { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface Props {
  onSwitchMode: (mode: "login" | "register" | "otp" | "forgot" | "resetPassword") => void;
}

const RegisterPage: React.FC<Props> = ({ onSwitchMode }) => {
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerRole, setRegisterRole] = useState("admin");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Inscription avec :", registerPhone, registerPassword, registerConfirmPassword, registerRole);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PhoneInput
        country="cd"
        value={registerPhone}
        onChange={setRegisterPhone}
        inputStyle={{ width: "100%", height: "45px", borderRadius: "8px" }}
      />
      <Input
        isPassword
        value={registerPassword}
        onChange={(e) => setRegisterPassword(e.target.value)}
        placeholder="Mot de passe"
      />
      <Input
        isPassword
        value={registerConfirmPassword}
        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
        placeholder="Confirmer le mot de passe"
      />
      <select
        value={registerRole}
        onChange={(e) => setRegisterRole(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md"
      >
        <option value="admin">Marchand</option>
        <option value="superadmin">Admin</option>
        <option value="partner">Distributeur</option>
        <option value="agent">Agent</option>
        <option value="user">Client</option>
      </select>

      <Button type="submit" variant="primary" className="w-full">
        S'inscrire
      </Button>

      <Button variant="ghost" onClick={() => onSwitchMode("login")}>
        Se connecter
      </Button>
    </form>
  );
};

export default RegisterPage;
