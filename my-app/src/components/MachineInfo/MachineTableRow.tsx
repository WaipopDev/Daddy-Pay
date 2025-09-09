import React from 'react';
import { Button } from 'react-bootstrap';
import { PAGINATION_CONFIG } from '@/constants/main';
import { getRowNumber } from '@/utils/main';
import Image from 'next/image';
import { MachineTableRowProps } from '@/types/machineInfoType';


const MachineTableRow: React.FC<MachineTableRowProps> = ({ 
    item, 
    index, 
    currentPage, 
    // lang, 
    onEdit, 
    onDelete 
}) => {
    const rowNumber = getRowNumber(index, currentPage, PAGINATION_CONFIG.ITEMS_PER_PAGE);

    return (
        <tr >
            <td>{rowNumber}</td>
            <td>{item.machineType}</td>
            <td>{item.machineBrand}</td>
            <td>{item.machineModel}</td>
            <td>{item.machineDescription}</td>
            <td>
                <div className="flex justify-center">
                    {item.machinePicturePath && <Image src={item.machinePicturePath} alt={item.machineType} width={40} height={40} />}
                </div>
            </td>
            <td>
                <Button variant="warning" size="sm" onClick={() =>  onEdit(item.id)}><i className="fa-solid fa-pen-to-square"></i></Button>
                <Button variant="danger" size="sm" className="ml-2" onClick={() =>  onDelete(item.id)}><i className="fa-solid fa-trash"></i></Button>
            </td>
        </tr>
    );
};

MachineTableRow.displayName = 'MachineTableRow';

export default MachineTableRow;
