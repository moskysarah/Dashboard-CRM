import React, { useEffect, useState } from "react";
import { useTranslationContext } from "../contexts/translateContext";

interface TProps {
  text: string;
  className?: string;
}

const T: React.FC<TProps> = ({ text, className }) => {
  const { translate, language } = useTranslationContext();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    const load = async () => {
      const result = await translate(text);
      setTranslated(result);
    };
    load();
  }, [text, language]);

  return <span className={className}>{translated}</span>;
};

export default T;
