import { CreateExamDto } from './dto/exam.dto';
import { CreateFeedbackDto } from './dto/flag.dto';
import { ExamsService } from './exams.service';
export declare class ExamsController {
    private readonly examService;
    constructor(examService: ExamsService);
    createExam(createExamDto: CreateExamDto, req: any): Promise<any>;
    findAllExams(): Promise<any>;
    findAllPlainExamsByCourseId(filter: any, id: any): Promise<any>;
    findAllRawExams(): Promise<any>;
    findLatestExam(courseId: any): Promise<any>;
    findFeaturedExam(): Promise<any>;
    findExamById(id: any): Promise<any>;
    findExamByCatId(id: any): Promise<any>;
    findQuestionsByExamId(id: any, req: any): Promise<{
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
    findExamByIdForReports(query: any, req: any): Promise<any>;
    findQuestionsByExamIdForReports(id: any, answers: any, req: any): Promise<{
        exam: {
            id: any;
            singleQuestionMark: any;
            singleStemMark: any;
            penaltyMark: any;
            timeLimit: any;
        };
        questions: any;
    }>;
    findFreeQuestionsByExamId(id: any): Promise<{
        exam: {
            id: any;
            singleQuestionMark: any;
            singleStemMark: any;
            penaltyMark: any;
            timeLimit: any;
        };
        questions: any;
    }>;
    getFeedbackByExamId(examId: any): Promise<any>;
    createFeedback(createFeedbackDto: CreateFeedbackDto): Promise<{
        message: string;
    }>;
    ChangePendingStatus(status: any): Promise<{
        message: string;
    }>;
    updateExamById(examId: any, createExamDto: CreateExamDto): Promise<any>;
    deleteQuestionById(examId: any): Promise<import("typeorm").DeleteResult>;
    deleteQuestion(examIds: any): Promise<import("typeorm").DeleteResult>;
}
