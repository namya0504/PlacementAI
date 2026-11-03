import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Page-level error boundary. Catches render errors in any child page component
 * so a single broken widget doesn't crash the entire app.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomePage />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console in development; swap for a monitoring service (Sentry etc.) in production
    console.error('[ErrorBoundary] Render error:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const isDev = import.meta.env.DEV;

    return (
      <div className="min-h-screen bg-[#F8F9FE] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#EAEBF4] shadow-sm p-8 text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 font-outfit mb-1">
              Something went wrong
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              This page encountered an unexpected error. Your data is safe — try refreshing or go back to the dashboard.
            </p>
          </div>

          {isDev && this.state.error && (
            <pre className="text-left text-[10px] bg-slate-50 border border-slate-200 rounded-xl p-3 overflow-auto max-h-40 text-red-700 font-mono">
              {this.state.error.message}
            </pre>
          )}

          <div className="flex gap-3 justify-center">
            <button
              onClick={this.handleReset}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9] transition shadow-md shadow-purple-500/20"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try again
            </button>
            <Link
              to="/"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
