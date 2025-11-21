import React, { useState } from "react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { mobileMoneyPayout, mobileMoneyStatus, airtimePayout } from "../api/me";

interface PayoutFormProps {
  onSuccess?: () => void;
}

const PayoutForm: React.FC<PayoutFormProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [method, setMethod] = useState<"mobile-money" | "airtime" | "status">("mobile-money");
  const [formData, setFormData] = useState({
    amount: "",
    phoneNumber: "",
    transactionId: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (method === "mobile-money") {
        await mobileMoneyPayout({
          amount: parseFloat(formData.amount),
          phone_number: formData.phoneNumber,
        });
      } else if (method === "airtime") {
        await airtimePayout({
          amount: parseFloat(formData.amount),
          phone_number: formData.phoneNumber,
        });
      } else if (method === "status") {
        await mobileMoneyStatus({
          transaction_id: formData.transactionId,
        });
      }

      setSuccess("Paiement initié avec succès!");
      setFormData({
        amount: "",
        phoneNumber: "",
        transactionId: "",
      });
      onSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors du paiement");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Effectuer un paiement</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de paiement
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as any)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="mobile-money">Mobile Money</option>
            <option value="airtime">Airtime</option>
            <option value="status">Vérifier le statut</option>
          </select>
        </div>

        {(method === "mobile-money" || method === "airtime") && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Montant
              </label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                placeholder="Entrez le montant"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de téléphone
              </label>
              <Input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                placeholder="Entrez le numéro"
                required
              />
            </div>
          </>
        )}

        {method === "status" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID de transaction
            </label>
            <Input
              type="text"
              value={formData.transactionId}
              onChange={(e) => handleChange("transactionId", e.target.value)}
              placeholder="Entrez l'ID de transaction"
              required
            />
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Traitement..." : method === "status" ? "Vérifier" : "Payer"}
        </Button>
      </form>
    </div>
  );
};

export default PayoutForm;
