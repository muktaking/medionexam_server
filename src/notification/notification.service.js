"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const courses_service_1 = require("../courses/courses.service");
const utils_1 = require("../utils/utils");
const typeorm_2 = require("typeorm");
const notification_repository_1 = require("./notification.repository");
let NotificationService = class NotificationService {
    constructor(coursesService, notificationRepository) {
        this.coursesService = coursesService;
        this.notificationRepository = notificationRepository;
    }
    async findAllNotification(user) {
        const courses = await this.coursesService.findAllCoursesEnrolledByStudent(user.id);
        const [err, gns] = await (0, utils_1.to)(this.notificationRepository.find({
            select: [
                'id',
                'title',
                'description',
                'priority',
                'startDate',
                'endDate',
            ],
            where: [{
                    courseId: (0, typeorm_2.In)(courses.map(c => c.id)),
                    endDate: (0, typeorm_2.MoreThanOrEqual)(new Date()),
                }, {
                    courseId: (0, typeorm_2.IsNull)(),
                    endDate: (0, typeorm_2.MoreThanOrEqual)(new Date()),
                },]
        }));
        console.log(err);
        if (err)
            throw new common_1.InternalServerErrorException(err.message);
        return gns;
    }
    async findAllRawNotification() {
        const [err, ns] = await (0, utils_1.to)(this.notificationRepository.find({ select: ['id', 'title', 'description', 'priority', 'courseId', 'startDate', 'endDate'], relations: ['courseId'] }));
        if (err)
            throw new common_1.InternalServerErrorException(err.message);
        return ns;
    }
    async createNotification(createNotification, user) {
        const { title, priority, courseId, description, startDate, endDate, } = createNotification;
        const notification = this.notificationRepository.create({
            title,
            priority,
            courseId: courseId === '0' ? null : +courseId,
            description,
            startDate,
            endDate,
            creatorId: user.id,
        });
        const [err, res] = await (0, utils_1.to)(notification.save());
        if (err)
            throw new common_1.InternalServerErrorException(err.message);
        return { message: 'Successfully created the notification', data: res };
    }
    async updateNotification(createNotification, user) {
        const { id, title, priority, courseId, description, startDate, endDate, } = createNotification;
        const [err, notification] = await (0, utils_1.to)(this.notificationRepository.findOne(+id));
        console.log(err);
        if (err)
            throw new common_1.InternalServerErrorException(err.message);
        if (notification) {
            notification.title = title;
            notification.priority = priority;
            notification.courseId = courseId === '0' ? null : +courseId;
            notification.description = description;
            notification.startDate = startDate;
            notification.endDate = endDate;
            notification.modifiedBy = user.id;
        }
        const [err1, res] = await (0, utils_1.to)(notification.save());
        console.log(err1);
        if (err1)
            throw new common_1.InternalServerErrorException(err1.message);
        return { message: 'Successfully updated the notification', data: res };
    }
    async deleteNotification(id, user) {
        const [err, result] = await (0, utils_1.to)(this.notificationRepository.delete(+id));
        console.log(err);
        if (err)
            throw new common_1.InternalServerErrorException(err.message);
        return { message: 'Successfully deleted the notification', data: result };
    }
};
NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(notification_repository_1.NotificationRepository)),
    __metadata("design:paramtypes", [courses_service_1.CoursesService,
        notification_repository_1.NotificationRepository])
], NotificationService);
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map