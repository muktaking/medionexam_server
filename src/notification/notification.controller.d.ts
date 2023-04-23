import { CreateNotificationDto } from './dto/notification.dto';
import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    findAllNotification(req: any): Promise<any>;
    findAllRawNotification(): Promise<any>;
    createNotification(createNotification: CreateNotificationDto, req: any): Promise<{
        message: string;
        data: any;
    }>;
    updateNotification(createNotification: CreateNotificationDto, req: any): Promise<{
        message: string;
        data: any;
    }>;
    deleteNotification(param: any, req: any): Promise<{
        message: string;
        data: any;
    }>;
}
