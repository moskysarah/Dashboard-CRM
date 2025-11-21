import React, { useState, useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { TrendingUp, Plus, Minus, Wallet } from 'lucide-react';

const PartnerWalletCard: React.FC = () => {
  const { wallet, loading } = useWallet();
  const [animatedBalance, setAnimatedBalance] = useState(0);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    if (wallet?.balance !== undefined) {
      const timer = setTimeout(() => {
        setAnimatedBalance(wallet.balance);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [wallet?.balance]);

  const handleDeposit = () => {
    // Implement deposit logic
    console.log('Deposit:', depositAmount);
    setShowDepositModal(false);
    setDepositAmount('');
  };

  const handleWithdraw = () => {
    // Implement withdraw logic
    console.log('Withdraw:', withdrawAmount);
    setShowWithdrawModal(false);
    setWithdrawAmount('');
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 p-8 rounded-2xl shadow-2xl animate-pulse">
        <div className="h-8 bg-white/20 rounded mb-4"></div>
        <div className="h-12 bg-white/20 rounded mb-6"></div>
        <div className="flex space-x-4">
          <div className="h-12 w-24 bg-white/20 rounded-lg"></div>
          <div className="h-12 w-24 bg-white/20 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-br w-full from-blue-600 via-purple-600 to-indigo-700 p-4 md:p-6 lg:p-8 rounded-xl transition-all duration-300 transform hover:scale-105 md:hover:scale-102 h-[350px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="bg-white/20 p-2 rounded-full">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white text-lg font-bold">Partner Wallet</h3>
              <p className="text-purple-100 text-xs">Balance Overview</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-green-300" />
            <span className="text-green-300 text-xs font-semibold">+15.2%</span>
          </div>
        </div>

        {/* Balance */}
        <div className="mb-4">
          <p className="text-purple-100 text-xs mb-1">Balance courant</p>
          <div className="text-2xl font-bold text-white mb-1">
            ${animatedBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-3 h-3 text-green-300" />
            <span className="text-green-300 text-xs">+3.1% pour le mois dernier</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => setShowDepositModal(true)}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-1 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Dépot</span>
          </button>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-1 shadow-md"
          >
            <Minus className="w-4 h-4" />
            <span className="text-sm">Rétrait</span>
          </button>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Dépot trouvé</h3>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDepositModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-all duration-200"
              >
                Sortir
              </button>
              <button
                onClick={handleDeposit}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
              >
                Déposer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Rétrait trouvé</h3>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex space-x-4">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-all duration-200"
              >
                Sortir
              </button>
              <button
                onClick={handleWithdraw}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
              >
                rétirer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PartnerWalletCard;
