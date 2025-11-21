import React, { useState } from "react";
import { useA2BCredit } from "../hooks/useA2BCredit";

const A2BCredit: React.FC = () => {
  const { remove, transfer, loading, error, result } = useA2BCredit();
  const [amount, setAmount] = useState(0);
  const [target, setTarget] = useState("");

  const handleRemove = () => remove({ amount, target });
  const handleTransfer = () => transfer({ amount, target });

  return (
    <div>
      <h1>A2B Credit</h1>
      <input type="text" placeholder="Target ID" value={target} onChange={(e) => setTarget(e.target.value)} />
      <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      <button onClick={handleRemove}>Remove Credit</button>
      <button onClick={handleTransfer}>Transfer Credit</button>
      {loading && <p>Processing...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
};

export default A2BCredit;
