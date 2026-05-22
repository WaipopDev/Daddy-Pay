import React from 'react';
import type { MachineStatusItem } from '@/types/dashboardType';
import MachineStatusItemComponent from './MachineStatusItem';

interface MachineStatusPanelProps {
    title: string;
    bgClass: string;
    headerIcon?: string;
    headerIconColor?: string;
    items: MachineStatusItem[];
    showOperationTime?: boolean;
}

const MachineStatusPanel = ({
    title,
    bgClass,
    headerIcon,
    headerIconColor = '#3CB29D',
    items,
    showOperationTime = false,
}: MachineStatusPanelProps) => (
    <div
        className={`rounded-md px-3 py-3 md:px-4 md:py-4 ${bgClass} text-white min-h-[140px]`}
    >
        <div className="flex items-start justify-between mb-3">
            <p className="mb-0 text-sm md:text-base font-medium">{title}</p>
            {headerIcon && (
                <div className="rounded-full bg-white p-1.5 md:p-2 w-[32px] h-[32px] md:w-[36px] md:h-[36px] flex items-center justify-center shrink-0">
                    <i
                        className={`fa-solid ${headerIcon} text-[16px] md:text-[18px]`}
                        style={{ color: headerIconColor }}
                        aria-hidden="true"
                    ></i>
                </div>
            )}
        </div>
        {items.length > 0 ? (
            <div className="flex flex-wrap gap-3 md:gap-4">
                {items.map((item) => (
                    <MachineStatusItemComponent
                        key={item.id}
                        item={item}
                        showOperationTime={showOperationTime}
                    />
                ))}
            </div>
        ) : (
            <p className="mb-0 text-xs md:text-sm text-white/80">-</p>
        )}
    </div>
);

export default MachineStatusPanel;
