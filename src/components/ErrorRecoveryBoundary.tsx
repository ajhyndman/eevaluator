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
          <h1>Something went wrong.</h1>

          <p>
            <Link href="#" onClick={this.clearLocalStorage}>
              Click here
            </Link>{' '}
            to try clearing your saved pokemon and reload the page.
          </p>

          <p>If the issue persists, consider reaching out on Twitter, Reddit, or GitHub.</p>
        </Container>
      );
    }

    return this.props.children;
  }
}
