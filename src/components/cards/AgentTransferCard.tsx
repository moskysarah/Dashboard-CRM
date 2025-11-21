import React, { useState } from 'react';
import { useTransfer } from '../../hooks/useTransfer';
import { Send, DollarSign, CheckCircle } from 'lucide-react';

const AgentTransferCard: React.FC = () => {
  const { initiateTransfer, verifyTransfer, loading, error, result, step } = useTransfer();
  const [transferData, setTransferData] = useState({
    amount: '',
    recipient: '',
    description: '',
  });
  const [otp, setOtp] = useState('');

  const handleInitiateTransfer = async () => {
    if (!transferData.amount || !transferData.recipient) return;

    await initiateTransfer({
      amount: parseFloat(transferData.amount),
      recipient: transferData.recipient,
      description: transferData.description,
    });
  };

  const handleVerifyTransfer = async () => {
    if (!otp) return;

    await verifyTransfer({ otp });
  };



  return (
    <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-700 p-4 md:p-6 lg:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 md:hover:scale-102">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="bg-white/20 p-2 rounded-full">
            <Send className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white text-lg font-bold">Transférer</h3>
            <p className="text-indigo-100 text-xs">Envoyer de l'argent</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {step === 'initiate' && (
          <>
            <div>
              <label className="block text-indigo-100 text-sm mb-1">Destinataire</label>
              <input
                type="text"
                value={transferData.recipient}
                onChange={(e) => setTransferData({ ...transferData, recipient: e.target.value })}
                placeholder="Numéro de téléphone ou ID"
                className="w-full p-3 border border-indigo-300 rounded-lg bg-white/10 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-indigo-100 text-sm mb-1">Montant</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-5 h-5 text-indigo-300" />
                <input
                  type="number"
                  value={transferData.amount}
                  onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full pl-10 p-3 border border-indigo-300 rounded-lg bg-white/10 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-indigo-100 text-sm mb-1">Description (optionnel)</label>
              <textarea
                value={transferData.description}
                onChange={(e) => setTransferData({ ...transferData, description: e.target.value })}
                placeholder="Motif du transfert"
                rows={2}
                className="w-full p-3 border border-indigo-300 rounded-lg bg-white/10 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              />
            </div>

            <button
              onClick={handleInitiateTransfer}
              disabled={loading || !transferData.amount || !transferData.recipient}
              className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-md"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Initier le transfert</span>
                </>
              )}
            </button>
          </>
        )}

        {step === 'verify' && (
          <>
            <div className="text-center mb-4">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
              <p className="text-indigo-100 text-sm">
                Un code OTP a été envoyé. Veuillez le saisir pour confirmer le transfert.
              </p>
            </div>

            <div>
              <label className="block text-indigo-100 text-sm mb-1">Code OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Entrez le code OTP"
                className="w-full p-3 border border-indigo-300 rounded-lg bg-white/10 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-center text-lg font-mono"
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => window.location.reload()} // Reset to initial state
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
              >
                Annuler
              </button>
              <button
                onClick={handleVerifyTransfer}
                disabled={loading || !otp}
                className="flex-1 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-md"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Confirmer</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {error && (
          <div className="text-red-300 text-sm bg-red-500/20 p-3 rounded-lg">
            {error}
          </div>
        )}

        {result && step === 'complete' && (
          <div className="text-green-300 text-sm bg-green-500/20 p-3 rounded-lg">
            Transfert effectué avec succès!
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentTransferCard;
