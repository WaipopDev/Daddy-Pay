'use client';

import React from 'react';
import { Button } from 'react-bootstrap';

interface LanguageSettingsToolbarProps {
    addLabel: string;
    onAdd: () => void;
}

const LanguageSettingsToolbar: React.FC<LanguageSettingsToolbarProps> = ({
    addLabel,
    onAdd,
}) => (
    <div className="flex justify-end pb-2 mb-4">
        <Button variant="primary" className="w-full md:w-auto" onClick={onAdd}>
            <i className="fa-solid fa-plus pr-2"></i>
            {addLabel}
        </Button>
    </div>
);

export default LanguageSettingsToolbar;
