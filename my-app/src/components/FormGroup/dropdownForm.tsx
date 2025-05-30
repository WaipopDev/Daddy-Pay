import { useState } from "react";
import { Col, Dropdown, Form } from "react-bootstrap";
import { cn } from '@/lib/utils';

interface DropdownFormProps {
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    defaultValue?: string;
    name?: string;
    items?: { label: string; value: string }[];
}

const DropdownForm: React.FC<DropdownFormProps> = ({label, required = false, disabled = false, defaultValue, name, items }) => {
    const [status, setStatus] = useState(defaultValue || "active");
    
    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
    };

    return (
        <Col>
            <Form.Group className="flex items-center">
                <Form.Label className="basis-1/3 font-bold m-0">{label} { required && <span className="text-red-500">*</span>} :</Form.Label>
                <div className="basis-2/3">
                    <Form.Control
                        type="hidden"
                        name={name}
                        value={status}
                        required={required}
                        disabled={disabled}
                    />
                    <Dropdown className="nav-dropdown-w">
                        <Dropdown.Toggle 
                            className={cn(`flex items-center w-full px-2 py-2 rounded-md h-[35px]`, {
                                'cursor-not-allowed bg-gray-200': disabled,
                                'cursor-pointer bg-[#ECEEF5]': !disabled
                            })}
                            disabled={disabled}
                        >
                            <p className="px-2 w-full text-left text-sm">{ items && items.find(item => item.value === status)?.label}</p>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {
                                items && items.map((item, index) => (
                                    <Dropdown.Item key={index} onClick={() => handleStatusChange(item.value)}>
                                        {item.label}
                                    </Dropdown.Item>
                                ))
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </Form.Group>
        </Col>
    );
};

export default DropdownForm;
