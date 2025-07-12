import React from 'react';
import { PAGINATION_CONFIG } from '@/constants/main';

interface LoadingSkeletonProps {
    columnCount: number; // Optional prop to specify number of columns
}
/**
 * LoadingSkeleton Component
 * Provides loading skeleton for shop info table
 */
const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ columnCount }) => {
    // Create skeleton rows
    const skeletonRows = Array.from({ length: PAGINATION_CONFIG.ITEMS_PER_PAGE }, (_, index) => (
        <tr key={index}>
            {Array.from({ length: columnCount }, (_, colIndex) => (
                <td key={colIndex}>
                    <div 
                        className="placeholder-glow"
                        style={{ height: '20px', backgroundColor: '#e9ecef', borderRadius: '4px' }}
                    >
                        <span className="placeholder col-12"></span>
                    </div>
                </td>
            ))}
        </tr>
    ));

    return (
        <>
            {skeletonRows}
        </>
    );
};

LoadingSkeleton.displayName = 'LoadingSkeleton';

export default LoadingSkeleton;
