'use client'
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
// import NotificationDropdown from "components/Dropdowns/NotificationDropdown.js";
// import UserDropdown from "@/components/Dropdowns/UserDropdown";

interface Props {
    title: string;
    slug: string,
    titleBar: string
}

interface MenuItems {
    name: string;
    href: string;
    icon: string;
}


const menuItems: MenuItems[][] = [
    // [
    //     { name: 'แดชบอร์ด', href: '/dashboard', icon: 'fas fa-chart-pie' },
    //     { name: 'รายงาน', href: '/report', icon: 'fas fa-file-invoice-dollar' },
    // ],
    [
        { name: 'รับผ้าจากลูกค้า', href: '/services_input', icon: 'fas fa-tasks' },
        { name: 'ตรวจสอบผ้าก่อนซัก', href: '/services_check', icon: 'fas fa-tshirt' },
        { name: 'ตรวจสอบผ้าก่อนส่งมอบ', href: '/services_deliver', icon: 'fas fa-vest-patches' }
    ],
    [
        { name: 'ข้อมูลลูกค้า', href: '/customer_information', icon: 'fas fa-users' },
        { name: 'ข้อมูลผ้า', href: '/fabric_information', icon: 'fas fa-vest' },
        { name: 'ข้อมูลการใช้ผ้า', href: '/fabric_usage', icon: 'fa-solid fa-user-clock' }
    ],
    [
        { name: 'ข้อมูลผู้ใช้งาน', href: '/users', icon: 'fas fa-user' },
    ]
];

const menuBasicItems: MenuItems[] = [
    { name: 'ข้อมูล RFID แบบกลุ่ม', href: '/group_item_rfid', icon: 'fa-solid fa-barcode' },
    { name: 'ข้อมูล RFID', href: '/item_rfid', icon: 'fa-solid fa-barcode' },
    { name: 'ข้อมูลประเภท', href: '/basic/fabric_types', icon: 'fas fa-list' },
    { name: 'ข้อมูลหน่วยนับ', href: '/basic/counting_units', icon: 'fas fa-list' },
    { name: 'ข้อมูลประเภทการใช้งาน', href: '/basic/type_of_use', icon: 'fas fa-list' },
];
const Sidebar: React.FC<Props> = (props) => {
    const { title, slug, titleBar } = props
    const [collapseShow, setCollapseShow] = React.useState("hidden");
    const router = useRouter();
    // const authState = useSelector((state: RootState) => state.auth.user);
    return (
        <>
            <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 font-sukhumvit">
                <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap flex flex-wrap items-center justify-between w-full mx-auto">
                    {/* Toggler */}
                    <button
                        className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                        type="button"
                        onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
                    >
                        <i className="fas fa-bars"></i>
                    </button>
                    <Link href="/dashboard" className="max-md:hidden md:block text-left bg-blue-900 text-white mr-0 inline-block whitespace-nowrap text-sm font-bold py-7 px-6">
                        ระบบบริหารจัดการโรงงานซักผ้า
                    </Link>
                    <ul className="md:hidden items-center flex flex-wrap list-none">
                        <li className="inline-block relative">
                            {/* <NotificationDropdown /> */}
                        </li>
                        <li className="inline-block relative">
                            {/* <UserDropdown /> */}
                        </li>
                    </ul>
                    <div
                        className={
                            "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
                            collapseShow
                        }
                    >
                        {/* Collapse header */}
                        <div className="md:min-w-full md:hidden block mb-4 border-b border-solid border-blueGray-200 bg-blue-900">
                            <div className="flex flex-wrap">
                                <div className="w-6/12">
                                    <Link href="/" className="md:block text-left md:pb-2 text-white mr-0 inline-block whitespace-nowrap text-sm font-bold">
                                        ระบบบริหารจัดการโรงงานซักผ้า
                                    </Link>
                                </div>
                                <div className="w-6/12 flex justify-end">
                                    <button
                                        type="button"
                                        className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                                        onClick={() => setCollapseShow("hidden")}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {menuItems.map((item, index) => (
                            <div key={index}>
                                <ul className="md:flex-col md:min-w-full flex flex-col list-none py-0 px-6">
                                    {item.map((item2, index2) => (
                                        <li key={index2} className="items-center mb-1">
                                            {/* <Link href={item2.href} className={
                                                "text-sm p-3 font-bold block rounded-lg " +
                                                (router.pathname.indexOf(item2.href) !== -1
                                                    ? "text-white hover: bg-blue-400"
                                                    : "text-black hover:text-white hover:bg-blue-400")
                                            }>
                                                <i
                                                    className={`${item2.icon || 'fas fa-tv'} mr-2 text-sm text-black`}
                                                ></i>{` ${item2.name}`}

                                            </Link> */}
                                        </li>
                                    ))}
                                </ul>
                                <hr className="my-2 md:min-w-full border-black" />
                            </div>
                        ))}
                       

                    </div>
                </div>
            </nav>
        </>
    );
}

export default Sidebar