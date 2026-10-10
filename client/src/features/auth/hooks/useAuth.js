import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getme } from "../services/auth.api";

// hook layer

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { loading, setLoading, user, setUser } = context;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      setUser(data.user);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ email, username, password }) => {
    setLoading(true);
    try {
      const data = await register({ email, username, password });
      setUser(data.user);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const data = await logout();
      setUser(null);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    setLoading,
    handleLogin,
    handleLogout,
    handleRegister,
  };
};
