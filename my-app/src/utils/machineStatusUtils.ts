export const parseOperationMinutes = (
    time: string | number | null
): number | null => {
    if (time == null || time === '') {
        return null;
    }
    if (typeof time === 'number') {
        return time;
    }
    const match = String(time).match(/\d+/);
    return match ? Number.parseInt(match[0], 10) : null;
};

// Kept for compatibility with any existing callers; the backend value is minutes.
export const parseOperationSeconds = parseOperationMinutes;

export const getRemainingMs = (
    lastTransactionCreatedAt: string | null,
    operationMinutes: number | null
): number | null => {
    if (!lastTransactionCreatedAt || operationMinutes == null) {
        return null;
    }
    const start = new Date(lastTransactionCreatedAt);
    if (Number.isNaN(start.getTime())) {
        return null;
    }
    const end = new Date(start.getTime() + operationMinutes * 60 * 1000);
    return end.getTime() - Date.now();
};

export const formatRemainingTime = (remainingMs: number): string => {
    if (remainingMs <= 0) {
        return '(0 Mins)';
    }
    const totalSeconds = Math.ceil(remainingMs / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins > 0 && secs > 0) {
        return `(${mins} Mins ${secs} Sec)`;
    }
    if (mins > 0) {
        return `(${mins} Mins)`;
    }
    return `(${secs} Sec)`;
};
