'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { setPropsUser } from '@/store/features/userSlice';
import {
    formatUserSubscription,
    formatUserSubscriptionDate,
} from '@/utils/userInfoUtils';

const SubscriptionsPage = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);
    const lang = useAppSelector((state) => state.lang) as Record<string, string>;
    const [isLoading, setIsLoading] = useState(true);

    const fetchSubscription = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('/api/user/me');
            if (response.status === 200) {
                dispatch(setPropsUser(response.data));
            }
        } catch (error) {
            console.error('Error fetching subscription:', error);
        } finally {
            setIsLoading(false);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchSubscription();
    }, [fetchSubscription]);

    const subscriptionInfo = formatUserSubscription(user.subscribe, lang);

    return (
        <main className="bg-white p-2 md:p-4">
            <Container>
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6">
                            {lang['menu_subscriptions']}
                        </h2>

                        {isLoading ? (
                            <p className="text-sm text-gray-500">
                                {lang['global_loading'] || 'Loading...'}
                            </p>
                        ) : (
                            <div className="space-y-4">
                                <Row className="border-b border-gray-100 pb-3">
                                    <Col xs={12} md={5} className="text-sm md:text-base font-semibold text-gray-600 mb-1 md:mb-0">
                                        {lang['page_user_subscription']}
                                    </Col>
                                    <Col xs={12} md={7}>
                                        <span className={`badge ${subscriptionInfo.className}`}>
                                            {subscriptionInfo.text}
                                        </span>
                                    </Col>
                                </Row>

                                <Row className="border-b border-gray-100 pb-3">
                                    <Col xs={12} md={5} className="text-sm md:text-base font-semibold text-gray-600 mb-1 md:mb-0">
                                        {lang['page_subscriptions_registration_date']}
                                    </Col>
                                    <Col xs={12} md={7} className="text-sm md:text-base">
                                        {formatUserSubscriptionDate(user.subscribeStartDate)}
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs={12} md={5} className="text-sm md:text-base font-semibold text-gray-600 mb-1 md:mb-0">
                                        {lang['page_subscriptions_expiration_date']}
                                    </Col>
                                    <Col xs={12} md={7} className="text-sm md:text-base">
                                        {formatUserSubscriptionDate(user.subscribeEndDate)}
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </main>
    );
};

SubscriptionsPage.displayName = 'SubscriptionsPage';

export default SubscriptionsPage;
