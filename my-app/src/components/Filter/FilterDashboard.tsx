import React, { useEffect, useState } from 'react'
import { useMasterShopListNotAll } from '@/hooks';
import { Col, Form } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { setProcess } from '@/store/features/modalSlice';
import { useErrorHandler } from '@/store/useErrorHandler';
import { SearchParams } from '@/hooks/useReportData';
import SearchableDropdown from '@/components/FormGroup/SearchableDropdown';

interface FilterDashboardProps {
    fetchData: (search: SearchParams) => Promise<void>;
}

const FilterDashboard = ({ fetchData }: FilterDashboardProps) => {
    const lang = useAppSelector(state => state.lang) as { [key: string]: string };
    const { itemShop } = useMasterShopListNotAll();
    const [valueShop, setValueShop] = useState('');
    const dispatch = useAppDispatch();
    const { handleError } = useErrorHandler();

    const shopOptions = itemShop.map((item) => ({
        label: item.shopName,
        value: item.id,
    }));

    useEffect(() => {
        if (itemShop.length > 0) {
            setValueShop(itemShop[0].id);
        }
    }, [itemShop]);

    useEffect(() => {
        if(valueShop){
            // fetchData({ branchId: valueShop } as SearchParams);
            handleSearch({ branchId: valueShop });
        }
    }, [fetchData, valueShop]);

    const handleSearch = async ({ branchId }: { branchId: string }) => {
        dispatch(setProcess(true));
        try {
            const data = {
                branchId: branchId
            }
            await fetchData(data);
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setProcess(false));
        }
    }
    return (
        <>
            <h3 className="text-lg font-bold mb-3">{lang['filter_report_shop']} : {valueShop ? itemShop.find(item => item.id === valueShop)?.shopName : lang['global_select']}</h3>
            <div className="row pb-3">
                <Col md={10}>
                    <Form className="flex gap-2">
                        <Form.Group className="basis-1/4">
                            <SearchableDropdown
                                items={shopOptions}
                                value={valueShop}
                                onChange={setValueShop}
                                placeholder={lang['global_select']}
                                searchPlaceholder={lang['global_search']}
                            />
                        </Form.Group>
                        {/* <Form.Group className="basis-1/4 flex items-end">
                            <Button variant="primary" type="submit"><i className="fa-solid fa-search mr-2"></i>{lang['global_search']}</Button>
                        </Form.Group> */}
                    </Form>
                </Col>
            </div>
        </>
    )
}

export default FilterDashboard
