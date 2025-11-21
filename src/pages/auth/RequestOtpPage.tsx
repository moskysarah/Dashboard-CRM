import React, { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface Props {
  onSwitchMode: (mode: "login" | "register" | "otp" | "forgot" | "resetPassword") => void;
}

const RequestOtpPage: React.FC<Props> = ({ onSwitchMode }) => {
  const [otpPhone, setOtpPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("OTP avec :", otpPhone, otpCode);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PhoneInput
        country="cd"
        value={otpPhone}
        onChange={setOtpPhone}
        inputStyle={{ width: "100%", height: "45px", borderRadius: "8px" }}
      />
      <Input
        value={otpCode}
        onChange={(e) => setOtpCode(e.target.value)}
        placeholder="Code OTP"
      />

      <Button type="submit" variant="primary" className="w-full">
        Vérifier OTP
      </Button>

      <Button variant="ghost" onClick={() => onSwitchMode("register")}>
        Retour à l'inscription
      </Button>
    </form>
  );
};

export default RequestOtpPage;
