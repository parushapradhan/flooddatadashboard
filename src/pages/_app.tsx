import 'leaflet/dist/leaflet.css';
import * as React from 'react';
import { AppProvider,  } from '@toolpad/core/nextjs';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import type { Navigation, Session } from '@toolpad/core/AppProvider';
import theme from './theme';
import { Button } from '@mui/material';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import '#components/Map/leaflet-custom.css';
import '#src/globals.css';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

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
    segment: 'orders',
    title: 'Orders',
    icon: <ShoppingCartIcon />,
  },
];

export default function RootLayout({ children, Component, pageProps }: AppProps & { children: React.ReactNode }) {
  const router = useRouter(); // Get current route
  const [isRegisterRoute, setIsRegisterRoute] = React.useState(false);

  React.useEffect(() => {
    setIsRegisterRoute(router.pathname.startsWith('/register'));
  }, [router.pathname]);

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
                image: data.image || null,
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


  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        setSession({
          user: {
            name: 'Bharat Kashyap',
            email: 'bharatkashyap@outlook.com',
            image: 'https://avatars.githubusercontent.com/u/19550456',
          },
        });
      },
      signOut: () => {
        setSession(null);
      },
    };
  }, []);

  return (
    <>
      <Head>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
        {/* <AppRouterCacheProvider options={{ enableCssLayer: true }}> */}
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

            {isRegisterRoute ? (
              <main>{children || <Component {...pageProps} />}</main>
            ) : (

               <DashboardLayout>
                  <main>{children || <Component {...pageProps} />}</main>
              </DashboardLayout>
            )}

          </AppProvider>
        {/* </AppRouterCacheProvider> */}
    </>
  );
}
