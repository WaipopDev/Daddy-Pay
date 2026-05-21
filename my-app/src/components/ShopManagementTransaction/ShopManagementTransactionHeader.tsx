'use client';

import React from 'react';
import { Button } from 'react-bootstrap';

interface ShopManagementTransactionHeaderProps {
    backLabel: string;
    titleLabel: string;
    machineNameLabel: string;
    machineName: string;
    onBack: () => void;
}

const ShopManagementTransactionHeader: React.FC<ShopManagementTransactionHeaderProps> = ({
    backLabel,
    titleLabel,
    machineNameLabel,
    machineName,
    onBack,
}) => (
    <>
        <Button variant="secondary" onClick={onBack} className="mb-3 w-full md:w-auto">
            <i className="fa-solid fa-arrow-left pr-2"></i>
            {backLabel}
        </Button>

        <div className="pb-2 mb-4">
            <h2 className="text-lg md:text-xl font-bold">{titleLabel}</h2>
            {machineName && (
                <p className="text-sm md:text-base text-muted">
                    {machineNameLabel}: {machineName}
                </p>
            )}
        </div>
    </>
);

export default ShopManagementTransactionHeader;
