import React from 'react'
import Table from 'react-bootstrap/Table';

import CustomPagination from './CustomPagination';
interface TableProps {
    head: string[];
    page: number;
    totalPages: number;
    children: React.ReactNode;
    handleActive: (number: number) => void;
    activePage?: boolean;
}



const TableComponent = ({ head, page, totalPages, handleActive, children, activePage = true }: TableProps) => {
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
            {activePage && (
                <div className="d-flex justify-content-end">
                    <CustomPagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handleActive}
                    />
                </div>
            )}
        </>
    )
}

export default TableComponent