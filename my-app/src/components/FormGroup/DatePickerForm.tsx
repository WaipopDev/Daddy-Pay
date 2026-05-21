'use client';

import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Col, Form } from 'react-bootstrap';
import DatePickerPopperContainer from './DatePickerPopperContainer';

interface DatePickerFormProps {
    label?: string;
    value: Date | null;
    onChange: (date: Date | null) => void;
    required?: boolean;
    disabled?: boolean;
    isInvalid?: boolean;
    errorMessage?: string;
}

const DatePickerForm: React.FC<DatePickerFormProps> = ({
    label,
    value,
    onChange,
    required = false,
    disabled = false,
    isInvalid = false,
    errorMessage,
}) => {
    const CustomInput = forwardRef<HTMLInputElement, { onClick?: () => void; value: string }>(
        (props, ref) => {
            const { onClick, value: inputValue } = props;
            const formatted = inputValue
                ? moment(inputValue, 'YYYY-MM-DD').format('DD-MM-YYYY')
                : '';

            return (
                <div
                    ref={ref}
                    onClick={onClick}
                    className="rounded-lg border-gray-300 form-control items-center flex px-2 cursor-pointer h-[35px] w-full"
                >
                    <i className="fas fa-calendar-day pr-3 text-gray-500"></i>
                    {formatted}
                </div>
            );
        }
    );

    CustomInput.displayName = 'DatePickerFormInput';

    return (
        <Col>
            <Form.Group className="flex items-center">
                <Form.Label className="basis-1/3 font-bold m-0">
                    {label} {required && <span className="text-red-500">*</span>} :
                </Form.Label>
                <div className="basis-2/3">
                    <DatePicker
                        className="w-full"
                        selected={value}
                        onChange={onChange}
                        dateFormat="yyyy-MM-dd"
                        disabled={disabled}
                        customInput={
                            <CustomInput
                                value={value ? moment(value).format('YYYY-MM-DD') : ''}
                            />
                        }
                        popperClassName="react-datepicker-popper"
                        popperContainer={DatePickerPopperContainer}
                        popperProps={{ strategy: 'fixed' }}
                    />
                    {isInvalid && (
                        <Form.Control.Feedback type="invalid" className="d-block">
                            {errorMessage}
                        </Form.Control.Feedback>
                    )}
                </div>
            </Form.Group>
        </Col>
    );
};

DatePickerForm.displayName = 'DatePickerForm';

export default DatePickerForm;
