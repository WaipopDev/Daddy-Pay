import moment from 'moment';
import { isOnlinePaymentStatus } from '@/constants/shopInfo';
import type { ShopOnlinePaymentFormData } from '@/types/shopInfoType';

const DATE_FORMAT = 'YYYY-MM-DD';

const isValidDate = (value: string): boolean =>
    moment(value, DATE_FORMAT, true).isValid();

export const validateOnlinePaymentForm = (
    data: ShopOnlinePaymentFormData,
    lang: Record<string, string>
): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!data.onlinePaymentStatus) {
        errors.onlinePaymentStatus = lang['validation_online_payment_status_required'];
    } else if (!isOnlinePaymentStatus(data.onlinePaymentStatus)) {
        errors.onlinePaymentStatus = lang['validation_online_payment_status_invalid'];
    }

    if (!data.onlineActivationDate?.trim()) {
        errors.onlineActivationDate = lang['validation_online_activation_date_required'];
    } else if (!isValidDate(data.onlineActivationDate)) {
        errors.onlineActivationDate = lang['validation_online_activation_date_invalid'];
    }

    if (!data.onlineCloseDate?.trim()) {
        errors.onlineCloseDate = lang['validation_online_close_date_required'];
    } else if (!isValidDate(data.onlineCloseDate)) {
        errors.onlineCloseDate = lang['validation_online_close_date_invalid'];
    }

    if (
        !errors.onlineActivationDate &&
        !errors.onlineCloseDate &&
        moment(data.onlineCloseDate, DATE_FORMAT).isBefore(
            moment(data.onlineActivationDate, DATE_FORMAT)
        )
    ) {
        errors.onlineCloseDate = lang['validation_online_close_date_before_activation'];
    }

    return errors;
};
