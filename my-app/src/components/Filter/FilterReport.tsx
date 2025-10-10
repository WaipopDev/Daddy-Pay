import { useMasterShopList } from '@/hooks';
import React, { useState } from 'react'
import { Button, Col, Dropdown, Form } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { cn } from '@/lib/utils';
import DatePickerRange from '../FormGroup/DatePickerRange';
import { PAYMENT_METHOD } from '@/constants/main';
import { openModalAlert, setProcess } from '@/store/features/modalSlice';
import { useErrorHandler } from '@/store/useErrorHandler';
import moment from 'moment';
import { SearchParams } from '@/hooks/useReportData';

interface FilterReportProps {
    reportName: string;
    fetchData: (pageNumber: number, search: SearchParams) => Promise<void>;
}

const FilterReport = ({ reportName, fetchData }: FilterReportProps) => {
    const lang = useAppSelector(state => state.lang) as { [key: string]: string };
    const [valueShop, setValueShop] = useState('');
    const [dateValue, setDateValue] = useState<[Date | null, Date | null] | null>([new Date(), new Date()]);
    const [valuePaymentMethod, setValuePaymentMethod] = useState('');
    const { itemShop } = useMasterShopList();
    const dispatch = useAppDispatch();
    const { handleError } = useErrorHandler();

    console.log("🚀 ~ FilterReport ~ itemShop:", reportName)

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!dateValue || !dateValue[0] || !dateValue[1]) {
            dispatch(openModalAlert({ message: lang['global_error_date'] }));
            return;
        }
        try {
            dispatch(setProcess(true));
            const form = e.currentTarget;
            const formData = new FormData(form);
            const data = {
                branchId: valueShop === 'all' ? '' : valueShop,
                paymentType: valuePaymentMethod === 'all' ? '' : valuePaymentMethod,
                machineName: formData.get('machineName'),
                programName: formData.get('programName'),
                startDate: moment(dateValue[0]).format('YYYY-MM-DD'),
                endDate: moment(dateValue[1]).format('YYYY-MM-DD'),
            }
            console.log("🚀 ~ handleSearch ~ data:", data)
            await fetchData(1, data as SearchParams);
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setProcess(false));
        }
    }
    return (
        <div className="row pb-3">
            <Col md={10}>
                <Form onSubmit={handleSearch}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
                        <Form.Group className="w-full">
                            <Form.Label className="text-sm md:text-base">{lang['filter_report_shop']}</Form.Label>
                            <Dropdown className="nav-dropdown-w">
                                <Dropdown.Toggle
                                    className={cn(`flex items-center w-full px-2 py-2 rounded-md h-[35px] text-sm`)}
                                >
                                    <p className="px-2 w-full text-left text-xs md:text-sm">{valueShop ? itemShop.find(item => item.id === valueShop)?.shopName : lang['global_select']}</p>
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
                        <Form.Group className="w-full">
                            <Form.Label className="text-sm md:text-base">{lang['filter_report_payment_method']}</Form.Label>
                            <Dropdown className="nav-dropdown-w">
                                <Dropdown.Toggle
                                    className={cn(`flex items-center w-full px-2 py-2 rounded-md h-[35px] text-sm`)}
                                >
                                    <p className="px-2 w-full text-left text-xs md:text-sm">{valuePaymentMethod ? PAYMENT_METHOD.find(item => item.id === valuePaymentMethod)?.name : lang['global_select']}</p>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {
                                        PAYMENT_METHOD.map((item, index) => (
                                            <Dropdown.Item key={index} onClick={() => setValuePaymentMethod(item.id)} active={valuePaymentMethod === item.id}>
                                                {item.name}
                                            </Dropdown.Item>
                                        ))
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form.Group>
                        <Form.Group className="w-full">
                            <Form.Label className="text-sm md:text-base">{lang['filter_report_machine_name']}</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder={lang['filter_report_machine_name']} 
                                name="machineName" 
                                className="text-sm"
                            />
                        </Form.Group>
                        <Form.Group className="w-full">
                            <Form.Label className="text-sm md:text-base">{lang['filter_report_program']}</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder={lang['filter_report_program']} 
                                name="programName" 
                                className="text-sm"
                            />
                        </Form.Group>
                        <Form.Group className="w-full md:col-span-2">
                            <Form.Label className="text-sm md:text-base">{lang['filter_report_select_date']}</Form.Label>
                            <DatePickerRange dateValue={dateValue} onChange={setDateValue} />
                        </Form.Group>
                        <Form.Group className="w-full flex items-end">
                            <Button 
                                variant="primary" 
                                type="submit" 
                                className="w-full md:w-auto text-sm"
                            >
                                <i className="fa-solid fa-search mr-2"></i>{lang['global_search']}
                            </Button>
                        </Form.Group>
                    </div>
                </Form>
            </Col>
            <Col md={2}></Col>
        </div>
    )
}

export default FilterReport

