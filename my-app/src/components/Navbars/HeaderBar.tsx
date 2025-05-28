'use client'
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store/hook';
import _ from 'lodash';
import { usePathname } from 'next/navigation';
// import { usePathname } from "next/navigation";'
import React from 'react'

interface MenuItems {
    title : string;
    icon  : string;
    path  : string;
    active: boolean;
    key   : string;
}

const HeaderBar: React.FC<MenuItems[]> = (menuItems) => {
    const pathname = usePathname();
    const lang = useAppSelector(state => state.lang) as { [key: string]: string }
    const currentMenu = _.find(menuItems, item => pathname.startsWith(item.path)) || menuItems[0];
    const currentTitle = lang[currentMenu.key];
    // const currentIcon = currentMenu.icon;
    return (
        <div className="mb-3 px-2 py-2 rounded-md flex items-center gap-2 bg-white">
            <i className={cn("fa-solid fa-house text-gray-500")} />
            <span className="font-medium text-gray-500">|</span>
            <h1 className="text-xl font-medium">{currentTitle}</h1>
        </div>
    )
}

export default HeaderBar