import { InternalServerErrorException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { User } from 'src/users/user.entity';
import { UserRepository } from 'src/users/user.repository';
import { Logger } from 'winston';
import { CourseRepository } from './course.repository';
import { CreateCourseDto } from './dto/course.dto';
import { ExamRepository } from 'src/exams/exam.repository';
import { RoutineRepository } from 'src/routine/routine.repository';
export declare class CoursesService {
    private readonly logger;
    private cacheManager;
    private courseRepository;
    private userRepository;
    private examRepository;
    private routineRepository;
    constructor(logger: Logger, cacheManager: Cache, courseRepository: CourseRepository, userRepository: UserRepository, examRepository: ExamRepository, routineRepository: RoutineRepository);
    createCourse(createCourseDto: any, imagePath: any, creator: string): Promise<{
        message: string;
        data: any;
    }>;
    findAllCourses(user?: User): Promise<any>;
    findAllCoursesByFilter(pgCourseType: any, faculty: any, search: any): Promise<any>;
    findAllRawCourses(): Promise<any>;
    findAllCoursesEnrolledByStudent(stuId: any): Promise<any>;
    findLatestCourses(): Promise<any>;
    findCourseById(id: string): Promise<any>;
    duplicateCourseById(courseDuplicated: CreateCourseDto, courseId: string, imagePath: any, user: any): Promise<{
        message: string;
        data: any;
    }>;
    updateCourseById(courseUpdated: CreateCourseDto, id: string, imagePath: any): Promise<{
        message: string;
        data: any;
    }>;
    deleteCourseById(id: string): Promise<{
        message: string;
        data: any;
    }>;
    enrollmentRequestedByStudent(courseId: string, stuId: string): Promise<{
        message: string;
        data?: undefined;
    } | {
        message: string;
        data: any;
    }>;
    expectedEnrolledStuByCourseId(courseId: string): Promise<any>;
    expectedEnrolledStuInfo(user: User): Promise<any[]>;
    approveOrDenyEnrollment(courseId: string, stuIds: [string], deny?: boolean): Promise<{
        message: string;
        data: any;
    }>;
    findAllEnrolledStudentNumberByCourseId(courseId: any): Promise<number | InternalServerErrorException>;
    findAllEnrolledStudentByCourseId(courseId: any): Promise<any>;
}
