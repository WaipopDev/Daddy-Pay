import { Col, Form } from "react-bootstrap";
import { cn } from '@/lib/utils';

interface UploadFileFormProps {
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    className?: string;
    required?: boolean;
    disabled?: boolean;
    defaultValue?: string;
    name?: string;
    id?: string;
}

const UploadFileForm: React.FC<UploadFileFormProps> = ({ placeholder, value, onChange, label, className = '', required = false, disabled = false, defaultValue, name, id }) => {

    return (
        <Col>
            <Form.Group className="flex items-center">
                <Form.Label className="basis-1/3 font-bold m-0">{label} { required && <span className="text-red-500">*</span>} :</Form.Label>
                <Form.Control className={cn(`basis-2/3 text-sm`, className)} type="file" placeholder={placeholder} value={value} onChange={onChange} required={required} disabled={disabled} defaultValue={defaultValue} name={name} id={id} />
            </Form.Group>
        </Col>
    );
};

export default UploadFileForm;
