import React from 'react'
import Button from 'react-bootstrap/Button';
import { useAppSelector } from '@/store/hook';
// import Spinner from 'react-bootstrap/Spinner';

interface Props {
    handleCancel: () => void;
}
const ButtonCancel = ({ handleCancel }: Props) => {
    const lang = useAppSelector(state => state.lang) as { [key: string]: string };
    return (
        <Button variant="secondary" type="button" onClick={() => handleCancel()}>
            <i className="fa-solid fa-xmark"></i> {lang['button_cancel']}
        </Button>
    )
}

export default ButtonCancel