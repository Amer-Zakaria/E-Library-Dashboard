import { Navigate } from 'react-router-dom';
import { useEffect, type ReactElement } from 'react';

import { setRouter } from 'src/utils/router-services';
import { getToken, getUserName } from 'src/utils/token';

import { useRouter } from '../hooks';

interface IProtectedRoute {
  Element: ReactElement;
  isAdminOnly?: boolean;
}

export default function ProtectedRoute({ Element, isAdminOnly }: IProtectedRoute) {
  const username = getUserName();
  const router = useRouter();

  useEffect(() => {
    setRouter(router);
  }, [router]);

  if (!getToken()) {
    return <Navigate to="/sign-in" state={{ from: router.getLocation() }} />;
  }

  if (isAdminOnly && username !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return Element;
}
