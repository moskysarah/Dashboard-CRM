import React, { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface Props {
  onSwitchMode: (mode: "login" | "register" | "otp" | "forgot") => void;
}

const LoginPage: React.FC<Props> = ({ onSwitchMode }) => {
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginRole, setLoginRole] = useState("admin");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Connexion avec :", loginPhone, loginPassword, loginRole);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PhoneInput
        country="cd"
        value={loginPhone}
        onChange={setLoginPhone}
        inputStyle={{ width: "100%", height: "45px", borderRadius: "8px" }}
      />
      <Input
        isPassword
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
        placeholder="Mot de passe"
      />
      <select
        value={loginRole}
        onChange={(e) => setLoginRole(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md"
      >
        <option value="admin">Marchand</option>
        <option value="superadmin">Admin</option>
        <option value="partner">Distributeur</option>
        <option value="agent">Agent</option>
        <option value="user">Client</option>
      </select>

      <Button type="submit" variant="primary" className="w-full">
        Se connecter
      </Button>

      <Button variant="ghost" onClick={() => onSwitchMode("register")}>
        S'inscrire
      </Button>
      <Button variant="ghost" onClick={() => onSwitchMode("forgot")}>
        Mot de passe oublié ?
      </Button>
    </form>
  );
};

export default LoginPage;
