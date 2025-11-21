import { useWallet } from "../../hooks/useWallet";

const WalletCard = () => {
  const { wallet } = useWallet();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Wallet Balance</h3>
      <p className="text-2xl font-bold text-green-600">
        ${wallet?.balance || 0}
      </p>
    </div>
  );
};

export default WalletCard;
