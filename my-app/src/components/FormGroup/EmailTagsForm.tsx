'use client';

import React, { KeyboardEvent, useState } from 'react';
import { Badge, Col, Form } from 'react-bootstrap';
import { cn } from '@/lib/utils';
import { isValidEmailTag, joinEmailTags, parseEmailTags } from '@/utils/emailTagsUtils';

interface EmailTagsFormProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    onInvalidInput?: (message: string) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    isInvalid?: boolean;
    errorMessage?: string;
    addHint?: string;
    invalidEmailMessage?: string;
}

const EmailTagsForm: React.FC<EmailTagsFormProps> = ({
    label,
    value,
    onChange,
    placeholder = '',
    required = false,
    disabled = false,
    isInvalid = false,
    errorMessage,
    addHint,
    onInvalidInput,
    invalidEmailMessage = 'Invalid email format',
}) => {
    const [inputValue, setInputValue] = useState('');
    const emails = parseEmailTags(value);

    const updateEmails = (nextEmails: string[]) => {
        onChange(joinEmailTags(nextEmails));
    };

    const addEmail = (raw: string) => {
        const email = raw.trim().toLowerCase();
        if (!email) return;

        if (!isValidEmailTag(email)) {
            onInvalidInput?.(invalidEmailMessage);
            return;
        }

        if (emails.includes(email)) {
            setInputValue('');
            return;
        }

        updateEmails([...emails, email]);
        setInputValue('');
    };

    const removeEmail = (email: string) => {
        updateEmails(emails.filter((item) => item !== email));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addEmail(inputValue);
        } else if (e.key === 'Backspace' && !inputValue && emails.length > 0) {
            removeEmail(emails[emails.length - 1]);
        }
    };

    const handleBlur = () => {
        if (inputValue.trim()) {
            addEmail(inputValue);
        }
    };

    return (
        <Col>
            <Form.Group className="flex items-start">
                <Form.Label className="basis-1/3 font-bold m-0 pt-2">
                    {label} {required && <span className="text-red-500">*</span>} :
                </Form.Label>
                <div className="basis-2/3">
                    <div
                        className={cn(
                            'min-h-[35px] rounded-lg border px-2 py-1 flex flex-wrap gap-1 items-center bg-white',
                            isInvalid ? 'border-danger' : 'border-gray-300',
                            disabled && 'bg-gray-200 cursor-not-allowed'
                        )}
                    >
                        {emails.map((email) => (
                            <Badge
                                key={email}
                                bg="primary"
                                className="flex items-center gap-1 text-xs font-normal py-1 px-2"
                            >
                                {email}
                                {!disabled && (
                                    <button
                                        type="button"
                                        className="border-0 bg-transparent text-white p-0 leading-none"
                                        onClick={() => removeEmail(email)}
                                        aria-label={`Remove ${email}`}
                                    >
                                        <i className="fa-solid fa-xmark text-xs"></i>
                                    </button>
                                )}
                            </Badge>
                        ))}
                        <input
                            type="text"
                            className="flex-1 min-w-[120px] border-0 outline-none text-sm py-1 bg-transparent"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={handleBlur}
                            placeholder={emails.length === 0 ? placeholder : ''}
                            disabled={disabled}
                        />
                    </div>
                    {addHint && (
                        <Form.Text className="text-muted text-xs">{addHint}</Form.Text>
                    )}
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

export default EmailTagsForm;
