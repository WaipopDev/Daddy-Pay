import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import NavDropdown from 'react-bootstrap/NavDropdown';

import CustomToggle from "@/components/Dropdowns/CustomToggle";
import { auths } from '@/firebase/Auth';
import { useAlerts } from '@/utils/helpers';

const UserDropdown = () => {
  const authUser = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const { processing, alerts } = useAlerts();

  const handleLogout = async () => {
    try {
      processing(true)
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
      await auths().logout()
      processing(false)
    } catch (error) {
      processing(false)
      alerts({message:'เกิดข้อผิดพลาดในการออกจากระบบ'})
    }
  }

  const str = authUser?.displayName || 'AD';
  const cutStr = str.length >= 2 ? str.slice(0, 2) : str;

  return (
    <>
      <NavDropdown title={<CustomToggle name={cutStr.toUpperCase()} displayName={ authUser?.displayName || 'Admin'} />} className="custom-navdropdown">

        {/* <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.2">
          Another action
        </NavDropdown.Item>
        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item> */}
        {/* <NavDropdown.Divider /> */}
        <NavDropdown.Item onClick={()=> handleLogout()}>
          ออกจากระบบ
        </NavDropdown.Item>
      </NavDropdown>
    </>
  );
};

export default UserDropdown;
