import { useEffect, useState } from 'react';
import {
    formatRemainingTime,
    getRemainingMs,
    parseOperationMinutes,
} from '@/utils/machineStatusUtils';

export const useMachineOperationCountdown = (
    lastTransactionCreatedAt: string | null,
    machineProgramOperationTime: string | number | null,
    enabled: boolean
) => {
    const operationMinutes = parseOperationMinutes(machineProgramOperationTime);

    const [remainingLabel, setRemainingLabel] = useState<string | null>(() => {
        if (!enabled) return null;
        const remainingMs = getRemainingMs(
            lastTransactionCreatedAt,
            operationMinutes
        );
        return remainingMs != null ? formatRemainingTime(remainingMs) : null;
    });

    useEffect(() => {
        if (!enabled || operationMinutes == null || !lastTransactionCreatedAt) {
            setRemainingLabel(null);
            return;
        }

        const update = () => {
            const remainingMs = getRemainingMs(
                lastTransactionCreatedAt,
                operationMinutes
            );
            setRemainingLabel(
                remainingMs != null ? formatRemainingTime(remainingMs) : null
            );
        };

        update();
        const intervalId = window.setInterval(update, 1000);
        return () => window.clearInterval(intervalId);
    }, [enabled, lastTransactionCreatedAt, operationMinutes]);

    return remainingLabel;
};
