'use client'
import React, { Fragment } from "react";
import Link from "next/link";
import {  usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import _ from "lodash";
import { useAppSelector } from '@/store/hook';
// import NotificationDropdown from "components/Dropdowns/NotificationDropdown.js";
// import UserDropdown from "@/components/Dropdowns/UserDropdown";


interface MenuItems {
    title : string;
    icon  : string;
    path  : string;
    active: boolean;
    key   : string;
    role  : string[];
}

interface SidebarProps {
    isMobileOpen?: boolean;
    onMobileClose?: () => void;
}

const Sidebar: React.FC<MenuItems[] & SidebarProps> = (props) => {
    const { isMobileOpen = false, onMobileClose, ...menuItemsArray } = props || {}
    const pathname = usePathname();
    const lang = useAppSelector(state => state.lang) as { [key: string]: string }
    const user = useAppSelector(state => state.user)
    
    let filteredMenuItems = menuItemsArray
    if(!user.role) return null
    if(user.role) {
        filteredMenuItems = _.filter(menuItemsArray, item => item.role.includes(user.role))
    }
    return (
        <>
            <div className={cn(
                "position-fixed w-[14rem] h-[calc(100vh-80px)] p-2 bg-[#F9F9F9] border-r border-gray-200 shadow-lg z-30 transition-transform duration-300",
                // Desktop: always visible
                "md:translate-x-0",
                // Mobile: hidden by default, visible when isMobileOpen is true
                isMobileOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="md:flex-col md:items-stretch md:min-h-full bg-white md:flex-nowrap flex flex-wrap items-center justify-between w-full mx-auto">
                    <div className="flex flex-col py-2">
                        {_.map(filteredMenuItems, (item, index) => (
                          <Fragment key={item.title}>
                                <Link
                                    href={item.path}
                                    onClick={onMobileClose} // Close mobile menu when link is clicked
                                    className={cn(
                                        "flex items-center gap-3 p-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors",
                                        pathname.startsWith(item.path) && "bg-[#2F5CA4] rounded-md text-white hover:bg-blue-800 hover:text-white"
                                    )}
                                >
                                    <i className={cn(item.icon, "text-lg w-[30px]")} />
                                    <span>{lang[item.key]}</span>
                                </Link>
                                {(index == 1 || index == 2 || index == 5) && (
                                    <div className="border-t-2 border-gray-500 my-1 mx-2"></div>
                                )}
                          </Fragment>
                        ))}
                       

                    </div>
                    <div className="absolute bottom-[8px] left-4 text-sm text-gray-500">
                        Version 1.00
                    </div>
                </div>
            </div>
        </>
    );
}

export default Sidebar