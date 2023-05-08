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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var CoursesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nest_winston_1 = require("nest-winston");
const user_entity_1 = require("../users/user.entity");
const user_repository_1 = require("../users/user.repository");
const utils_1 = require("../utils/utils");
const typeorm_2 = require("typeorm");
const moment = require("moment");
const course_entity_1 = require("./course.entity");
const course_repository_1 = require("./course.repository");
const exam_repository_1 = require("../exams/exam.repository");
const routine_repository_1 = require("../routine/routine.repository");
let CoursesService = CoursesService_1 = class CoursesService {
    constructor(logger, cacheManager, courseRepository, userRepository, examRepository, routineRepository) {
        this.logger = logger;
        this.cacheManager = cacheManager;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.examRepository = examRepository;
        this.routineRepository = routineRepository;
    }
    async createCourse(createCourseDto, imagePath, creator) {
        const { title, description, price, discountPricePercentage, pgCourseType, faculty, startDate, endDate } = createCourseDto;
        const course = new course_entity_1.Course();
        course.title = title;
        course.description = description;
        course.price = price ? +price : null;
        course.discountPricePercentage = discountPricePercentage ? +discountPricePercentage : null;
        course.pgCourseType = pgCourseType;
        course.faculty = faculty;
        course.imageUrl = imagePath;
        course.startDate = startDate;
        course.endDate = endDate;
        course.creatorId = +creator;
        const [err, result] = await (0, utils_1.to)(course.save());
        if (err) {
            {
                this.logger.error(err.message, { label: CoursesService_1.name });
                throw new common_1.InternalServerErrorException();
            }
        }
        await this.cacheManager.del('findAllCourses');
        await this.cacheManager.del('findLatestCourses');
        return { message: 'Created Course Successfully', data: result };
    }
    async findAllCourses(user = null) {
        if (user) {
            if (user.role === user_entity_1.RolePermitted.mentor || user.role === user_entity_1.RolePermitted.moderator) {
                const [error, userDetails] = await (0, utils_1.to)(this.userRepository.findOne({
                    where: { id: user.id },
                    relations: ['accessRight'],
                }));
                if (error) {
                    this.logger.error(error.message, { label: CoursesService_1.name });
                    throw new common_1.InternalServerErrorException(error.message);
                }
                if (userDetails.accessRight) {
                    const accessableCourseIds = userDetails.accessRight.accessableCourseIds;
                    const [err, courses] = await (0, utils_1.to)(this.courseRepository.find({
                        where: {
                            id: (0, typeorm_2.In)(accessableCourseIds),
                            endDate: (0, typeorm_2.MoreThanOrEqual)(new Date()),
                        },
                        order: { startDate: 'DESC' },
                    }));
                    if (err) {
                        this.logger.error(err.message, { label: CoursesService_1.name });
                        throw new common_1.InternalServerErrorException(err.message);
                    }
                    return courses;
                }
            }
            if (user.role >= user_entity_1.RolePermitted.coordinator) {
                const [err, courses] = await (0, utils_1.to)(this.courseRepository.find({
                    order: { startDate: 'DESC' },
                }));
                if (err) {
                    this.logger.error(err.message, { label: CoursesService_1.name });
                    throw new common_1.InternalServerErrorException(err.message);
                }
                return courses;
            }
            return null;
        }
        const [err, courses] = await (0, utils_1.to)(this.courseRepository.find({
            where: { endDate: (0, typeorm_2.MoreThanOrEqual)(new Date()) },
            order: { startDate: 'DESC' },
        }));
        if (err) {
            {
                this.logger.error(err.message, { label: CoursesService_1.name });
                throw new common_1.InternalServerErrorException();
            }
        }
        return courses;
    }
    async findAllCoursesByFilter(pgCourseType, faculty, search) {
        if (search) {
            if (pgCourseType && faculty) {
                const [err, courses] = await (0, utils_1.to)(this.courseRepository.find({
                    where: [{ title: (0, typeorm_2.Like)('%' + search + '%'), pgCourseType: (0, typeorm_2.Equal)(pgCourseType), faculty: (0, typeorm_2.Equal)(faculty), endDate: (0, typeorm_2.MoreThanOrEqual)(new Date()) },
                        { title: (0, typeorm_2.Like)('%' + search + '%'), pgCourseType: (0, typeorm_2.Equal)(course_entity_1.PgCourseType.All.toString()), faculty: (0, typeorm_2.Equal)(user_entity_1.Faculty.all.toString()), endDate: (0, typeorm_2.MoreThanOrEqual)(new Date()) },
                        { description: (0, typeorm_2.Like)('%' + search + '%'), pgCourseType: (0, typeorm_2.Equal)(pgCourseType), faculty: (0, typeorm_2.Equal)(faculty), endDate: (0, typeorm_2.MoreThanOrEqual)(new Date()) },
                        { description: (0, typeorm_2.Like)('%' + search + '%'), pgCourseType: (0, typeorm_2.Equal)(course_entity_1.PgCourseType.All.toString()), faculty: (0, typeorm_2.Equal)(user_entity_1.Faculty.all.toString()), endDate: (0, typeorm_2.MoreThanOrEqual)(new Date()) }],
                    order: { startDate: 'DESC' },
                }));
                if (err) {
                    {
                        this.logger.error(err.message, { label: CoursesService_1.name });
                        throw new common_1.InternalServerErrorException();
                    }
                }
                return courses;
            }
            if (pgCourseType) {
                const [err, courses] = await (0, utils_1.to)(this.courseRepository.find({
                    where: [{ title: (0, typeorm_2.Like)('%' + search + '%'), pgCourseType: (0, typeorm_2.Equal)(pgCourseType), endDate: (0, typeorm_2.MoreThanOrEqual)(new Date()) },
                        { title: (0, typeorm_2.Like)('%' + search + '%'), pgCourseType: (0, typeorm_2.Equal)(course_entity_1.PgCourseType.All.toString()), endDate: (0, typeorm_2.MoreThanOrEqual)(new Date()) },
                        { description: (0, typeorm_2.Like)('%' + search + '%'), pgCourseType: (0, typeorm_2.Equal)(pgCourseType), endDate: (0, typeorm_2.MoreThanOrEqual)(new Date()) },
                        { description: (0, typeorm_2.Like)('%' + search + '%'), pgCourseType: (0, typeorm_2.Equal)(course_entity_1.PgCourseType.All.toString()), endDate: (0, typeorm_2.MoreThanOrEqual)(new Date()) }],
                    order: { startDate: 'DESC' },
                }));
                if (err) {
                    {
                        this.logger.error(err.message, { label: CoursesService_1.name });
                        throw new common_1.InternalServerErrorException();
                    }
                }
                return courses;
            }
            if (faculty) {
                const [err, courses] = await (0, utils_1.to)(this.courseRepository.find({
                    where: [{ title: (0, typeorm_2.Like)('%' + search + '%'), faculty: (0, typeorm_2.Equal)(faculty), endDate: (0, typeorm_2.MoreThanOrEqual)(new Date()) },
                        { title: (0, typeorm_2.Like)('%' + search + '%'), faculty: (0, typeorm_2.Equal)(user_entity_1.Faculty.all.toString()), endDate: (0, typeorm_2.MoreThanOrEqual)(new Date()) },
                        { description: (0, typeorm_2.Like)('%' + search + '%'), faculty: (0, typeorm_2.Equal)(faculty), endDate: (0, typeorm_2.MoreThanOrEqual)(new Date()) },
                        { description: (0, typeorm_2.Like)('%' + search + '%'), faculty: (0, typeorm_2.Equal)(user_entity_1.Faculty.all.toString()), endDate: (0, typeorm_2.MoreThanOrEqual)(new Date()) }],
                    order: { startDate: 'DESC' },
                }));
                if (err) {
                    {
                        this.logger.error(err.message, { label: CoursesService_1.name });
                        throw new common_1.InternalServerErrorException();
                    }
                }
                return courses;
            }
            const [err, courses] = await (0, utils_1.to)(this.courseRepository.find({
                where: [{ title: (0, typeorm_2.Like)('%' + search + '%'), endDate: (0, typeorm_2.MoreThanOrEqual)(new Date()) }, { description: (0, typeorm_2.Like)('%' + search + '%'), endDate: (0, typeorm_2.MoreThanOrEqual)(new Date()) }],
                order: { startDate: 'DESC' },
            }));
            if (err) {
                this.logger.error(err.message, { label: CoursesService_1.name });
                throw new common_1.InternalServerErrorException();
            }
            return courses;
        }
        if (pgCourseType && faculty) {
            const [err, courses] = await (0, utils_1.to)(this.courseRepository.find({
                where: [{ pgCourseType: (0, typeorm_2.Equal)(pgCourseType), faculty: (0, typeorm_2.Equal)(faculty), endDate: (0, typeorm_2.MoreThanOrEqual)(new Date()) }, { pgCourseType: (0, typeorm_2.Equal)(course_entity_1.PgCourseType.All.toString()), faculty: (0, typeorm_2.Equal)(user_entity_1.Faculty.all.toString()), endDate: (0, typeorm_2.MoreThanOrEqual)(new Date()) }],
                order: { startDate: 'DESC' },
            }));
            if (err) {
                {
                    this.logger.error(err.message, { label: CoursesService_1.name });
                    throw new common_1.InternalServerErrorException();
                }
            }
            return courses;
        }
        if (pgCourseType) {
            const [err, courses] = await (0, utils_1.to)(this.courseRepository.find({
                where: [{ pgCourseType: (0, typeorm_2.Equal)(pgCourseType), endDate: (0, typeorm_2.MoreThanOrEqual)(new Date()) }, { pgCourseType: (0, typeorm_2.Equal)(course_entity_1.PgCourseType.All.toString()), endDate: (0, typeorm_2.MoreThanOrEqual)(new Date()) }],
                order: { startDate: 'DESC' },
            }));
            if (err) {
                {
                    this.logger.error(err.message, { label: CoursesService_1.name });
                    throw new common_1.InternalServerErrorException();
                }
            }
            return courses;
        }
        if (faculty) {
            const [err, courses] = await (0, utils_1.to)(this.courseRepository.find({
                where: [{ faculty: (0, typeorm_2.Equal)(faculty), endDate: (0, typeorm_2.MoreThanOrEqual)(new Date()) }, { faculty: (0, typeorm_2.Equal)(user_entity_1.Faculty.all.toString()), endDate: (0, typeorm_2.MoreThanOrEqual)(new Date()) }],
                order: { startDate: 'DESC' },
            }));
            if (err) {
                {
                    this.logger.error(err.message, { label: CoursesService_1.name });
                    throw new common_1.InternalServerErrorException();
                }
            }
            return courses;
        }
        const [err, courses] = await (0, utils_1.to)(this.courseRepository.find({
            where: { endDate: (0, typeorm_2.MoreThanOrEqual)(new Date()) },
            order: { startDate: 'DESC' },
        }));
        if (err) {
            {
                this.logger.error(err.message, { label: CoursesService_1.name });
                throw new common_1.InternalServerErrorException();
            }
        }
        return courses;
    }
    async findAllRawCourses() {
        const [err, courses] = await (0, utils_1.to)(this.courseRepository.find({
            order: { startDate: 'DESC' },
        }));
        if (err) {
            {
                this.logger.error(err.message, { label: CoursesService_1.name });
                throw new common_1.InternalServerErrorException();
            }
        }
        return courses;
    }
    async findAllCoursesEnrolledByStudent(stuId) {
        const [err, courses] = await (0, utils_1.to)(this.courseRepository.find({
            where: [
                {
                    enrolledStuIds: (0, typeorm_2.Like)(stuId),
                },
                {
                    enrolledStuIds: (0, typeorm_2.Like)('%,' + stuId + ',%'),
                },
                {
                    enrolledStuIds: (0, typeorm_2.Like)(stuId + ',%'),
                },
                {
                    enrolledStuIds: (0, typeorm_2.Like)('%,' + stuId),
                },
            ],
            order: { endDate: 'DESC', startDate: 'DESC' },
        }));
        if (err) {
            this.logger.error(err.message, { label: CoursesService_1.name });
            throw new common_1.InternalServerErrorException();
        }
        return courses;
    }
    async findLatestCourses() {
        const [err, courses] = await (0, utils_1.to)(this.courseRepository.find({
            where: { endDate: (0, typeorm_2.MoreThanOrEqual)(new Date()) },
            order: { startDate: 'DESC' },
            take: 5
        }));
        if (err) {
            {
                this.logger.error(err.message, { label: CoursesService_1.name });
                throw new common_1.InternalServerErrorException();
            }
        }
        return courses;
    }
    async findCourseById(id) {
        const [err, course] = await (0, utils_1.to)(this.courseRepository.findOne({ id: +id }));
        if (err) {
            this.logger.error(err.message, { label: CoursesService_1.name });
            throw new common_1.InternalServerErrorException();
        }
        return course;
    }
    async duplicateCourseById(courseDuplicated, courseId, imagePath, user) {
        const { title, description, price, discountPricePercentage, pgCourseType, faculty } = courseDuplicated;
        const dupStartDate = courseDuplicated.startDate;
        const dupEndDate = courseDuplicated.endDate;
        const [err, course] = await (0, utils_1.to)(this.courseRepository.findOne({ id: +courseId }));
        if (err) {
            this.logger.error(err.message, { label: CoursesService_1.name });
            throw new common_1.InternalServerErrorException(err.message);
        }
        const courseInitialStartDate = course.startDate;
        const duplicateCourse = new course_entity_1.Course();
        let duplicateExams = [];
        let duplicateRoutines = [];
        duplicateCourse.title = title;
        duplicateCourse.description = description;
        duplicateCourse.price = price ? +price : null;
        duplicateCourse.discountPricePercentage = discountPricePercentage ? +discountPricePercentage : null;
        duplicateCourse.pgCourseType = pgCourseType;
        duplicateCourse.faculty = faculty;
        duplicateCourse.startDate = dupStartDate;
        duplicateCourse.endDate = dupEndDate;
        duplicateCourse.createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
        duplicateCourse.creatorId = +user.id;
        if (imagePath) {
            duplicateCourse.imageUrl = imagePath;
        }
        else {
            const [err, duplicateImageUrl] = await (0, utils_1.to)((0, utils_1.duplicateImageFile)(course.imageUrl));
            if (err) {
                this.logger.error(err.message, { label: CoursesService_1.name });
                throw new common_1.InternalServerErrorException(err.message);
            }
            duplicateCourse.imageUrl = duplicateImageUrl;
        }
        const [err1, result] = await (0, utils_1.to)(duplicateCourse.save());
        if (err1) {
            this.logger.error(err1.message, { label: CoursesService_1.name });
            throw new common_1.InternalServerErrorException(err1.message);
        }
        const [err2, exams] = await (0, utils_1.to)(this.examRepository.find({
            where: [
                {
                    courseIds: (0, typeorm_2.Like)(courseId),
                },
                {
                    courseIds: (0, typeorm_2.Like)('%,' + courseId + ',%')
                },
                {
                    courseIds: (0, typeorm_2.Like)(courseId + ',%'),
                },
                {
                    courseIds: (0, typeorm_2.Like)('%,' + courseId),
                },
            ],
        }));
        if (err2) {
            this.logger.error(err2.message, { label: CoursesService_1.name });
            throw new common_1.InternalServerErrorException(err2.message);
        }
        exams.forEach(exam => {
            const { courseIds, courseType, startDate, endDate, createdAt, creatorId } = exam, rest = __rest(exam, ["courseIds", "courseType", "startDate", "endDate", "createdAt", "creatorId"]);
            const examUpdatedStartDate = moment(new Date(dupStartDate)).add(moment(new Date(exam.startDate)).diff(moment(new Date(courseInitialStartDate))), 'milliseconds').format('YYYY-MM-DD HH:mm:ss');
            const examUpdatedEndDate = moment(examUpdatedStartDate).add(moment(new Date(exam.endDate)).diff(moment(new Date(exam.startDate))), 'milliseconds').format('YYYY-MM-DD HH:mm:ss');
            duplicateExams.push(this.examRepository.create(Object.assign({ courseIds: result.id, courseType: [+courseId], startDate: examUpdatedStartDate, endDate: examUpdatedEndDate, createdAt: moment().format('YYYY-MM-DD HH:mm:ss'), creatorId: user.id }, rest)));
        });
        const [err3, examsResult] = await (0, utils_1.to)(this.examRepository.save(duplicateExams));
        if (err3) {
            this.logger.error(err3.message, { label: CoursesService_1.name });
            throw new common_1.InternalServerErrorException(err3.message);
        }
        const [err4, routines] = await (0, utils_1.to)(this.routineRepository.find({
            where: {
                courseId: +courseId,
            }
        }));
        if (err4) {
            this.logger.error(err4.message, { label: CoursesService_1.name });
            throw new common_1.InternalServerErrorException(err4.message);
        }
        routines.forEach(routine => {
            const routineUpdatedStartDate = moment(new Date(dupStartDate)).add(moment(new Date(routine.startDate)).diff(moment(new Date(courseInitialStartDate))), 'milliseconds').format('YYYY-MM-DD HH:mm:ss');
            const routineUpdatedEndDate = moment(new Date(routineUpdatedStartDate)).add(moment(new Date(routine.endDate)).diff(moment(new Date(routine.startDate))), 'milliseconds').format('YYYY-MM-DD HH:mm:ss');
            duplicateRoutines.push({ courseId: result.id, startDate: routineUpdatedStartDate, endDate: routineUpdatedEndDate, syllabus: routine.syllabus });
        });
        const [err5, routinesResult] = await (0, utils_1.to)(this.routineRepository.insert(duplicateRoutines));
        if (err5) {
            this.logger.error(err5.message, { label: CoursesService_1.name });
            throw new common_1.InternalServerErrorException(err5.message);
        }
        await this.cacheManager.del('findAllCourses');
        await this.cacheManager.del('findLatestCourses');
        return { message: 'Successfuly Duplicated the course', data: result };
    }
    async updateCourseById(courseUpdated, id, imagePath) {
        const { title, description, price, discountPricePercentage, pgCourseType, faculty, startDate, endDate } = courseUpdated;
        const [err, course] = await (0, utils_1.to)(this.courseRepository.findOne({ id: +id }));
        if (err) {
            this.logger.error(err.message, { label: CoursesService_1.name });
            throw new common_1.InternalServerErrorException(err.message);
        }
        course.title = title;
        course.description = description;
        course.price = price ? +price : null;
        course.discountPricePercentage = discountPricePercentage ? +discountPricePercentage : null;
        course.pgCourseType = pgCourseType;
        course.faculty = faculty;
        course.startDate = startDate;
        course.endDate = endDate;
        if (imagePath) {
            const [delImageErr, delImageRes] = await (0, utils_1.to)((0, utils_1.deleteImageFile)(course.imageUrl));
            if (delImageErr) {
                this.logger.error(delImageErr.message, { label: CoursesService_1.name });
            }
            course.imageUrl = imagePath;
        }
        const [err1, result] = await (0, utils_1.to)(course.save());
        if (err1) {
            this.logger.error(err1.message, { label: CoursesService_1.name });
            throw new common_1.InternalServerErrorException(err1.message);
        }
        await this.cacheManager.del('findAllCourses');
        await this.cacheManager.del('findLatestCourses');
        return { message: 'Successfuly Edited the course', data: result };
    }
    async deleteCourseById(id) {
        const [err, course] = await (0, utils_1.to)(this.courseRepository.findOne({ id: +id }));
        if (err) {
            this.logger.error(err.message, { label: CoursesService_1.name });
            throw new common_1.InternalServerErrorException(err.message);
        }
        const [examsErr, exams] = await (0, utils_1.to)(this.examRepository.find({
            where: [
                {
                    courseIds: (0, typeorm_2.Like)(id),
                }
            ],
        }));
        if (examsErr) {
            this.logger.error(examsErr.message, { label: CoursesService_1.name });
            throw new common_1.InternalServerErrorException(examsErr.message);
        }
        if (exams.length > 0) {
            const [examsDelErr, examDelResult] = await (0, utils_1.to)(this.examRepository.delete(exams.map(exam => exam.id)));
            if (examsDelErr) {
                this.logger.error(examsDelErr.message, { label: CoursesService_1.name });
                throw new common_1.InternalServerErrorException(examsDelErr.message);
            }
        }
        const [routineErr, routines] = await (0, utils_1.to)(this.routineRepository.delete({ courseId: +id }));
        if (routineErr) {
            this.logger.error(routineErr.message, { label: CoursesService_1.name });
            throw new common_1.InternalServerErrorException(routineErr.message);
        }
        const [delImageErr, delImageRes] = await (0, utils_1.to)((0, utils_1.deleteImageFile)(course.imageUrl));
        if (delImageErr) {
            this.logger.error(delImageErr, { label: CoursesService_1.name });
        }
        const [error, result] = await (0, utils_1.to)(this.courseRepository.delete({ id: +id }));
        if (error) {
            this.logger.error(error.message, { label: CoursesService_1.name });
            throw new common_1.InternalServerErrorException(error.message);
        }
        await this.cacheManager.del('findAllCourses');
        await this.cacheManager.del('findLatestCourses');
        return { message: 'Successfuly deleted the course', data: result };
    }
    async enrollmentRequestedByStudent(courseId, stuId) {
        const course = await this.findCourseById(courseId);
        if (course) {
            if (course.enrolledStuIds &&
                course.enrolledStuIds.includes(stuId.toString())) {
                return {
                    message: 'You have already enrolled. Please enjoy the exam.',
                };
            }
            if (course.expectedEnrolledStuIds &&
                course.expectedEnrolledStuIds.includes(stuId.toString())) {
                return {
                    message: 'You have already requested for enrollment. Please wait for the admin approval.',
                };
            }
            if (!course.price) {
                if (course.enrolledStuIds) {
                    course.enrolledStuIds.push(+stuId);
                }
                else {
                    course.enrolledStuIds = [+stuId];
                }
                const [err, result] = await (0, utils_1.to)(course.save());
                if (err) {
                    this.logger.error(err.message, { label: CoursesService_1.name });
                    throw new common_1.InternalServerErrorException();
                }
                return {
                    message: 'You have successfully enrolled. Please enjoy the exam.',
                    data: result
                };
            }
            else
                course.expectedEnrolledStuIds
                    ? course.expectedEnrolledStuIds.push(+stuId)
                    : (course.expectedEnrolledStuIds = [+stuId]);
        }
        const [err, result] = await (0, utils_1.to)(course.save());
        if (err) {
            this.logger.error(err.message, { label: CoursesService_1.name });
            throw new common_1.InternalServerErrorException();
        }
        return {
            message: 'Your enrollment order is placed. Please wait for the admin approval.',
            data: result
        };
    }
    async expectedEnrolledStuByCourseId(courseId) {
        const course = await this.findCourseById(courseId);
        if (course) {
            const expectedEnrolledStuIds = course.expectedEnrolledStuIds;
            const [err, stuInfos] = await (0, utils_1.to)(this.userRepository.find({
                select: [
                    'id',
                    'firstName',
                    'lastName',
                    'email',
                    'institution',
                    'faculty',
                ],
                where: { id: (0, typeorm_2.In)(expectedEnrolledStuIds) },
            }));
            if (err) {
                this.logger.error(err.message, { label: CoursesService_1.name });
                throw new common_1.InternalServerErrorException();
            }
            return stuInfos;
        }
    }
    async expectedEnrolledStuInfo(user) {
        let accessableCourseIds = null;
        let courses = null;
        let err = null;
        if (user.role === user_entity_1.RolePermitted.moderator) {
            const [error, userDetails] = await (0, utils_1.to)(this.userRepository.findOne({
                where: { id: user.id },
                relations: ['accessRight'],
            }));
            if (error) {
                this.logger.error(error.message, { label: CoursesService_1.name });
                throw new common_1.InternalServerErrorException(error.message);
            }
            if (userDetails.accessRight) {
                accessableCourseIds = userDetails.accessRight.accessableCourseIds;
                [err, courses] = await (0, utils_1.to)(this.courseRepository.find({
                    select: [
                        'id',
                        'title',
                        'startDate',
                        'endDate',
                        'expectedEnrolledStuIds',
                    ],
                    where: { id: (0, typeorm_2.In)(accessableCourseIds), endDate: (0, typeorm_2.MoreThanOrEqual)(new Date()) },
                    order: { startDate: 'DESC' },
                }));
                if (err) {
                    this.logger.error(err.message, { label: CoursesService_1.name });
                    throw new common_1.InternalServerErrorException();
                }
            }
            else {
                return [];
            }
        }
        else {
            [err, courses] = await (0, utils_1.to)(this.courseRepository.find({
                select: [
                    'id',
                    'title',
                    'startDate',
                    'endDate',
                    'expectedEnrolledStuIds',
                ],
                where: { endDate: (0, typeorm_2.MoreThanOrEqual)(new Date()) },
                order: { startDate: 'DESC' },
            }));
            if (err) {
                this.logger.error(err.message, { label: CoursesService_1.name });
                throw new common_1.InternalServerErrorException();
            }
        }
        if (courses) {
            const coursesWithStuInfos = [];
            for (const course of courses) {
                const expectedEnrolledStuIds = course.expectedEnrolledStuIds
                    ? course.expectedEnrolledStuIds
                    : [];
                const [err, stuInfos] = await (0, utils_1.to)(this.userRepository.find({
                    select: [
                        'id',
                        'firstName',
                        'lastName',
                        'email',
                        'institution',
                        'faculty',
                    ],
                    where: { id: (0, typeorm_2.In)(expectedEnrolledStuIds) },
                }));
                if (err) {
                    this.logger.error(err.message, { label: CoursesService_1.name });
                    throw new common_1.InternalServerErrorException();
                }
                coursesWithStuInfos.push({
                    id: course.id,
                    title: course.title,
                    startDate: course.startDate,
                    endDate: course.endDate,
                    stuInfos,
                });
            }
            return coursesWithStuInfos;
        }
    }
    async approveOrDenyEnrollment(courseId, stuIds, deny = false) {
        const [err, course] = await (0, utils_1.to)(this.findCourseById(courseId));
        if (err) {
            this.logger.error(err.message, { label: CoursesService_1.name });
            throw new common_1.InternalServerErrorException();
        }
        stuIds.forEach((element) => {
            if (!deny) {
                course.enrolledStuIds
                    ? course.enrolledStuIds.push(element)
                    : (course.enrolledStuIds = [element]);
            }
            const index = course.expectedEnrolledStuIds.indexOf(element.toString());
            if (index > -1) {
                course.expectedEnrolledStuIds.splice(index, 1);
            }
        });
        const [err1, result] = await (0, utils_1.to)(course.save());
        if (err1) {
            this.logger.error(err1.message, { label: CoursesService_1.name });
            throw new common_1.InternalServerErrorException();
        }
        return {
            message: deny ? 'Enrollment denied' : 'Enrollment successful',
            data: result
        };
    }
    async findAllEnrolledStudentNumberByCourseId(courseId) {
        const [err, course] = await (0, utils_1.to)(this.findCourseById(courseId));
        if (err) {
            this.logger.error(err.message, { label: CoursesService_1.name });
            throw new common_1.InternalServerErrorException('All Enrolled Student Number Can Not Be Counted');
        }
        return course.enrolledStuIds.length;
    }
    async findAllEnrolledStudentByCourseId(courseId) {
        const [err, course] = await (0, utils_1.to)(this.findCourseById(courseId));
        if (err) {
            this.logger.error(err.message, { label: CoursesService_1.name });
            throw new common_1.InternalServerErrorException('All Enrolled Student Number Can Not Be Counted');
        }
        return course.enrolledStuIds;
    }
};
CoursesService = CoursesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __param(1, (0, common_1.Inject)(common_1.CACHE_MANAGER)),
    __param(2, (0, typeorm_1.InjectRepository)(course_repository_1.CourseRepository)),
    __param(3, (0, typeorm_1.InjectRepository)(user_repository_1.UserRepository)),
    __param(4, (0, typeorm_1.InjectRepository)(exam_repository_1.ExamRepository)),
    __param(5, (0, typeorm_1.InjectRepository)(routine_repository_1.RoutineRepository)),
    __metadata("design:paramtypes", [Object, Object, course_repository_1.CourseRepository,
        user_repository_1.UserRepository,
        exam_repository_1.ExamRepository,
        routine_repository_1.RoutineRepository])
], CoursesService);
exports.CoursesService = CoursesService;
//# sourceMappingURL=courses.service.js.map