import { CoursesService } from 'src/courses/courses.service';
import { User } from 'src/users/user.entity';
import { CreateNotificationDto } from './dto/notification.dto';
import { NotificationRepository } from './notification.repository';
export declare class NotificationService {
    private readonly coursesService;
    private notificationRepository;
    constructor(coursesService: CoursesService, notificationRepository: NotificationRepository);
    findAllNotification(user: any): Promise<any>;
    findAllRawNotification(): Promise<any>;
    createNotification(createNotification: CreateNotificationDto, user: User): Promise<{
        message: string;
        data: any;
    }>;
    updateNotification(createNotification: CreateNotificationDto, user: User): Promise<{
        message: string;
        data: any;
    }>;
    deleteNotification(id: any, user: any): Promise<{
        message: string;
        data: any;
    }>;
}
