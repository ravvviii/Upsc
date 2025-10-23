import { Redirect } from 'expo-router';
import { useAuthContext } from '../context/AuthContext';

export default function Index() {
  const { user, loading } = useAuthContext();
  if (loading) return null; // Splash or loader placeholder
  if (!user) return <Redirect href="/auth/login" />;
  // Redirect to the Home tab (group name in parentheses is not part of the URL path)
  return <Redirect href="/home" />;
}

