'use client';
import React, { useCallback, useEffect, useState } from 'react'
import UserDropdown from "@/components/Dropdowns/UserDropdown";
import Image from "next/image";
// import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { getData } from '@/app/actions';
import { setPropsUser } from '@/store/features/userSlice';
import axios, { AxiosError } from 'axios';
import { Dropdown } from 'react-bootstrap';
import Cookies from 'js-cookie'
import _ from 'lodash';
import { SHOP_INFO_API_ENDPOINTS } from '@/constants/shopInfo';

interface LanguageProp {
   [key: string]: string;
}

interface ShopInfo {
    shopName: string;
    shopUploadFile: string;
}

interface UserPermission {
    shopId: string;
}

interface UserDataWithPermissions extends UserAdmin {
    rolePermissions?: UserPermission[];
    permissions?: UserPermission[];
}

interface AdminNavbarProps {
    onMenuToggle?: () => void;
    isMenuOpen?: boolean;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ onMenuToggle, isMenuOpen }) => {
    // const router = useRouter();
    // const pathname = usePathname();
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.user)

    // const [activeLanguage, setActiveLanguage] = useState('en')
    const [languages, setLanguages] = useState<LanguageProp>({})
    const [shopInfo, setShopInfo] = useState<ShopInfo | null>(null)

    const langCode: string = Cookies.get('lang') || 'en'

    const getUser = useCallback(async () => {
        const res = await getData() as UserDataWithPermissions;
        dispatch(setPropsUser(res))
        
        // Check if user role is 'user' or 'admin' and fetch shop info if needed
        if (res && (res.role === 'user' || res.role === 'admin')) {
            // Get rolePermissions or permissions from user data
            const rolePermissions = res.rolePermissions || res.permissions || [];
     
            if (rolePermissions && rolePermissions.length > 0) {
                const firstShopId = rolePermissions[0]?.shopId;
                if (firstShopId) {
                    
                    try {
                        const shopResponse = await axios.get(SHOP_INFO_API_ENDPOINTS.GET_BY_ID_API(firstShopId), {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            withCredentials: true,
                        });
                        if (shopResponse.data) {
                            setShopInfo({
                                shopName: shopResponse.data.shopName || 'Daddy Pay',
                                shopUploadFile: shopResponse.data.shopUploadFile || '/images/logo.png'
                            });
                        }
                    } catch (error) {
                        const axiosError = error as AxiosError;
                        console.error('Error fetching shop info:', axiosError);
                        // Silently fail - will show default logo and name
                    }
                }
            }
        }
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

    const fetchShopInfoForUser = useCallback(async () => {
        if (!user.role || (user.role !== 'user' && user.role !== 'admin') || shopInfo) {
            return;
        }
    
        
        try {
            const userData = await getData() as UserDataWithPermissions;
            const rolePermissions = userData.rolePermissions || userData.permissions || [];
            
            if (rolePermissions && rolePermissions.length > 0) {
                const firstShopId = rolePermissions[0]?.shopId;
                if (firstShopId) {
                    const shopResponse = await axios.get(SHOP_INFO_API_ENDPOINTS.GET_BY_ID_API(firstShopId), {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        withCredentials: true,
                    });
                    if (shopResponse.data) {
                        setShopInfo({
                            shopName: shopResponse.data.shopName || 'Daddy Pay',
                            shopUploadFile: shopResponse.data.shopUploadFile || '/images/logo.png'
                        });
                    }
                }
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error fetching shop info:', axiosError);
            // Silently fail - will show default logo and name
        }
    }, [user.role, shopInfo])

    useEffect(() => {
        if (!user.username) {
            getUser()
        } else {
            fetchShopInfoForUser()
        }
    }, [user.username, getUser, fetchShopInfoForUser])

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
            <nav className="w-full position-fixed items-center z-10">
                <div className="bg-white fixed top-0 left-0 right-0 flex flex-wrap items-center justify-between h-[80px] px-2 border-b-[1px] border-[#b1b2b4]">
                    <div className="flex items-center">
                        {/* Mobile hamburger menu button */}
                        <button
                            onClick={onMenuToggle}
                            className="md:hidden flex items-center justify-center w-10 h-10 mr-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                            aria-label="Toggle menu"
                        >
                            <i className={`fa-solid ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
                        </button>
                        
                        <div className="flex items-center cursor-pointer">
                            <Image 
                                src={shopInfo?.shopUploadFile || "/images/logo.png"} 
                                width={60} 
                                height={60} 
                                priority 
                                alt="logo" 
                            />
                            <h2 className="font-bold">
                                {shopInfo?.shopName || 'Daddy Pay'}
                            </h2>
                        </div>
                    </div>
                    
                    {/* Desktop menu */}
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
                    
                    {/* Mobile menu - only show user dropdown on mobile */}
                    <div className="md:hidden">
                        <UserDropdown />
                    </div>
                </div>
            </nav>
            {/* End Navbar */}
        </>
    )
}

export default AdminNavbar