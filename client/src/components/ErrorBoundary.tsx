// client/src/components/ErrorBoundary.tsx
import React from "react";
import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <motion.div
          className="min-h-screen flex flex-col items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Something went wrong
            </h2>
            <p className="text-text-muted mb-4">
              We're working to fix this issue. Please try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === "development" && (
              <pre className="mt-4 p-2 bg-red-500/10 rounded text-red-500 text-xs overflow-auto max-h-40">
                {this.state.error?.stack}
              </pre>
            )}
          </div>
        </motion.div>
      );
    }

    return this.props.children as React.ReactNode;
  }
}

export default ErrorBoundary;
