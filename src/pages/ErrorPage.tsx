import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error: any = useRouteError();
  if (error) {
    console.error(error);
  } else {
    console.error("No error details available");
  }

  // Determine if it's a 404 or other error
  const is404 = error?.status === 404 || !error;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        {is404 ? "404 - Page non trouvée" : "Erreur"}
      </h1>
      <p className="text-gray-700 mb-6">
        {is404
          ? "Désolé, la page que vous cherchez n’existe pas ou a été déplacée."
          : error?.message || "Une erreur inattendue s'est produite."
        }
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
