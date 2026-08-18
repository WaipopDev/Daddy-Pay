'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Renders datepicker popper into document.body so it stacks above Bootstrap modals.
 */
const DatePickerPopperContainer: React.FC<{ children?: React.ReactNode }> = ({
    children,
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <>{children}</>;
    }

    return createPortal(
        <div className="react-datepicker-popper-container">{children}</div>,
        document.body
    );
};

export default DatePickerPopperContainer;
