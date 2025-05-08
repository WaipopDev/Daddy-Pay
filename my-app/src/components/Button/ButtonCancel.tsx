import React from 'react'
import Button from 'react-bootstrap/Button';
// import Spinner from 'react-bootstrap/Spinner';

interface Props {
    handleCancel: () => void;
}
const ButtonCancel = ({ handleCancel }: Props) => {

    return (
        <Button variant="secondary" type="button" onClick={() => handleCancel()}>
            <i className="fa-solid fa-xmark"></i> ยกเลิก
        </Button>
    )
}

export default ButtonCancel