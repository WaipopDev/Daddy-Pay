import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

/**
 * ErrorBoundary Component
 * Catches JavaScript errors anywhere in the component tree
 */
class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error Boundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                this.props.fallback || (
                    <div className="alert alert-danger" role="alert">
                        <h4 className="alert-heading">Something went wrong!</h4>
                        <p>
                            An error occurred while loading the information.
                            Please refresh the page or contact support if the problem persists.
                        </p>
                        <hr />
                        <p className="mb-0">
                            Error: {this.state.error?.message}
                        </p>
                    </div>
                )
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
