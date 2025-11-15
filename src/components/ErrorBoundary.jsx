import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // you could send this to an error logging service
    this.setState({ error, info });
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
        <div className="max-w-3xl w-full bg-white/5 border border-white/10 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-sm text-white/70 mb-4">An unexpected error occurred while rendering the app. Details are shown below.</p>
          <pre className="text-xs bg-black/60 p-3 rounded text-red-300 overflow-auto max-h-64">{String(this.state.error && this.state.error.stack ? this.state.error.stack : this.state.error)}</pre>
          {this.state.info && (
            <details className="mt-3 text-xs text-white/60">
              <summary>Component stack</summary>
              <pre className="whitespace-pre-wrap">{this.state.info.componentStack}</pre>
            </details>
          )}
          <div className="mt-4">
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-black rounded">Reload</button>
          </div>
        </div>
      </div>
    );
  }
}
