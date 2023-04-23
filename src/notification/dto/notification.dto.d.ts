import { PriorityType } from '../notification.entity';
export declare class CreateNotificationDto {
    id: string;
    title: string;
    priority: PriorityType;
    courseId: string;
    description: string;
    startDate: string;
    endDate: string;
}
