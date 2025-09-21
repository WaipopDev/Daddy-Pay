import { Col, Form } from "react-bootstrap";
import { cn } from '@/lib/utils';

interface InputFormProps {
    placeholder?: string;
    type?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    className?: string;
    required?: boolean;
    disabled?: boolean;
    defaultValue?: string;
    name?: string;
    id?: string;
    isInvalid?: boolean;
    errorMessage?: string;
}

const InputForm: React.FC<InputFormProps> = ({ placeholder, type = "text", value, onChange, label, className = '', required = false, disabled = false, defaultValue, name, id, isInvalid, errorMessage }) => {

    return (
        <Col>
            <Form.Group className="flex items-center">
                <Form.Label className="basis-1/3 font-bold m-0">{label} { required && <span className="text-red-500">*</span>} :</Form.Label>
                <div className="basis-2/3">
                    <Form.Control className={cn(`text-sm`, className)} type={type} placeholder={placeholder} value={value} onChange={onChange} required={required} disabled={disabled} defaultValue={defaultValue} name={name} id={id} isInvalid={isInvalid} />
                    {isInvalid && <Form.Control.Feedback type="invalid">{errorMessage}</Form.Control.Feedback>}
                </div>
            </Form.Group>
        </Col>
    );
};

export default InputForm;
