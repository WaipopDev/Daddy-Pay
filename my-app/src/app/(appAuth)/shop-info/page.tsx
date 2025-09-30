'use client';
import React, { Suspense } from "react";
import { useAppSelector } from "@/store/hook";
import TableComponent from "@/components/Table/Table";
import ModalActionDelete from "@/components/Modals/ModalActionDelete";
import ModalActionBank from "@/components/Modals/ModalActionBank";

// Custom hooks
import { useShopData } from "@/hooks/useShopData";
import { useShopOperations } from "@/hooks/useShopOperations";

// Components
import ShopInfoHeader from "@/components/ShopInfo/ShopInfoHeader";
import ShopInfoTableContent from "@/components/ShopInfo/ShopInfoTableContent";

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
        // isDeleting,
        handleAddShop,
        handleEditShop,
        handleDeleteShop,
        handleShowDeleteModal,
        handleCloseDeleteModal,
        handleShowBankModal,
        handleCloseBankModal,
        handleSaveBank,
    } = useShopOperations({
        onDeleteSuccess: async () => {
            await fetchData(page.page);
        },
        onBankSaveSuccess: async () => {
            await fetchData(page.page);
        }
    });
    const handleEditBank = (id: string) => {
        handleShowBankModal(id);
    }

    // Get table headers
    const tableHeaders = getShopInfoTableHeaders(lang);

    return (
        <main className="bg-white p-2" role="main">
            <ErrorBoundary>
                <ShopInfoHeader 
                    onAddShop={handleAddShop}
                    onSearch={(searchTerm) => fetchData(1, searchTerm)}
                    lang={lang}
                    isLoading={isLoading}
                />

                <Suspense fallback={<p>Loading feed...</p>}>
                    <TableComponent
                        head={tableHeaders}
                        page={page.page}
                        totalPages={page.totalPages}
                        handleActive={(pageNumber: number) => fetchData(pageNumber)}
                    >
                        <ShopInfoTableContent
                            items={items}
                            currentPage={page.page}
                            lang={lang}
                            onEdit={handleEditShop}
                            onDelete={handleShowDeleteModal}
                            isLoading={isLoading}
                            onEditBank={handleEditBank}
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
            </ErrorBoundary>
        </main>
    );
};

// Set display name for debugging
ShopInfoPage.displayName = 'ShopInfoPage';

export default ShopInfoPage;