export interface Crowdfunding {
    id: number;
    title: string;
    description: string;
    durationDays: number;
    goal: number;
    userId: number;
    currentAmount: number;
    startDate: string;
    endDate: string;
    status: "ACTIVE" | "CLOSED" | "NONE" | "PENDING" | "REJECTED";
}