import '../index.css';

import LogRocket from 'logrocket';
import Head from 'next/head';
import React, { useEffect } from 'react';

import { ThemeProvider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import createPalette from '@material-ui/core/styles/createPalette';

import { ErrorRecoveryBoundary } from '../components/ErrorRecoveryBoundary';
import Header from '../components/Header';
import { unregister } from '../serviceWorker';
import { RED, STEEL_GRAY } from '../styles';
import { pageview } from '../util/misc';

const LOGROCKET_SAMPLE_RATE = 0.1;

const THEME = createMuiTheme({
  palette: createPalette({
    primary: { main: RED },
    secondary: { main: STEEL_GRAY },
    text: {
      primary: '#222233',
      secondary: 'rgba(0, 0, 10, 0.8)',
    },
  }),
});

export default function App({ Component, pageProps }: any) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      // clean up service worker from CRA version
      unregister();

      // Log pageview to Google Analytics
      pageview();

      // Set up logrocket: https://app.logrocket.com/
      LogRocket.init('ltma3j/eevaluator', {
        shouldCaptureIP: false,
        shouldSendData: () => Math.random() < LOGROCKET_SAMPLE_RATE,
      });

      import('@wisersolutions/heap-analytics/lib/heap').then(() => {
        // Set up Heap Analytivcs: https://heap.io/
        // @ts-ignore: Don't try to follow the types on this global
        window?.heap?.load('3355348701');
      });
    }
  }, []);

  useEffect(() => {
    // Remove material-ui's server-side injected CSS.
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles != null) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href={`${process.env.NEXT_PUBLIC_URL}/favicon.ico`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href={`${process.env.NEXT_PUBLIC_URL}/logo192.png`} />
        <link rel="manifest" href={`${process.env.NEXT_PUBLIC_URL}/manifest.json`} />
      </Head>
      <ThemeProvider theme={THEME}>
        <Header />
        <ErrorRecoveryBoundary>
          <Component {...pageProps} />
        </ErrorRecoveryBoundary>
      </ThemeProvider>
    </>
  );
}
