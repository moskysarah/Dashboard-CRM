import { useState, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useAuth } from "./store/auth";
import { TranslateProvider } from "./contexts/translateContext";

const App = () => {
  // Cet état garantit que nous attendons la fin de l'hydratation du store Zustand.
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // On vérifie si l'hydratation a déjà eu lieu au moment où le composant se monte.
    const isAlreadyHydrated = useAuth.persist.hasHydrated();
    if (isAlreadyHydrated) {
      setIsHydrated(true);
    } else {
      // Si ce n'est pas le cas, on s'abonne à l'événement.
      const unsubscribe = useAuth.persist.onFinishHydration(() => {
        setIsHydrated(true);
      });
      return unsubscribe; // On nettoie l'abonnement quand le composant est démonté.
    }
  }, []);

  // On n'affiche l'application que lorsque le store est prêt.
  if (!isHydrated) {
    return <div className="flex items-center justify-center h-screen">Chargement de l'application...</div>;
  }

  return (
    <TranslateProvider>
      <RouterProvider router={router} />
    </TranslateProvider>
  );
};

export default App;