import moment from 'moment';
import type { UserSubscribeFormData } from '@/types/userType';

export const validateUserSubscribeForm = (
    data: UserSubscribeFormData,
    lang: Record<string, string>
): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (data.subscribe === undefined || data.subscribe === null) {
        errors.subscribe =
            lang['page_user_subscribe_required'] || 'Subscription status is required';
    }

    if (data.subscribe) {
        if (!data.subscribeStartDate) {
            errors.subscribeStartDate =
                lang['page_user_subscribe_start_date_required'] ||
                'Subscribe start date is required';
        }
        if (!data.subscribeEndDate) {
            errors.subscribeEndDate =
                lang['page_user_subscribe_end_date_required'] ||
                'Subscribe end date is required';
        }
        if (data.subscribeStartDate && data.subscribeEndDate) {
            const start = moment(data.subscribeStartDate, 'YYYY-MM-DD', true);
            const end = moment(data.subscribeEndDate, 'YYYY-MM-DD', true);
            if (start.isValid() && end.isValid() && end.isBefore(start)) {
                errors.subscribeEndDate =
                    lang['page_user_subscribe_end_date_invalid'] ||
                    'End date must be on or after start date';
            }
        }
    }

    return errors;
};
