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
        <div>
            <div className="table-responsive-wrapper">
                <Table striped bordered hover className="mb-0">
                    <thead>
                        <tr>
                            {
                                head.map((item: string, index: number) => (
                                    <th key={index} className="text-xs md:text-sm font-medium bg-gray-50">{item}</th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody className="text-xs md:text-sm">
                        {children}
                    </tbody>
                </Table>
            </div>
            {activePage && (
                <div className="d-flex justify-content-center md:justify-content-end mt-3">
                    <CustomPagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handleActive}
                    />
                </div>
            )}
        </div>
    )
}

export default TableComponent