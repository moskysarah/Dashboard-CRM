import axios from 'axios';

const API_KEY = import.meta.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY;
const BASE_URL = 'https://translation.googleapis.com/language/translate/v2';

export interface TranslateResponse {
  data: {
    translations: Array<{
      translatedText: string;
    }>;
  };
}

// Mock translations for demo purposes when API key is not available
const mockTranslations: Record<string, Record<string, string>> = {
  en: {
    'Dashboard': 'Dashboard',
    'logout': 'Logout',
    'Français': 'French',
    'English': 'English',
    'العربية': 'Arabic',
    'Poste Smart': 'Poste Smart',
    'Tableau de bord': 'Dashboard',
    'Utilisateurs': 'Users',
    'Finance': 'Finance',
    'Vente': 'Sales',
    'distributeur': 'Distributor',
    'Paramètre': 'Settings',
    'Admin': 'Admin',
    'Chargement des performances...': 'Loading performances...',
    'Marchand': 'Merchant',
    'Performance et transactions des marchands.': 'Merchant performance and transactions.',
    'Ventes totales': 'Total Sales',
    'Transactions réussies': 'Successful Transactions',
    'En attente': 'Pending',
    'Échouées': 'Failed',
    'Suivi des performances': 'Performance Tracking',
    'Nom': 'Name',
    'Gestion des Utilisateurs': 'User Management',
    'Profil': 'Profile',
    'Email': 'Email',
    'Date Inscription': 'Registration Date',
    'Rôle': 'Role',
    'Statut': 'Status',
    'Actions': 'Actions',
    'Rechercher une option': 'Search an option',
    'Actif': 'Active',
    'Suspendu': 'Suspended',
    'Suspendre': 'Suspend',
    'Activer': 'Activate',
    'Page': 'Page',
    'sur': 'of',
    'utilisateurs': 'users',
    'Précédent': 'Previous',
    'Suivant': 'Next',
    'admin': 'admin',
    'user': 'user',
    'superadmin': 'superadmin',
    'Sous-magasin': 'Sub-store',
    'Transactions': 'Transactions',
    'Succès': 'Success',
    'Total (€)': 'Total (€)',
    'Exporter CSV': 'Export CSV',
    'Distributeur': 'Distributor',
    'Performance et transactions des distributeurs.': 'Distributor performance and transactions.',
    'Commission moyenne': 'Average Commission',
    'Stock disponible': 'Available Stock',
  },
  ar: {
    'Dashboard': 'لوحة التحكم',
    'logout': 'تسجيل الخروج',
    'Français': 'الفرنسية',
    'English': 'الإنجليزية',
    'العربية': 'العربية',
    'Poste Smart': 'بوست سمارت',
    'Tableau de bord': 'لوحة التحكم',
    'Utilisateurs': 'المستخدمون',
    'Finance': 'المالية',
    'Vente': 'المبيعات',
    'distributeur': 'الموزع',
    'Paramètre': 'الإعدادات',
    'Admin': 'المدير',
    'Chargement des performances...': 'جارٍ تحميل الأداء...',
    'Marchand': 'التاجر',
    'Performance et transactions des marchands.': 'أداء التجار والمعاملات.',
    'Ventes totales': 'إجمالي المبيعات',
    'Transactions réussies': 'المعاملات الناجحة',
    'En attente': 'في الانتظار',
    'Échouées': 'فاشلة',
    'Suivi des performances': 'تتبع الأداء',
    'Nom': 'الاسم',
    'Sous-magasin': 'المتجر الفرعي',
    'Transactions': 'المعاملات',
    'Succès': 'النجاح',
    'Total (€)': 'الإجمالي (€)',
    'Exporter CSV': 'تصدير CSV',
    'Distributeur': 'الموزع',
    'Performance et transactions des distributeurs.': 'أداء الموزعين والمعاملات.',
    'Commission moyenne': 'متوسط العمولة',
    'Stock disponible': 'المخزون المتاح',
  },
};

export const translateText = async (
  text: string,
  targetLanguage: string,
  sourceLanguage: string = 'fr'
): Promise<string> => {
  if (!API_KEY) {
    console.warn('Google Translate API key not found. Using mock translations for demo.');
    // Return mock translation if available, otherwise original text
    const mock = mockTranslations[targetLanguage]?.[text];
    return mock || text;
  }

  try {
    const response = await axios.post<TranslateResponse>(BASE_URL, null, {
      params: {
        q: text,
        target: targetLanguage,
        source: sourceLanguage,
        key: API_KEY,
      },
    });

    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    // Fallback to mock translation or original text
    const mock = mockTranslations[targetLanguage]?.[text];
    return mock || text;
  }
};
