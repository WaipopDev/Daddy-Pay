'use client';
import React, { useCallback, useEffect, useState } from 'react'
import UserDropdown from "@/components/Dropdowns/UserDropdown";
import Image from "next/image";
// import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { getData } from '@/app/actions';
import { setPropsUser } from '@/store/features/userSlice';
import axios from 'axios';
import { Dropdown } from 'react-bootstrap';
import Cookies from 'js-cookie'
import _ from 'lodash';

interface LanguageProp {
   [key: string]: string;
}

const AdminNavbar: React.FC = () => {
    // const router = useRouter();
    // const pathname = usePathname();
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.user)

    // const [activeLanguage, setActiveLanguage] = useState('en')
    const [languages, setLanguages] = useState<LanguageProp>({})

    const langCode: string = Cookies.get('lang') || 'en'

    const getUser = useCallback(async () => {
        const res = await getData()
        dispatch(setPropsUser(res))
    }, [dispatch])

    const getLanguage = useCallback(async () => {
        const res = await axios.get('/api/lang/list')
       
        if (res.data) {
            setLanguages(res.data)
        } else {
            setLanguages({})
        }
    }, [])

    useEffect(() => {
        getLanguage()
   
    }, [getLanguage])

    useEffect(() => {
        if (!user.username) {
            getUser()
        }
    }, [user.username, getUser])

    const setActiveLanguage = async (langCode: string) => {
        console.log("🚀 ~ setActiveLanguage ~ langCode:", langCode)
        // try {
        //     if (langCode) {
        //         await axios.get(`/api/lang?langCode=${langCode}`)
        //     } else {
        //         await axios.get('/api/lang?langCode=en')
        //     }
        //     window.location.reload()
        // } catch (error) {
        //     console.error("Error setting language:", error)
        // }
    }

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
                        <Dropdown className="nav-dropdown-lang mr-2">
                            <Dropdown.Toggle className="flex items-center w-full cursor-pointer px-3 py-2 lg:min-w-[180px] rounded-md">
                                <i className="fa-solid fa-language text-[30px]"></i>
                                <p className="px-2 w-full text-left">{languages && langCode && languages[langCode.toUpperCase()]}</p>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {_.map(languages, (lang, key) => (
                                    <Dropdown.Item key={key} onClick={() => setActiveLanguage(key)} className={`cursor-pointer ${langCode.toUpperCase() === key ? 'bg-[#f0f0f0]' : ''}`}>
                                        {lang}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                        <UserDropdown />
                    </div>
                </div>
            </nav>
            {/* End Navbar */}
        </>
    )
}

export default AdminNavbar