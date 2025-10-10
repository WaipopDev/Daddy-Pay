'use client';
import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const CustomPagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    const renderPaginationItems = () => {
        const items = [];
        const range = 2; // number of pages to show around the current page
        const firstPage = 1;
        const lastPage = totalPages;
        if (totalPages <= 10) {
            for (let number = 1; number <= totalPages; number++) {
                items.push(
                    <Pagination.Item
                        key={number}
                        active={number === currentPage}
                        onClick={() => handlePageChange(number)}
                    >
                        {number}
                    </Pagination.Item>
                );
            }
        } else {
            items.push(
                <Pagination.Item
                    key={firstPage}
                    active={firstPage === currentPage}
                    onClick={() => handlePageChange(firstPage)}
                >
                    {firstPage}
                </Pagination.Item>
            );

            if (currentPage > range + 2) {
                items.push(<Pagination.Ellipsis key="ellipsis-start" />);
            }

            const startPage = Math.max(currentPage - range, 2);
            const endPage = Math.min(currentPage + range, totalPages - 1);

            for (let number = startPage; number <= endPage; number++) {
                items.push(
                    <Pagination.Item
                        key={number}
                        active={number === currentPage}
                        onClick={() => handlePageChange(number)}
                    >
                        {number}
                    </Pagination.Item>
                );
            }

            if (currentPage < totalPages - range - 1) {
                items.push(<Pagination.Ellipsis key="ellipsis-end" />);
            }

            items.push(
                <Pagination.Item
                    key={lastPage}
                    active={lastPage === currentPage}
                    onClick={() => handlePageChange(lastPage)}
                >
                    {lastPage}
                </Pagination.Item>
            );
        }

        return items;
    };

    return (
        <Pagination className="pagination-sm">
            {/* <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} /> */}
            <Pagination.Prev 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                className="text-xs md:text-sm"
            />
            {renderPaginationItems()}
            <Pagination.Next 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="text-xs md:text-sm"
            />
            {/* <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} /> */}
        </Pagination>
    );
};

export default CustomPagination;