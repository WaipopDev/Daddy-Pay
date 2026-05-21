'use client';

import React from 'react';
import { Table } from 'react-bootstrap';
import type { TranslationsMap } from '@/types/languageSettingsType';

interface LanguageTranslationsTableProps {
    labels: Record<string, string>;
    translations: TranslationsMap;
}

const LanguageTranslationsTable: React.FC<LanguageTranslationsTableProps> = ({
    labels,
    translations,
}) => {
    const entries = Object.entries(translations);
    const hasData = entries.length > 0;

    return (
        <div className="table-responsive-wrapper">
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th className="text-sm md:text-base">{labels.key}</th>
                        <th className="text-sm md:text-base">{labels.value}</th>
                    </tr>
                </thead>
                <tbody>
                    {hasData ? (
                        entries.map(([key, value]) => (
                            <tr key={key}>
                                <td className="text-xs md:text-sm font-medium">{key}</td>
                                <td className="text-xs md:text-sm">{value}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={2} className="text-center text-xs md:text-sm">
                                {labels.noData}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default LanguageTranslationsTable;
