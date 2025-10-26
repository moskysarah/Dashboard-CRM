import { useState, useEffect } from 'react';
import { useTranslate } from '../contexts/translateContext';

interface TProps {
  children: string;
}

const T: React.FC<TProps> = ({ children }) => {
  const { language, translate } = useTranslate();
  const [translatedText, setTranslatedText] = useState<string>(children);

  useEffect(() => {
    const performTranslation = async () => {
      if (language === 'fr') {
        setTranslatedText(children);
        return;
      }

      try {
        const result = await translate(children);
        setTranslatedText(result);
      } catch (error) {
        console.error('Translation error in T component:', error);
        setTranslatedText(children); // Fallback
      }
    };

    performTranslation();
  }, [children, language, translate]);

  // Forcer le re-rendu quand une langue change pour assurer la traduction immediat
  useEffect(() => {
    if (language === 'fr') {
      setTranslatedText(children);
    }
  }, [language, children]);

  return <>{translatedText}</>;
};

export default T;
