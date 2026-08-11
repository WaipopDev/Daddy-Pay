import { useState } from "react";
import { Col, Form } from "react-bootstrap";
import { cn } from '@/lib/utils';
import SearchableDropdown from '@/components/FormGroup/SearchableDropdown';

interface DropdownFormProps {
    placeholder?: string;
    value?: string;
    onChange?: (e: string) => void;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    defaultValue?: string;
    name?: string;
    items?: { label: string; value: string }[];
    isInvalid?: boolean;
    errorMessage?: string;
}

const DropdownForm: React.FC<DropdownFormProps> = ({label, required = false, disabled = false, defaultValue, name, items, onChange, placeholder = '...', isInvalid, errorMessage}) => {
    
    const [value, setValue] = useState(defaultValue || "");

    const handleValueChange = (newValue: string) => {
        setValue(newValue);
        onChange?.(newValue);
    };

    return (
        <Col>
            <Form.Group className="flex items-center">
                <Form.Label className="basis-1/3 font-bold m-0">{label} { required && <span className="text-red-500">*</span>} :</Form.Label>
                <div className="basis-2/3">
                    <Form.Control
                        type="hidden"
                        name={name}
                        value={value}
                        required={required}
                        disabled={disabled}
                        isInvalid={isInvalid}
                    />
                    <SearchableDropdown
                        items={items || []}
                        value={value}
                        onChange={handleValueChange}
                        placeholder={placeholder}
                        disabled={disabled}
                        toggleClassName={cn({
                            'cursor-not-allowed bg-gray-200': disabled,
                            'cursor-pointer bg-[#ECEEF5]': !disabled
                        })}
                    />
                </div>
                {isInvalid && <Form.Control.Feedback type="invalid">{errorMessage}</Form.Control.Feedback>}
            </Form.Group>
        </Col>
    );
};

export default DropdownForm;
