import { useEffect, useState, useCallback } from 'react';
import { api, setToken } from '../lib/api';

type User = { id:string; username:string; email?:string; subscriptionStatus?:string } | null;

export function useAuth() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (emailOrUsername: string, password: string) => {
    setLoading(true); setError(null);
    try {
      const { token, user } = await api.login({ emailOrUsername, password });
      await setToken(token);
      setUser(user);
    } catch (e:any) {
      setError(e.message || 'Login failed');
    } finally { setLoading(false); }
  }, []);

  const register = useCallback(async (username:string, email:string, password:string, referralCode?:string) => {
    setLoading(true); setError(null);
    try {
      const { token, user } = await api.register({ username, email, password, referralCode });
      await setToken(token);
      setUser(user);
    } catch (e:any) {
      setError(e.message || 'Register failed');
    } finally { setLoading(false); }
  }, []);

  const logout = useCallback(async () => {
    await setToken(null);
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true); setError(null);
    try { const me = await api.me(); setUser(me.user as any); } catch { /* silent */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { user, loading, error, login, register, logout, refresh };
}
