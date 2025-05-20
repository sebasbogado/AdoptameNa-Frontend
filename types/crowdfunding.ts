export interface ResponseCrowdfundingDTO {
    id: number;
    title: string;
    description: string;
    goal: number;
    currentAmount: number;
    status: 'ACTIVE' | 'CLOSED' | 'NONE' | 'PENDING' | 'REJECTED';
    durationDays: number;
    startDate: string;
    endDate: string;
    userId: number;
}
export enum CrowdfundingStatus {
    ACTIVE = 'ACTIVE',
    CLOSED = 'CLOSED',
    NONE = 'NONE',
    PENDING = 'PENDING',
    REJECTED = 'REJECTED',
}
export enum FilterStatus {
    ALL = 'Todos',
    ACTIVE = 'Activo',
    PENDING = 'Pendiente',
    CLOSED = 'Finalizado',
    REJECTED = 'Rechazado',

}