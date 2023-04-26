import { InternalServerErrorException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CategoryRepository } from 'src/categories/category.repository';
import { CoursesService } from 'src/courses/courses.service';
import { QuestionRepository } from 'src/questions/question.repository';
import { UserExamCourseProfileRepository } from 'src/userExamProfile/userExamCourseProfile.repository';
import { UserExamProfile } from 'src/userExamProfile/userExamProfile.entity';
import { UserExamProfileRepository } from 'src/userExamProfile/userExamProfile.repository';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { ExamRepository } from './exam.repository';
import { FeedbackRepository } from './feedback.repository';
export declare class ExamsService {
    private readonly usersService;
    private readonly coursesService;
    private cacheManager;
    private questionRepository;
    private courseRepository;
    private categoryRepository;
    private examRepository;
    private feedbackRepository;
    private userExamCourseProfileRepository;
    private userExamProfileRepository;
    constructor(usersService: UsersService, coursesService: CoursesService, cacheManager: Cache, questionRepository: QuestionRepository, courseRepository: CategoryRepository, categoryRepository: CategoryRepository, examRepository: ExamRepository, feedbackRepository: FeedbackRepository, userExamCourseProfileRepository: UserExamCourseProfileRepository, userExamProfileRepository: UserExamProfileRepository);
    findUserExamInfo(id: any, courseId: any): Promise<{
        totalExam: any[];
        rank: (number | InternalServerErrorException)[];
        upcomingExam: any[];
        result: any[];
    }>;
    findUserExamStat(id: any, courseId: any): Promise<{
        examTitles: any[];
        stat: any[];
    }>;
    findTotalExamTakenByCourseId(id: any, courseId: any): Promise<any>;
    findExamTotalNumber(): Promise<any>;
    findExamTotalNumberByCourseId(courseId: any): Promise<any>;
    findAllExams(): Promise<any>;
    findAllExamsByCourseIds(courseId: any, stuIds: string): Promise<any>;
    findAllPlainExamsByCourseIds(courseId: any, filter?: any): Promise<any>;
    findAllPlainExamsByCourseIdsWithAuth(courseId: any, stuIds: string, filter?: any): Promise<any>;
    findAllOldExams(): Promise<any>;
    findAllRawExams(): Promise<any>;
    findLatestExam(): Promise<any>;
    findLatestExamByCourseId(courseId: any): Promise<any>;
    findCurrentExam(courseId: any): Promise<any>;
    getFeaturedExams(courseId?: any): Promise<any>;
    findExamById(examId: string, courseId?: any, constraintByCategoryType?: any, stuId?: any, bypass?: boolean): Promise<any>;
    findExamByCatId(id: string): Promise<any>;
    findOldExamByCatId(id: string): Promise<any>;
    findQuestionsByExamId(id: string, user: any): Promise<{
        exam: {
            id: any;
            singleQuestionMark: any;
            singleStemMark: any;
            penaltyMark: any;
            timeLimit: any;
            type: any;
            isAnswerRestricted: boolean;
        };
        questions: any;
    }>;
    findQuestionsByExamIdForReports(id: string, user: any, answers: any): Promise<{
        exam: {
            id: any;
            singleQuestionMark: any;
            singleStemMark: any;
            penaltyMark: any;
            timeLimit: any;
        };
        questions: any;
    }>;
    findFreeQuestionsByExamId(id: string): Promise<{
        exam: {
            id: any;
            singleQuestionMark: any;
            singleStemMark: any;
            penaltyMark: any;
            timeLimit: any;
        };
        questions: any;
    }>;
    findAllProfile(): Promise<UserExamProfile[]>;
    getUserAvgResultByCourseId(id: any, courseId: any): Promise<any[]>;
    getUserRank(id: any, courseId: any): Promise<number>;
    createExam(createExamDto: any, creator: User): Promise<any>;
    updateExamById(id: string, createExamDto: any): Promise<any>;
    deleteExam(...args: any[]): Promise<import("typeorm").DeleteResult>;
    createFeedback(createFeedbackDto: any): Promise<{
        message: string;
    }>;
    getFeedbackByExamId(examId: any): Promise<any>;
    getPendingFeedback(): Promise<any>;
    changePendingStatus(ids: any, deny?: boolean): Promise<{
        message: string;
    }>;
}
