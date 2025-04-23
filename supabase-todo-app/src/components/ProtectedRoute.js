import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && router.pathname !== '/' && !router.pathname.includes('/auth')) {
      router.push('/');
    }
  }, [router, user]);

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
