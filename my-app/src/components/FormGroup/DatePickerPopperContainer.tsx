'use client';

import React from 'react';
import { createPortal } from 'react-dom';

/**
 * Renders datepicker popper into document.body so it stacks above Bootstrap modals.
 */
const DatePickerPopperContainer: React.FC<{ children?: React.ReactNode }> = ({
    children,
}) => {
    if (typeof document === 'undefined') {
        return <>{children}</>;
    }

    return createPortal(
        <div className="react-datepicker-popper-container">{children}</div>,
        document.body
    );
};

export default DatePickerPopperContainer;
