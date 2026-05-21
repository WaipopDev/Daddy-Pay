'use client';
import React, { Suspense } from "react";
import { useAppSelector } from "@/store/hook";
import TableComponent from "@/components/Table/Table";
import ModalActionDelete from "@/components/Modals/ModalActionDelete";
import ModalActionBank from "@/components/Modals/ModalActionBank";
import ModalActionOnlinePayment from "@/components/Modals/ModalActionOnlinePayment";

// Custom hooks
import { useShopData } from "@/hooks/useShopData";
import { useShopOperations } from "@/hooks/useShopOperations";

// Components
import ShopInfoHeader from "@/components/ShopInfo/ShopInfoHeader";
import ShopInfoFilter from "@/components/ShopInfo/ShopInfoFilter";
import ShopInfoTableContent from "@/components/ShopInfo/ShopInfoTableContent";
import type { ShopInfoSearchParams } from "@/types/shopInfoType";

// Utils
import { getShopInfoTableHeaders } from "@/utils/shopInfoUtils";
import ErrorBoundary from "@/components/ErrorBoundary";



const ShopInfoPage = () => {
    const lang = useAppSelector(state => state.lang) as { [key: string]: string };
    
    // Custom hooks for data management and operations
    const { items, page, isLoading, fetchData } = useShopData();
    const {
        showModalDelete,
        showModalBank,
        showModalOnlinePayment,
        // isDeleting,
        handleAddShop,
        handleEditShop,
        handleDeleteShop,
        handleShowDeleteModal,
        handleCloseDeleteModal,
        handleShowBankModal,
        handleCloseBankModal,
        handleSaveBank,
        handleShowOnlinePaymentModal,
        handleCloseOnlinePaymentModal,
        handleSaveOnlinePayment,
        isSavingOnlinePayment,
    } = useShopOperations({
        lang,
        onDeleteSuccess: async () => {
            await fetchData(page.page);
        },
        onBankSaveSuccess: async () => {
            await fetchData(page.page);
        },
        onOnlinePaymentSaveSuccess: async () => {
            await fetchData(page.page);
        },
    });
    const handleEditBank = (id: string) => {
        handleShowBankModal(id);
    };

    const handleFilterSearch = (search: ShopInfoSearchParams) => {
        fetchData(1, search);
    };

    const handlePageChange = (pageNumber: number) => {
        fetchData(pageNumber);
    };

    // Get table headers
    const tableHeaders = getShopInfoTableHeaders(lang);

    return (
        <main className="bg-white p-2 md:p-4" role="main">
            <ErrorBoundary>
                <ShopInfoHeader
                    onAddShop={handleAddShop}
                    lang={lang}
                    isLoading={isLoading}
                />

                <ShopInfoFilter
                    lang={lang}
                    isLoading={isLoading}
                    onSearch={handleFilterSearch}
                />

                <Suspense fallback={<p>Loading feed...</p>}>
                    <TableComponent
                        head={tableHeaders}
                        page={page.page}
                        totalPages={page.totalPages}
                        handleActive={handlePageChange}
                    >
                        <ShopInfoTableContent
                            items={items}
                            currentPage={page.page}
                            lang={lang}
                            onEdit={handleEditShop}
                            onDelete={handleShowDeleteModal}
                            isLoading={isLoading}
                            onEditBank={handleEditBank}
                            onEditOnlinePayment={handleShowOnlinePaymentModal}
                        />
                    </TableComponent>
                </Suspense>

                <ModalActionDelete
                    show={showModalDelete.isShow}
                    handleClose={handleCloseDeleteModal}
                    title={lang['page_shop_info_deleting']}
                    text={lang['global_delete_confirmation']}
                    id={showModalDelete.id}
                    handleConfirm={handleDeleteShop}
                />

                <ModalActionBank
                    show={showModalBank.isShow}
                    handleClose={handleCloseBankModal}
                    title={lang['modal_bank_title']}
                    shopId={showModalBank.shopId}
                    onSave={handleSaveBank}
                    initialData={showModalBank.initialData}
                />

                <ModalActionOnlinePayment
                    show={showModalOnlinePayment.isShow}
                    handleClose={handleCloseOnlinePaymentModal}
                    title={lang['modal_online_payment_title']}
                    shopId={showModalOnlinePayment.shopId}
                    initialData={showModalOnlinePayment.initialData}
                    onSave={handleSaveOnlinePayment}
                    isSaving={isSavingOnlinePayment}
                />
            </ErrorBoundary>
        </main>
    );
};

// Set display name for debugging
ShopInfoPage.displayName = 'ShopInfoPage';

export default ShopInfoPage;