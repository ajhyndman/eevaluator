import LogRocket from 'logrocket';
import { Component } from 'react';

import { Container, Link } from '@material-ui/core';

export class ErrorRecoveryBoundary extends Component<{ children: any }> {
  state = { hasError: false };

  componentDidCatch(error: Error) {
    this.setState({ hasError: true });
    LogRocket.captureException(error);
  }

  clearLocalStorage = () => {
    window.localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Container maxWidth="md" style={{ paddingTop: 16 }}>
          <h1>Yikes! Looks like I broke something</h1>

          <p>
            <Link href="#" onClick={this.clearLocalStorage}>
              Click here
            </Link>{' '}
            to clear your saved pokemon and reload the page.
          </p>

          <p>
            If the issue persists, consider reaching out on{' '}
            <Link href="https://twitter.com/AnkhaduVGC">Twitter</Link>,{' '}
            <Link href="https://www.reddit.com/r/VGC/comments/z3u0pi/scarlet_violet_vgc_damage_calculator/">
              Reddit
            </Link>
            , or <Link href="https://github.com/ajhyndman/eevaluator/issues">GitHub</Link>.
          </p>
        </Container>
      );
    }

    return this.props.children;
  }
}
