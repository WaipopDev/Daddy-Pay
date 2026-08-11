import { useMasterShopList } from '@/hooks';
import React, { useMemo, useState } from 'react'
import { Button, Col, Form } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import DatePickerRange from '../FormGroup/DatePickerRange';
import { openModalAlert, setProcess } from '@/store/features/modalSlice';
import { useErrorHandler } from '@/store/useErrorHandler';
import moment from 'moment';
import { SearchParams } from '@/hooks/useReportData';
import SearchableDropdown from '@/components/FormGroup/SearchableDropdown';

interface FilterReportProps {
    reportName: string;
    fetchData: (pageNumber: number, search: SearchParams) => Promise<void>;
}

const FilterReportBank = ({ reportName, fetchData }: FilterReportProps) => {
    const lang = useAppSelector(state => state.lang) as { [key: string]: string };
    const [valueShop, setValueShop] = useState('');
    const [dateValue, setDateValue] = useState<[Date | null, Date | null] | null>([new Date(), new Date()]);
    const { itemShop } = useMasterShopList();
    const dispatch = useAppDispatch();
    const { handleError } = useErrorHandler();

    const shopOptions = useMemo(
        () => itemShop.map((item) => ({ label: item.shopName, value: item.id })),
        [itemShop]
    );

    console.log("🚀 ~ FilterReport ~ itemShop:", reportName)

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!dateValue || !dateValue[0] || !dateValue[1]) {
            dispatch(openModalAlert({ message: lang['global_error_date'] }));
            return;
        }
        try {
            dispatch(setProcess(true));
            const data = {
                branchId: valueShop,
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                        <Form.Group className="w-full">
                            <Form.Label className="text-sm md:text-base">{lang['filter_report_shop']}</Form.Label>
                            <SearchableDropdown
                                items={shopOptions}
                                value={valueShop}
                                onChange={setValueShop}
                                placeholder={lang['global_select']}
                                searchPlaceholder={lang['global_search']}
                            />
                        </Form.Group>
                        <Form.Group className="w-full">
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

export default FilterReportBank
