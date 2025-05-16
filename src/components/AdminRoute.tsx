
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";

export const AdminRoute = () => {
  const { user, isAdmin, isLoading } = useAuthStore();

  // Mostra un loader mentre verifichiamo l'autenticazione
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fintool-blue"></div>
      </div>
    );
  }

  // Se l'utente non è autenticato, reindirizza alla pagina di login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Se l'utente è autenticato ma non è admin, mostra un messaggio di errore
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Accesso negato</h1>
        <p>Non hai i permessi per accedere a questa pagina.</p>
      </div>
    );
  }

  // Se l'utente è admin, mostra il contenuto della rotta
  return <Outlet />;
};
