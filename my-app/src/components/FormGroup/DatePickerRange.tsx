import React, { FC, forwardRef } from 'react'
import DatePicker from "react-datepicker";
import moment from 'moment';

interface Props {
    onChange?: ((value: [Date | null, Date | null]) => void);
    dateValue: [Date | null, Date | null] | null;
    selected?: Date | null | undefined;
}
const DatePickerRange: FC<Props> = (props) => {
    const { onChange = () => { }, dateValue } = props

    const handleChange = (date: [Date | null, Date | null]) => {
        onChange([date[0], date[1]]);
    }
    const CustomInput = forwardRef<HTMLInputElement, { onClick?: () => void; value: string }>((props) => {
        const { onClick, value } = props
        const sp = value ? value.split(' - ') : [];
        const start = sp[0] ? moment(sp[0],'MM/DD/YYYY').format('DD-MM-YYYY') : '';
        const end = sp[1] ? moment(sp[1],'MM/DD/YYYY').format('DD-MM-YYYY') : '';
        const valueDisplay = start || end ? `${start} - ${end}` : '';
        // console.log("🚀 ~ value:", value)
        return (
            <div onClick={onClick} className="rounded-lg border-gray-300 form-control items-center flex px-2 cursor-pointer h-[35px]">
                <i className="fas fa-calendar-day pr-3 text-gray-500"></i>{valueDisplay}
            </div>
        )
    })

    CustomInput.displayName = 'CustomInput'
    
    
    return (
        <div className="">
            <div className="w-full">
                <DatePicker 
                    className="w-full"
                    customInput={<CustomInput value={dateValue ? moment(dateValue[0]).format('YYYY-MM-DD') : ''} />}
                    selected={dateValue ? dateValue[0] : null}
                    onChange={(date) => handleChange(date)}
                    selectsRange
                    startDate={dateValue ? dateValue[0] : null}
                    endDate={dateValue ? dateValue[1] : null}
                />
            </div>
        </div>
    )
}

DatePickerRange.displayName = 'DatePickerRange'

export default DatePickerRange