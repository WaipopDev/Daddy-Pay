import { useMasterShopList } from '@/hooks';
import React, { useEffect, useState } from 'react'
import { Button, Col, Dropdown, Form } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { cn } from '@/lib/utils';
import { setProcess } from '@/store/features/modalSlice';
import { useErrorHandler } from '@/store/useErrorHandler';
import { SearchParams } from '@/hooks/useReportData';

interface FilterDashboardProps {
    fetchData: (search: SearchParams) => void;
}

const FilterDashboard = ({ fetchData }: FilterDashboardProps) => {
    const lang = useAppSelector(state => state.lang) as { [key: string]: string };
    const { itemShop } = useMasterShopList();
    const [valueShop, setValueShop] = useState('');
    const dispatch = useAppDispatch();
    const { handleError } = useErrorHandler();

    useEffect(() => {
        if(itemShop.length > 0){
            setValueShop(itemShop[0].id);
            fetchData({ branchId: itemShop[0].id } as SearchParams);
        }
    }, [itemShop]);

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
      
        try {
            dispatch(setProcess(true));
            const data = {
                branchId: valueShop
            }
            await fetchData(data as SearchParams);
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setProcess(false));
        }
    }
    return (
        <div className="row pb-3">
            <Col md={10}>
                <Form className="flex gap-2" onSubmit={handleSearch}>
                    <Form.Group className="basis-1/4">
                        <Form.Label>{lang['filter_report_shop']}</Form.Label>
                        <Dropdown className="nav-dropdown-w">
                            <Dropdown.Toggle
                                className={cn(`flex items-center w-full px-2 py-2 rounded-md h-[35px]`)}
                            >
                                <p className="px-2 w-full text-left text-sm">{valueShop ? itemShop.find(item => item.id === valueShop)?.shopName : lang['global_select']}</p>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {
                                    itemShop && itemShop.map((item, index) => (
                                        <Dropdown.Item key={index} onClick={() => setValueShop(item.id)} active={valueShop === item.id}>
                                            {item.shopName}
                                        </Dropdown.Item>
                                    ))
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form.Group>
                    <Form.Group className="basis-1/4 flex items-end">
                        <Button variant="primary" type="submit"><i className="fa-solid fa-search mr-2"></i>{lang['global_search']}</Button>
                    </Form.Group>
                </Form>
            </Col>
        </div>
    )
}

export default FilterDashboard

