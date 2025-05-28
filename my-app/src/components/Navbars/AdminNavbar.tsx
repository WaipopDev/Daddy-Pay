'use client';
import React, { useCallback, useEffect } from 'react'
import UserDropdown from "@/components/Dropdowns/UserDropdown";
import Image from "next/image";
// import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { getData } from '@/app/actions';
import { setPropsUser } from '@/store/features/userSlice';


const AdminNavbar: React.FC = () => {
    // const router = useRouter();
    // const pathname = usePathname();
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.user)


    const getUser = useCallback(async () => {

        const res = await getData()
        dispatch(setPropsUser(res))
    }, [dispatch])

    useEffect(() => {
        if (!user.username) {
            getUser()
        }
    }, [user.username, getUser])
    return (
        <>
            {/* Navbar */}
            <nav className="w-full position-fixed items-center  z-10">
                <div className="bg-white fixed top-0 left-0 right-0 flex flex-wrap items-center justify-between h-[80px] px-2 border-b-[1px] border-[#b1b2b4]">
                    <div className="flex items-center cursor-pointer">
                        <Image src="/images/logo.png" width={60} height={60} priority alt="logo" />
                        <h2 className="font-bold">
                            {'Daddy Pay'}
                        </h2>
                    </div>
                    <div className="flex-col md:flex-row list-none items-center hidden md:flex">
                        <UserDropdown />
                    </div>
                </div>
            </nav>
            {/* End Navbar */}
        </>
    )
}

export default AdminNavbar