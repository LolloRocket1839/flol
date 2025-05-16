
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Reindirizza se l'utente è già autenticato
  React.useEffect(() => {
    if (user) {
      navigate("/admin");
    }
  }, [user, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        toast({
          title: "Registrazione completata",
          description: "Controlla la tua email per confermare la registrazione.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        toast({
          title: "Accesso effettuato",
          description: "Benvenuto nel sistema.",
        });
        navigate("/admin");
      }
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore durante l'autenticazione",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isSignUp ? "Registrazione" : "Accesso"}</CardTitle>
          <CardDescription>
            {isSignUp
              ? "Crea un nuovo account per accedere al pannello di amministrazione"
              : "Accedi per gestire i contenuti del sito"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="nome@esempio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {isSignUp ? "Registrati" : "Accedi"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button variant="link" className="w-full" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Hai già un account? Accedi" : "Non hai un account? Registrati"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthPage;
