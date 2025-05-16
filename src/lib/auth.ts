
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isAdmin: false,
      isLoading: true,
      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setIsAdmin: (isAdmin) => set({ isAdmin }),
      setIsLoading: (isLoading) => set({ isLoading }),
      signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null, session: null, isAdmin: false });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

export async function checkUserRole(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .single();

  if (error || !data) {
    return false;
  }

  return true;
}
