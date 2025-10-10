'use client';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import { useAppSelector } from '@/store/hook';
import _ from 'lodash';

// interface LanguageState {
//     active: boolean;
//     id: number;
//     langCode: string;
//     langName: string;
//     createdAt: string;
//     updatedAt: string;
//     createdBy: string;
//     updatedBy: string;
//     deletedAt: string | null;
// }

const LanguageSettingsPage = () => {
    const lang = useAppSelector(state => state.lang) as { [key: string]: string }

    const [langList, setLangList] = useState<{ [key: string]: string }>({});
    const [langActive, setLangActive] = useState<{ [key: string]: string }>({});

    const getLanguageAll = useCallback(async () => {
        try {
            const item = await axios.get('/api/lang/list')
            if (item.data) {
                const langData = await axios.get(`/api/lang?langCode=${Object.keys(item.data)[0] || 'en'}`);
                if (langData.data) {
                    setLangActive(langData.data);
                }
                setLangList(item.data);
            }
        } catch (error) {
            console.error('Error fetching language:', error);

        }
    }, []);

    useEffect(() => {
        getLanguageAll();
    }, [getLanguageAll]);

    return (
        <main className="bg-white p-2 md:p-4">
            <div className="flex justify-end pb-2 mb-4">
                <Button variant="primary" className="w-full md:w-auto">
                    <i className="fa-solid fa-plus pr-2"></i>{lang['button_add_language']}
                </Button>
            </div>
            {
                langList && (
                    <Tabs
                        defaultActiveKey={Object.keys(langList)[0]}
                        className="mb-3"
                        onChange={(key) => console.log(key)}
                    >
                        {
                            _.map(langList, (langItem, key) => (
                                <Tab
                                    key={key}
                                    eventKey={key}
                                    title={langItem}
                                >
                                    <div className="flex flex-col md:flex-row justify-end pb-2 mb-4 gap-2">
                                        <Button variant="primary" className="w-full md:w-auto">{lang['button_edit_language']}</Button>
                                        <Button variant="danger" className="w-full md:w-auto">{lang['button_delete_language']}</Button>
                                    </div>
                                    <div className="table-responsive-wrapper">
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th className="text-sm md:text-base">Key</th>
                                                    <th className="text-sm md:text-base">Value</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    langActive && Object.keys(langActive).length > 0 ? (
                                                        Object.entries(langActive).map(([key, value]) => (
                                                            <tr key={key}>
                                                                <td className="text-xs md:text-sm font-medium">{key}</td>
                                                                <td className="text-xs md:text-sm">{value}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={2} className="text-center text-xs md:text-sm">No data available</td>
                                                        </tr>
                                                    )
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                </Tab>
                            ))
                        }
                    </Tabs>
                )
            }

        </main>
    )
}

export default LanguageSettingsPage