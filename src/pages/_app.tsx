import '../index.css';

import LogRocket from 'logrocket';
import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect } from 'react';

import { AppBar, Button, ThemeProvider, Toolbar, Typography } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import createPalette from '@material-ui/core/styles/createPalette';

import { RED, STEEL_GRAY } from '../styles';
import { pageview } from '../util/misc';

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
      // Log pageview to Google Analytics
      pageview();

      // Set up logrocket: https://app.logrocket.com/
      LogRocket.init('ltma3j/eevaluator');

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
        <AppBar color="secondary" position="static">
          <Toolbar variant="dense">
            <Typography variant="h6">Eevaluator</Typography>
            <div style={{ flexGrow: 1 }} />
            <Link href="/">
              <Button color="inherit">Damage Calculator</Button>
            </Link>
            <Link href="/cram-o-matic">
              <Button color="inherit">Cram-O-Matic</Button>
            </Link>
          </Toolbar>
        </AppBar>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
