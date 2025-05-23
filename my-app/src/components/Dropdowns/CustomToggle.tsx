import React, { useState, ForwardedRef, MouseEvent } from 'react'

interface CustomToggleProps {
    name: string;
    displayName: string;
}
const CustomToggle = ({ name, displayName }: CustomToggleProps) => (
    <div className="flex items-center w-full cursor-pointer">
        <i className="fa-solid fa-circle-user text-[30px]"></i>
        <p className="px-2 w-full">{displayName}</p>
    </div>
);
export default CustomToggle