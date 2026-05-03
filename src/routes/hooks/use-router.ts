import { useMemo } from 'react';
import { useLocation, useNavigate, type NavigateOptions } from 'react-router';

// ----------------------------------------------------------------------

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();

  const router = useMemo(
    () => ({
      getLocation: () => location.pathname,
      back: () => navigate(-1),
      forward: () => navigate(1),
      refresh: () => navigate(0),
      push: (href: string, opt?: NavigateOptions) => navigate(href, opt),
      replace: (href: string) => navigate(href, { replace: true }),
    }),
    [navigate, location]
  );

  return router;
}

export type RouterType = ReturnType<typeof useRouter>;
