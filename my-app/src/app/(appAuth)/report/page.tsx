'use client';
import React from 'react'
import Link from 'next/link'
import { Table } from 'react-bootstrap'

const ReportPage = () => {
    return (
        <div className="bg-white p-2">
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Report</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    <tr>
                        <td>1</td>
                        <td>
                            <Link href="/report/branch-income" className="text-blue-500">
                                รายงานข้อมูลรายรับสาขา
                            </Link>
                        </td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>
                            <Link href="/report/kbank-payment" className="text-blue-500">
                                รายงานข้อมูลการตัดเงินจากพร้อมเพย์เพื่อชำระค่าบริการ (ธนาคารกสิกรไทย (KBank))
                            </Link>
                        </td>
                    </tr>
                </tbody>
            </Table>
        </div>
    )
}

export default ReportPage