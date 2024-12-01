import 'leaflet/dist/leaflet.css';
import * as React from 'react';
import { AppProvider } from '@toolpad/core/nextjs';
import DashboardIcon from '@mui/icons-material/Dashboard';
// import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import type { Navigation, Session } from '@toolpad/core/AppProvider';
import theme from './theme';
import Head from 'next/head';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import '#components/Map/leaflet-custom.css';
import '#src/globals.css';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import HomeIcon from '@mui/icons-material/Home';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: '',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
    {
    segment: 'listings',
    title: 'Your Listing',
    icon: <HomeIcon />,
  },
];

export default function App({ Component, pageProps }: any) {
  const router = useRouter();
  const [session, setSession] = React.useState<Session | null>(null);

  React.useEffect(() => {
    const token = Cookies.get('auth_token');
    if (token) {
      fetch('/api/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (response) => {
          if (response.ok) {
            const data = await response.json();
            setSession({
              user: {
                name: data.name,
                email: data.email,
              },
            });
          } else {
            console.error('Failed to validate token');
            setSession(null); // Reset session on failure
          }
        })
        .catch((err) => {
          console.error('Error fetching session:', err);
          setSession(null);
        });
    }
  }, []);

  const authentication = React.useMemo(() => ({
    signIn: () => {
      router.push('/login'); // Redirect to login page
    },
    signOut: () => {
      Cookies.remove('auth_token');
      setSession(null);
      router.push('/login'); // Redirect to login page after sign out
    },
  }), [router]);

  // Determine if the current page should exclude the global layout
  const excludeLayout = ['/login', '/register'].includes(router.pathname);

  return (
    <>
      <Head>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <AppProvider
        theme={theme}
        navigation={NAVIGATION}
        session={session}
        authentication={authentication}
        branding={{
          logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
          title: 'Flood Monitoring System',
        }}
      >
        {excludeLayout ? (
          // Render pages like /login or /register without the DashboardLayout
          <Component {...pageProps} />
        ) : (
          // Wrap all other pages in the DashboardLayout
          <DashboardLayout>
            <Component {...pageProps} />
          </DashboardLayout>
        )}
      </AppProvider>
    </>
  );
}
