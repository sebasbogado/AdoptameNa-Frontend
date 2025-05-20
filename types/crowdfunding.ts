export interface ResponseCrowdfundingDTO {
    id: number;
    title: string;
    description: string;
    goal: number;
    currentAmount: number;
    status: 'ACTIVE' | 'CLOSED' | 'NONE' | 'PENDING';
    durationDays: number;
    startDate: string;
    endDate: string;
    userId: number;
}