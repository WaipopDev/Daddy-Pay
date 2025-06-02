import React from 'react'
import Table from 'react-bootstrap/Table';

import CustomPagination from './CustomPagination';
interface TableProps {
    head: string[];
    page: number;
    totalPages: number;
    children: React.ReactNode;
    handleActive: (number: number) => void;
}



const TableComponent = ({ head, page, totalPages, handleActive, children }: TableProps) => {
    return (
        <>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        {
                            head.map((item: string, index: number) => (
                                <th key={index} className="text-sm">{item}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {children}
                </tbody>
            </Table>
            <div className="d-flex justify-content-end">
                <CustomPagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handleActive}
                />
            </div>
        </>
    )
}

export default TableComponent