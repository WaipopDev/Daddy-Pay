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
}


const Sidebar: React.FC<MenuItems[]> = (menuItems) => {
    const pathname = usePathname();
    const lang = useAppSelector(state => state.lang) as { [key: string]: string }
    return (
        <>
            <div className="position-fixed w-64 h-[calc(100vh-80px)] p-2 bg-[#F9F9F9] border-r border-gray-200 shadow-lg">
                <div className="md:flex-col md:items-stretch md:min-h-full bg-white md:flex-nowrap flex flex-wrap items-center justify-between w-full mx-auto">
                    <div className="flex flex-col py-4">
                        {_.map(menuItems, (item, index) => (
                          <Fragment key={item.title}>
                                <Link
                                    href={item.path}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors",
                                        pathname.startsWith(item.path) && "bg-[#2F5CA4] rounded-md text-white hover:bg-blue-800 hover:text-white"
                                    )}
                                >
                                    <i className={cn(item.icon, "text-lg w-[30px]")} />
                                    <span>{lang[item.key]}</span>
                                </Link>
                                {(index == 1 || index == 2 || index == 5) && (
                                    <div className="border-t-2 border-gray-500 my-2 mx-4"></div>
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