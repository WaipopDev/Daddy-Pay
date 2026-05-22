import React from 'react';
import Image from 'next/image';
import { useMachineOperationCountdown } from '@/hooks/useMachineOperationCountdown';
import { parseOperationMinutes } from '@/utils/machineStatusUtils';
import type { MachineStatusItem as MachineStatusItemType } from '@/types/dashboardType';

interface MachineStatusItemProps {
    item: MachineStatusItemType;
    showOperationTime?: boolean;
}

const MachineStatusItem = ({
    item,
    showOperationTime = false,
}: MachineStatusItemProps) => {
    const operationMinutes = parseOperationMinutes(item.machineProgramOperationTime);
    const canCountdown =
        showOperationTime &&
        operationMinutes != null &&
        !!item.lastTransactionCreatedAt;

    const remainingLabel = useMachineOperationCountdown(
        item.lastTransactionCreatedAt,
        item.machineProgramOperationTime,
        canCountdown
    );

    return (
        <div className="flex flex-col items-center w-[72px] md:w-[80px]">
            <div className="w-[56px] h-[56px] md:w-[64px] md:h-[64px] rounded-full bg-white flex items-center justify-center overflow-hidden p-1">
                {item.machinePicturePath ? (
                    <Image
                        src={item.machinePicturePath}
                        alt={item.shopManagementName}
                        width={48}
                        height={48}
                        className="object-contain"
                    />
                ) : (
                    <i
                        className="fa-solid fa-gear text-[#01A0B6] text-xl"
                        aria-hidden="true"
                    ></i>
                )}
            </div>
            <p className="mt-1 mb-0 text-xs md:text-sm text-white text-center font-medium leading-tight">
                {item.shopManagementName}
            </p>
            {remainingLabel && (
                <p className="mb-0 text-[10px] md:text-xs text-white text-center leading-tight">
                    {remainingLabel}
                </p>
            )}
        </div>
    );
};

export default MachineStatusItem;
