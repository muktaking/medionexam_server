import { BaseEntity, Timestamp } from 'typeorm';
export declare enum PriorityType {
    Urgent = 1,
    Immediate = 2,
    Normal = 3
}
export declare class Notification extends BaseEntity {
    id: number;
    title: string;
    priority: PriorityType;
    courseId: number;
    description: string;
    createdAt: Timestamp;
    startDate: Timestamp;
    endDate: Timestamp;
    creatorId: number;
    modifiedBy: number;
}
