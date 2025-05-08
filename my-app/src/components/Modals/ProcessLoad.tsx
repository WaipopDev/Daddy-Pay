'use client';
import React from 'react'
import Spinner from 'react-bootstrap/Spinner'
import { useAppSelector } from '@/store/hook';

const ProcessLoad = () => {
    const process = useAppSelector((state) => state.modal.process);
    if (!process) return null;
    return (
        <div className="page-load">
            <div className="page-load-spinner mb-3">
                <Spinner
                    animation="grow"
                    // animation="border"
                    variant="success"
                    style={{ width: "6rem", height: "6rem", borderWidth: ".3rem" }}
                />
            </div>
        </div>
    )
}

export default ProcessLoad