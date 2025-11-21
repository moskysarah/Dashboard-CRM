import React, { useState } from "react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { initiateMerchantTransfer, verifyMerchantTransfer, initiatePostePayTransfer, verifyPostePayTransfer } from "../api/me";

interface TransferFormProps {
  onSuccess?: () => void;
}

const TransferForm: React.FC<TransferFormProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [method, setMethod] = useState<"merchant-initiate" | "merchant-verify" | "poste-pay-initiate" | "poste-pay-verify">("merchant-initiate");
  const [formData, setFormData] = useState({
    amount: "",
    recipientId: "",
    otp: "",
    transactionId: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (method === "merchant-initiate") {
        await initiateMerchantTransfer({
          amount: parseFloat(formData.amount),
          recipient_id: formData.recipientId,
        });
      } else if (method === "merchant-verify") {
        await verifyMerchantTransfer({
          transaction_id: formData.transactionId,
          otp: formData.otp,
        });
      } else if (method === "poste-pay-initiate") {
        await initiatePostePayTransfer({
          amount: parseFloat(formData.amount),
          recipient_id: formData.recipientId,
        });
      } else if (method === "poste-pay-verify") {
        await verifyPostePayTransfer({
          transaction_id: formData.transactionId,
          otp: formData.otp,
        });
      }

      setSuccess("Transfert initié avec succès!");
      setFormData({
        amount: "",
        recipientId: "",
        otp: "",
        transactionId: "",
      });
      onSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors du transfert");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Effectuer un transfert</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de transfert
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as any)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="merchant-initiate">Marchand (Initier)</option>
            <option value="merchant-verify">Marchand (Vérifier)</option>
            <option value="poste-pay-initiate">Poste Pay (Initier)</option>
            <option value="poste-pay-verify">Poste Pay (Vérifier)</option>
          </select>
        </div>

        {(method === "merchant-initiate" || method === "poste-pay-initiate") && (
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
                ID du destinataire
              </label>
              <Input
                type="text"
                value={formData.recipientId}
                onChange={(e) => handleChange("recipientId", e.target.value)}
                placeholder="Entrez l'ID du destinataire"
                required
              />
            </div>
          </>
        )}

        {(method === "merchant-verify" || method === "poste-pay-verify") && (
          <>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OTP
              </label>
              <Input
                type="text"
                value={formData.otp}
                onChange={(e) => handleChange("otp", e.target.value)}
                placeholder="Entrez l'OTP"
                required
              />
            </div>
          </>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Traitement..." : method.includes("initiate") ? "Initier" : "Vérifier"}
        </Button>
      </form>
    </div>
  );
};

export default TransferForm;
