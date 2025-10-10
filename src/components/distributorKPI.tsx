import React, { useEffect, useState } from "react";
import { useTranslationContext } from "../contexts/translateContext";

type KPIProps = {
  title: string;
  value: number;
  color?: string;
};

const DistributorKPI: React.FC<KPIProps> = ({ title, value, color = "bg-purple-100" }) => {
  const { translate } = useTranslationContext();
  const [translatedTitle, setTranslatedTitle] = useState(title);

  useEffect(() => {
    const translateTitle = async () => {
      const translated = await translate(title);
      setTranslatedTitle(translated);
    };
    translateTitle();
  }, [title, translate]);

  return (
    <div className={`p-3 rounded-2xl shadow ${color}`}>
      <p className="text-xs sm:text-sm font-bold">{translatedTitle}</p>
      <p className="text-xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default DistributorKPI;
