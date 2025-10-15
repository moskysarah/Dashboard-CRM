import { useContext } from 'react';
import { TranslateContext } from '../contexts/translateContext.ts';

export const useTranslate = () => {
  const context = useContext(TranslateContext);
  if (!context) {
    throw new Error('useTranslate must be used within a TranslateProvider');
  }
  return context;
};
