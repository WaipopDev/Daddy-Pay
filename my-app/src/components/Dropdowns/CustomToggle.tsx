import React, { useState, ForwardedRef, MouseEvent } from 'react'

interface CustomToggleProps {
    name: string;
    displayName: string;
}
const CustomToggle = ({ name, displayName }:CustomToggleProps) => (
    <div className="items-center flex bg-[#ECEEF5] px-4 py-2 lg:min-w-[250px] rounded-md">
        <span className="w-12 h-12 text-sm text-white bg-orange-600 inline-flex items-center justify-center rounded-full font-black">
            {name}
        </span>
        <p className="px-2">{displayName}</p>
    </div>
);
export default CustomToggle