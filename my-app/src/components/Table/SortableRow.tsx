import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableRowProps {
    id: string;
    children: React.ReactNode;
}

export function SortableRow({ id, children }: SortableRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
    };

    return (
        <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </tr>
    );
}
