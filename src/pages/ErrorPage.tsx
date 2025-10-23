import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Page non trouvée</h1>
      <p className="text-gray-700 mb-6">
        Désolé, la page que vous cherchez n’existe pas ou a été déplacée.
      </p>
      <a
        href="/login"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Retour à la page de connexion
      </a>
    </div>
  );
};

export default ErrorPage;
