export interface ResponseCrowdfundingDTO {
    id: number;
    title: string;
    description: string;
    goal: number;
    currentAmount: number;
    status: 'ACTIVE' | 'CLOSED' | 'NONE' | 'PENDING';
    durationDays: number;
    startDate?: string;
    endDate?: string;
}
export enum CrowdfundingStatus {
    ACTIVE = 'ACTIVE',
    CLOSED = 'CLOSED',
    NONE = 'NONE',
    PENDING = 'PENDING',
}
export enum FilterStatus {
    ALL = 'Todos',
    ACTIVE = 'Activo',
    PENDING = 'Pendiente',
    CLOSED = 'Cerrado',
}