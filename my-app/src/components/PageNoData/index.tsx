'use client';
import React from 'react'

const PageNoData = () => {
    return (
        <main className="bg-white p-3">
            <div className="flex justify-center items-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">No Data Available</h1>
                    <p className="text-gray-500">There is no data to display at the moment.</p>
                </div>
            </div>
        </main>
    )
}

export default PageNoData