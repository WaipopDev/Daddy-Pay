import React from "react";
import { useDispatch } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import { useRouter } from 'next/navigation';

import { setProcess } from "@/store/features/modalSlice";
import { clearPropsUser } from "@/store/features/userSlice";
import axios from "axios";
import { useAppSelector } from "@/store/hook";


const UserDropdown = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const user     = useAppSelector(state => state.user)
    const lang     = useAppSelector(state => state.lang) as { [key: string]: string };

    const handleLogout = async () => {
        try {
            dispatch(setProcess(true))
            dispatch(clearPropsUser())
            await axios.get('/api/logout');
            // 
            window.location.href = '/login';
            dispatch(setProcess(false))
        } catch (error) {
            console.log("🚀 ~ logout ~ error:", error)
            dispatch(setProcess(false))
        }
    }

    const handleChangePassword = () => {
        router.push('/change-password');
    }

    return (
        <>
            <Dropdown className="nav-dropdown-w">
                <Dropdown.Toggle className="flex items-center w-full cursor-pointer bg-[#ECEEF5] px-3 py-2 lg:min-w-[250px] rounded-md">
                    <i className="fa-solid fa-circle-user text-[30px]"></i>
                    <p className="px-2 w-full text-left">{user.username}</p>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleChangePassword()}>
                        {lang['menu_change_password']}
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleLogout()}>
                        {lang['menu_logout']}
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </>
    )
}

export default UserDropdown;