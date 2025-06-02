import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

const AuthRedirect = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(!!data.session);
    });
  }, []);

  if (isAuthenticated === null) return null;

  return isAuthenticated ? (
    <Navigate to="/calendar" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AuthRedirect;
