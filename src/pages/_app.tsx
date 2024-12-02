import 'leaflet/dist/leaflet.css';
import * as React from 'react';
import { AppProvider } from '@toolpad/core/nextjs';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import type { Navigation, Session } from '@toolpad/core/AppProvider';
import theme from './theme';
import { Button, Typography } from '@mui/material';
import type { AppProps } from 'next/app';
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

export default function RootLayout({ children, Component, pageProps }: AppProps & { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = React.useState<Session | null>(null);
  const [isClient, setIsClient] = React.useState(false);
  const [excludeLayout, setExcludeLayout] = React.useState(false);

  // Detect if the current route should exclude the layout (e.g., /login, /register)
  React.useEffect(() => {
    setIsClient(true);
    setExcludeLayout(['/login', '/register'].includes(router.pathname));

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
                image: data.image || null,
              },
            });
          } else {
            console.error('Failed to validate token');
            setSession(null);
          }
        })
        .catch((err) => {
          console.error('Error fetching session:', err);
          setSession(null);
        });
    }
  }, [router.pathname]);

  const authentication = React.useMemo(() => ({
    signIn: () => {
      router.push('/login'); // Redirect to login page
    },
    signOut: async () => {
      try {
        const response = await fetch('/api/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${Cookies.get('auth_token')}`,
          },
        });

        if (response.ok) {
          Cookies.remove('auth_token'); // Remove token from cookies
          setSession(null); // Clear session state
          router.push('/'); // Redirect to dashboard (root page)
        } else {
          console.error('Failed to logout:', await response.json());
        }
      } catch (err) {
        console.error('Logout error:', err);
      }
    },
  }), [router]);


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
          title: 'Flood Risk Indicator',
        }}
      >
        {excludeLayout ? (
          // For routes like /register or /login, render without any header or layout
          <main>{children || <Component {...pageProps} />}</main>
        ) : (
          // For all other routes, render with DashboardLayout and its header
          <DashboardLayout>
            <main>{children || <Component {...pageProps} />}</main>
          </DashboardLayout>
        )}
      </AppProvider>
    </>
  );
}
