import { createContext, useContext, useState, useEffect } from "react";
import { authService, usersService } from "../lib/supabaseService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const session = await authService.getSession();
        if (session?.user) {
          setUser(session.user);
          const userProfile = await usersService.getUserProfile(session.user.id);
          setProfile(userProfile);
          setIsAdmin(userProfile?.is_admin || false);
        }
        setLoading(false);
      } catch (err) {
        console.error("Auth init error:", err);
        setLoading(false);
      }
    };

    initAuth();

    // Listen to auth changes
    const { data: subscription } = authService.onAuthStateChanged(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        try {
          const userProfile = await usersService.getUserProfile(session.user.id);
          setProfile(userProfile);
          setIsAdmin(userProfile?.is_admin || false);
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      } else {
        setUser(null);
        setProfile(null);
        setIsAdmin(false);
      }
    });

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);

  const signup = async (email, password, metadata) => {
    try {
      setError(null);
      const result = await authService.signUp(email, password, metadata);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signin = async (email, password) => {
    try {
      setError(null);
      const result = await authService.signIn(email, password);
      setUser(result.user);
      const userProfile = await usersService.getUserProfile(result.user.id);
      setProfile(userProfile);
      setIsAdmin(userProfile?.is_admin || false);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signout = async () => {
    try {
      setError(null);
      await authService.signOut();
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    profile,
    loading,
    error,
    isAdmin,
    signup,
    signin,
    signout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
