import React, { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

interface Props {
  onSwitchMode: (mode: "login" | "register" | "otp" | "forgot" | "resetPassword") => void;
}

const PasswordResetPage: React.FC<Props> = ({ onSwitchMode }) => {
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Réinitialisation avec :", resetCode, newPassword, confirmPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        value={resetCode}
        onChange={(e) => setResetCode(e.target.value)}
        placeholder="Code de réinitialisation"
      />
      <Input
        isPassword
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Nouveau mot de passe"
      />
      <Input
        isPassword
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirmer le mot de passe"
      />

      <Button type="submit" variant="primary" className="w-full">
        Réinitialiser
      </Button>

      <Button variant="ghost" onClick={() => onSwitchMode("forgot")}>
        Retour
      </Button>
    </form>
  );
};

export default PasswordResetPage;
