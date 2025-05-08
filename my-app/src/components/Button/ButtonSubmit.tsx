import React from 'react'
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

interface Props {
    isProcess: boolean;
    title: string;
    variant?: string;
    className?: string;
    icon?: string | null;
}
const ButtonSubmit = ({ isProcess, title, variant = 'primary', className = 'w-[100%]', icon = null }: Props) => {
    let iconElement = null;
    if (icon) {
        iconElement = <i className={`${icon} mr-2`}></i>
    }
    return (
        <Button variant={variant} type="submit" className={className} disabled={isProcess}>
            {isProcess ? (
                <>
                    <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />
                    {`Process ${title}...`}
                </>) : (<p className="text-xl">{iconElement}{title}</p>)}
        </Button>
    )
}

export default ButtonSubmit