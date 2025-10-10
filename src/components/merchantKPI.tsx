import React from "react";
import { useTranslationContext } from "../contexts/translateContext";

type KPIProps = {
  title: string;
  value: number;
  color?: string;
};

const MerchantKPI: React.FC<KPIProps> = ({ title, value, color = "bg-blue-500" }) => {
  const { translate } = useTranslationContext();

  return (
    <div className={`p-4 rounded-2xl shadow ${color} text-black`}>
      <p className="text-sm font-bold">{translate(title)}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default MerchantKPI;
