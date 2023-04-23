import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/course.dto';
export declare class CoursesController {
    private readonly courseService;
    constructor(courseService: CoursesService);
    createCourse(createCourseDto: CreateCourseDto, req: any, image: any): Promise<{
        message: string;
        data: any;
    }>;
    duplicateCourse(createCourseDto: CreateCourseDto, image: any, id: any, req: any): Promise<{
        message: string;
        data: any;
    }>;
    getAllCourses(filter: any): Promise<any>;
    getLatestCourses(): Promise<any>;
    getAllCoursesByFilter(filter: any): Promise<any>;
    getAllCoursesWithAuth(req: any): Promise<any>;
    getAllRawCourses(): Promise<any>;
    getAllCoursesEnrolledByStudent(req: any): Promise<any>;
    getAllCoursesEnrolledByStudentByAdmin(userId: any): Promise<any>;
    approveEnrollment(course: any): Promise<{
        message: string;
        data: any;
    }>;
    getCourseById(id: any): Promise<any>;
    updateCourseById(createCourseDto: CreateCourseDto, image: any, id: any): Promise<{
        message: string;
        data: any;
    }>;
    deleteCourseById(id: any): Promise<{
        message: string;
        data: any;
    }>;
    enrollmentRequestedByStudent(courseId: any, req: any): Promise<{
        message: string;
        data?: undefined;
    } | {
        message: string;
        data: any;
    }>;
}
