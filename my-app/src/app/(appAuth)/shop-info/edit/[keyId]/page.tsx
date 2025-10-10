'use client';
import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { Button, Col, Form } from "react-bootstrap";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { openModalAlert, setProcess } from "@/store/features/modalSlice";
import { useErrorHandler } from "@/store/useErrorHandler";
import ShopInfoForm from "@/components/ShopInfoForm/ShopInfoForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ItemShopInfoDataProps } from "@/types/shopInfoType";

// Constants
const SHOP_INFO_ROUTE = '/shop-info';
const API_ENDPOINTS = {
    getShopInfo: (keyId: string) => `/api/shop-info/by/${keyId}`,
    updateShopInfo: (shopId: string) => `/api/shop-info?shopId=${shopId}`,
} as const;

// Action buttons component
interface ActionButtonsProps {
    isLoading: boolean;
    onCancel: () => void;
    lang: { [key: string]: string };
}


const ActionButtons: React.FC<ActionButtonsProps> = ({ isLoading, onCancel, lang }) => (
    <div className="flex flex-col md:flex-row pb-2 mb-4 gap-2">
        <Col className="flex justify-end">
            <Button 
                variant="primary" 
                type="submit"
                disabled={isLoading}
                aria-label={lang['button_save']}
                className="w-full md:w-auto"
            >
                <i className="fa-solid fa-floppy-disk pr-2" aria-hidden="true"></i>
                {lang['button_save']}
            </Button>
            <Button 
                variant="secondary" 
                onClick={onCancel} 
                className="w-full md:w-auto ml-0 md:ml-2"
                disabled={isLoading}
                aria-label={lang['button_cancel']}
            >
                <i className="fa-solid fa-xmark pr-2" aria-hidden="true"></i>
                {lang['button_cancel']}
            </Button>
        </Col>
    </div>
);

interface ShopInfoEditPageState {
    validated: boolean;
    item: ItemShopInfoDataProps | null;
    isLoading: boolean;
}

const INITIAL_STATE: ShopInfoEditPageState = {
    validated: false,
    item: null,
    isLoading: false,
};

// Custom hook for shop info data management

const useShopInfoData = (keyId: string | string[] | undefined) => {
    const { handleError } = useErrorHandler();
    const [state, setState] = useState<ShopInfoEditPageState>(INITIAL_STATE);

    const fetchData = useCallback(async (keyId: string) => {
        try {
            setState(prev => ({ ...prev, isLoading: true }));
            const response = await axios.get(API_ENDPOINTS.getShopInfo(keyId), {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.status === 200 && response.data) {
                setState(prev => ({ ...prev, item: response.data }));
            } else {
                throw new Error('No data received from server');
            }
        } catch (error) {
            console.error("Error fetching shop info:", error);
            handleError(error);
            setState(prev => ({ ...prev, item: null }));
        } finally {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, [handleError]);

    useEffect(() => {
        if (typeof keyId === 'string' && keyId.trim()) {
            fetchData(keyId);
        } else if (keyId !== undefined) {
            console.error('Invalid keyId format:', keyId);
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, [keyId, fetchData]);

    const setValidated = useCallback((validated: boolean) => {
        setState(prev => ({ ...prev, validated }));
    }, []);

    return {
        ...state,
        setValidated,
    };
};

/**
 * Shop Info Edit Page Component
 * Handles editing of shop information with form validation and API integration
 */
const ShopInfoEditPage = () => {
    const lang = useAppSelector(state => state.lang) as { [key: string]: string };
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { handleError } = useErrorHandler();
    const { keyId } = useParams();

    const { validated, item, isLoading, setValidated } = useShopInfoData(keyId);

    /**
     * Handles form submission for updating shop information
     */
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        
        const form = event.currentTarget;
        setValidated(true);
        
        if (!form.checkValidity()) {
            return;
        }

        if (typeof keyId !== 'string') {
            console.error('Invalid keyId');
            return;
        }

        try {
            dispatch(setProcess(true));
            const formData = new FormData(form);
            await axios.patch(API_ENDPOINTS.updateShopInfo(keyId), formData);
            
            dispatch(openModalAlert({
                message: lang['global_edit_success_message'],
                callbackPath: SHOP_INFO_ROUTE
            }));
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setProcess(false));
        }
    };

    /**
     * Handles navigation back to shop info list
     */
    const handleCancel = useCallback(() => {
        router.push(SHOP_INFO_ROUTE);
    }, [router]);

    if (isLoading) {
        return <LoadingSpinner message="Loading shop information..." />;
    }

    return (
        <main className="bg-white p-2 md:p-4" role="main">
            <Form 
                noValidate 
                validated={validated} 
                onSubmit={handleSubmit}
                aria-label="Shop information edit form"
            >
                <ActionButtons 
                    isLoading={isLoading} 
                    onCancel={handleCancel} 
                    lang={lang} 
                />
                <ShopInfoForm item={item} action="edit" />
            </Form>
        </main>
    );
};

// Component display name for debugging
ShopInfoEditPage.displayName = 'ShopInfoEditPage';

export default ShopInfoEditPage;