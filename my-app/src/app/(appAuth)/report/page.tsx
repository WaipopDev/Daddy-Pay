'use client';
import React from 'react'
import Link from 'next/link'
import { Table } from 'react-bootstrap'

const ReportPage = () => {
    return (
        <div className="bg-white p-2 md:p-4">
            <div className="table-responsive-wrapper">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th className="text-sm md:text-base">#</th>
                            <th className="text-sm md:text-base">Report</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        <tr>
                            <td className="text-center">1</td>
                            <td>
                                <Link 
                                    href="/report/branch-income" 
                                    className="text-blue-500 hover:text-blue-700 transition-colors text-sm md:text-base block py-2"
                                >
                                    รายงานข้อมูลรายรับสาขา
                                </Link>
                            </td>
                        </tr>
                        <tr>
                            <td className="text-center">2</td>
                            <td>
                                <Link 
                                    href="/report/kbank-payment" 
                                    className="text-blue-500 hover:text-blue-700 transition-colors text-sm md:text-base block py-2"
                                >
                                    รายงานข้อมูลการตัดเงินจากพร้อมเพย์เพื่อชำระค่าบริการ (ธนาคารกสิกรไทย (KBank))
                                </Link>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

export default ReportPage