import { Task } from '@/schemas/backend.schemas';
import * as z from "zod";

const getInitialsFromName = (name: string): string => {
    const parts = name.trim().split(/\s+/);
    const firstNameInitial = parts[0].charAt(0).toUpperCase();
    const lastNameInitial = parts.length > 1 
        ? parts[parts.length - 1].charAt(0).toUpperCase() 
        : '';
    return firstNameInitial + lastNameInitial;
};




type TagColor = 'gray' | 'orange' | 'info' | 'warning' | 'error' | 'success'

const mapStatusColor: Record<z.infer<typeof Task>['status'], TagColor> = {
    'TODO': 'error',
    'IN_PROGRESS': 'warning',
    'DONE': 'success',
    'CANCELED': 'gray'
}
const mapStatusLabel: Record<z.infer<typeof Task>['status'], string> = {
    'TODO': 'À faire',
    'IN_PROGRESS': 'En cours',
    'DONE': 'Terminée',
    'CANCELED': 'Abandonnée'
}


const isUserOwner = (userId: string, OwnerId: string) : boolean => {
    return (userId===OwnerId)
}


export { getInitialsFromName, mapStatusColor, mapStatusLabel, isUserOwner }