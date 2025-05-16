
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore, checkUserRole } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setSession, setIsAdmin, setIsLoading } = useAuthStore();

  useEffect(() => {
    // Imposta prima il listener per i cambiamenti di stato
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Utilizziamo setTimeout per evitare deadlock
          setTimeout(async () => {
            const isAdmin = await checkUserRole(session.user.id);
            setIsAdmin(isAdmin);
          }, 0);
        } else {
          setIsAdmin(false);
        }

        setIsLoading(false);
      }
    );

    // Poi verifica la sessione esistente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        checkUserRole(session.user.id).then((isAdmin) => {
          setIsAdmin(isAdmin);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setUser, setSession, setIsAdmin, setIsLoading]);

  return <>{children}</>;
}
