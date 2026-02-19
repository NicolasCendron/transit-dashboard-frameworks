import { Component, type ReactNode } from "react";

interface State { hasError: boolean }

export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error" style={{ margin: "3rem auto", maxWidth: 400, textAlign: "center" }}>
          <p>Something went wrong.</p>
          <button className="btn btn-primary mt-2" onClick={() => this.setState({ hasError: false })}>
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
