const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const parseEmailTags = (value: string): string[] => {
    const seen = new Set<string>();
    return value
        .split(',')
        .map((email) => email.trim().toLowerCase())
        .filter((email) => {
            if (!email || seen.has(email)) return false;
            seen.add(email);
            return true;
        });
};

export const joinEmailTags = (emails: string[]): string => emails.join(',');

export const isValidEmailTag = (email: string): boolean => EMAIL_PATTERN.test(email.trim());
