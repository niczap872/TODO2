import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Login from '../components/Login';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return <Login />;
}
