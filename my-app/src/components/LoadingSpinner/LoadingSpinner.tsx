import React from 'react';

interface LoadingSpinnerProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

/**
 * LoadingSpinner component for displaying loading state
 * @param message - Custom loading message
 * @param size - Spinner size (sm, md, lg)
 * @param className - Additional CSS classes
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
    message = "Loading...", 
    size = "md",
    className = ""
}) => {
    const sizeClasses = {
        sm: "spinner-border-sm",
        md: "",
        lg: "spinner-border-lg"
    };

    return (
        <div className={`text-center p-4 ${className}`}>
            <div className={`d-inline-block spinner-border ${sizeClasses[size]}`} role="status">
                <span className="visually-hidden">{message}</span>
            </div>
            <p className="mt-2">{message}</p>
        </div>
    );
};

// Component display name for debugging
LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
