import React from 'react';
import type { MachineStatusData } from '@/types/dashboardType';
import MachineStatusPanel from './MachineStatusPanel';

interface MachineStatusBoxesProps {
    machineStatus: MachineStatusData | null;
    lang: { [key: string]: string };
}

const MachineStatusBoxes = ({ machineStatus, lang }: MachineStatusBoxesProps) => {
    if (!machineStatus) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
            <MachineStatusPanel
                title={lang['page_dashboard_machine_status_available']}
                bgClass="bg-[#3CB29D]"
                headerIcon="fa-gear"
                headerIconColor="#3CB29D"
                items={machineStatus.availableItems}
            />
            <MachineStatusPanel
                title={lang['page_dashboard_machine_status_operating']}
                bgClass="bg-[#01A0B6]"
                headerIcon="fa-gear"
                headerIconColor="#01A0B6"
                items={machineStatus.operatingItems}
                showOperationTime
            />
            <MachineStatusPanel
                title={lang['page_dashboard_machine_status_disconnected']}
                bgClass="bg-[#E56979]"
                headerIcon="fa-plug-circle-xmark"
                headerIconColor="#E56979"
                items={machineStatus.disconnectedItems}
            />
        </div>
    );
};

export default MachineStatusBoxes;
