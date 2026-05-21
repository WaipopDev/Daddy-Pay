import moment from 'moment';
import {
    isSubscriptionStatus,
    SUBSCRIPTION_NOTIFICATION_CYCLE,
} from '@/constants/shopInfo';
import type { ShopSubscriptionFormData } from '@/types/shopInfoType';
import { isValidEmailTag, parseEmailTags } from '@/utils/emailTagsUtils';

const DATE_FORMAT = 'YYYY-MM-DD';

const isValidDate = (value: string): boolean =>
    moment(value, DATE_FORMAT, true).isValid();

export const validateSubscriptionForm = (
    data: ShopSubscriptionFormData,
    lang: Record<string, string>
): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!data.subSubscriptionStatus) {
        errors.subSubscriptionStatus = lang['validation_subscription_status_required'];
    } else if (!isSubscriptionStatus(data.subSubscriptionStatus)) {
        errors.subSubscriptionStatus = lang['validation_subscription_status_invalid'];
    }

    if (!data.subRegistrationDate?.trim()) {
        errors.subRegistrationDate = lang['validation_subscription_registration_date_required'];
    } else if (!isValidDate(data.subRegistrationDate)) {
        errors.subRegistrationDate = lang['validation_subscription_registration_date_invalid'];
    }

    if (!data.subExpirationDate?.trim()) {
        errors.subExpirationDate = lang['validation_subscription_expiration_date_required'];
    } else if (!isValidDate(data.subExpirationDate)) {
        errors.subExpirationDate = lang['validation_subscription_expiration_date_invalid'];
    }

    if (
        !errors.subRegistrationDate &&
        !errors.subExpirationDate &&
        moment(data.subExpirationDate, DATE_FORMAT).isBefore(
            moment(data.subRegistrationDate, DATE_FORMAT)
        )
    ) {
        errors.subExpirationDate = lang['validation_subscription_expiration_before_registration'];
    }

    const cycle = Number(data.subNotificationCycle);
    if (data.subNotificationCycle === '' || Number.isNaN(cycle)) {
        errors.subNotificationCycle = lang['validation_subscription_notification_cycle_required'];
    } else if (
        cycle < SUBSCRIPTION_NOTIFICATION_CYCLE.MIN ||
        cycle > SUBSCRIPTION_NOTIFICATION_CYCLE.MAX ||
        !Number.isInteger(cycle)
    ) {
        errors.subNotificationCycle = lang['validation_subscription_notification_cycle_invalid'];
    }

    if (!data.subNotifyToEmail?.trim()) {
        errors.subNotifyToEmail = lang['validation_subscription_notify_email_required'];
    } else {
        const emails = parseEmailTags(data.subNotifyToEmail);
        const hasInvalidEmail = emails.some((email) => !isValidEmailTag(email));
        if (emails.length === 0 || hasInvalidEmail) {
            errors.subNotifyToEmail = lang['validation_subscription_notify_email_invalid'];
        }
    }

    return errors;
};
