import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import ProtectedRoute from 'src/routes/components/protected_route';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export const ContentPage = lazy(() => import('src/pages/content'));
export const CreateContentPage = lazy(() => import('src/pages/create-content'));
export const UpdateContentPage = lazy(() => import('src/pages/update-content'));

export const CategoryPage = lazy(() => import('src/pages/category'));
export const CreateCategoryPage = lazy(() => import('src/pages/create-category'));
export const UpdateCategoryPage = lazy(() => import('src/pages/update-category'));

export const UploaderPage = lazy(() => import('src/pages/uploader'));

export const SignInPage = lazy(() => import('src/pages/sign-in'));

export const Page404 = lazy(() => import('src/pages/page-not-found'));

const renderFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export const routesSection: RouteObject[] = [
  {
    element: (
      <DashboardLayout>
        <Suspense fallback={renderFallback()}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      { index: true, element: <ProtectedRoute Element={<ContentPage />} /> },
      {
        path: '/contents/create',
        element: <ProtectedRoute Element={<CreateContentPage />} />,
      },
      {
        path: '/contents/edit/:id',
        element: <ProtectedRoute Element={<UpdateContentPage />} />,
      },
      {
        path: '/categories',
        element: <ProtectedRoute Element={<CategoryPage />} />,
      },
      {
        path: '/categories/create',
        element: <ProtectedRoute Element={<CreateCategoryPage />} />,
      },
      {
        path: '/categories/edit/:id',
        element: <ProtectedRoute Element={<UpdateCategoryPage />} />,
      },
      {
        path: '/uploaders',
        element: <ProtectedRoute isAdminOnly Element={<UploaderPage />} />,
      },
    ],
  },
  {
    path: 'sign-in',
    element: (
      <AuthLayout>
        <SignInPage />
      </AuthLayout>
    ),
  },
  {
    path: '404',
    element: <Page404 />,
  },
  { path: '*', element: <Page404 /> },
];
