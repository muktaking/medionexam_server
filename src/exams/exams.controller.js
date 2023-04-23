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
exports.ExamsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_decorator_1 = require("../roles.decorator");
const roles_guard_1 = require("../roles.guard");
const user_entity_1 = require("../users/user.entity");
const exam_dto_1 = require("./dto/exam.dto");
const flag_dto_1 = require("./dto/flag.dto");
const exams_service_1 = require("./exams.service");
let ExamsController = class ExamsController {
    constructor(examService) {
        this.examService = examService;
    }
    async createExam(createExamDto, req) {
        return await this.examService.createExam(createExamDto, req.user);
    }
    async findAllExams() {
        return await this.examService.findAllExams();
    }
    async findAllPlainExamsByCourseId(filter, id) {
        return await this.examService.findAllPlainExamsByCourseIds(id.id, filter);
    }
    async findAllRawExams() {
        return await this.examService.findAllRawExams();
    }
    async findLatestExam(courseId) {
        return await this.examService.findCurrentExam(courseId);
    }
    async findFeaturedExam() {
        return await this.examService.getFeaturedExams();
    }
    async findExamById(id) {
        return await this.examService.findExamById(id, null, null, null, true);
    }
    async findExamByCatId(id) {
        return await this.examService.findExamByCatId(id);
    }
    async findQuestionsByExamId(id, req) {
        return await this.examService.findQuestionsByExamId(id, req.user);
    }
    async findExamByIdForReports(query, req) {
        return await this.examService.findExamById(query.examId, query.courseId, null, req.user.id, true);
    }
    async findQuestionsByExamIdForReports(id, answers, req) {
        return await this.examService.findQuestionsByExamIdForReports(id, req.user, answers === '1' ? true : false);
    }
    async findFreeQuestionsByExamId(id) {
        return await this.examService.findFreeQuestionsByExamId(id);
    }
    async getFeedbackByExamId(examId) {
        return await this.examService.getFeedbackByExamId(examId.id);
    }
    async createFeedback(createFeedbackDto) {
        return await this.examService.createFeedback(createFeedbackDto);
    }
    async ChangePendingStatus(status) {
        return await this.examService.changePendingStatus(status.ids, Boolean(status.deny));
    }
    async updateExamById(examId, createExamDto) {
        return await this.examService.updateExamById(examId.id, createExamDto);
    }
    async deleteQuestionById(examId) {
        return await this.examService.deleteExam(examId.id);
    }
    async deleteQuestion(examIds) {
        return await this.examService.deleteExam(...examIds.ids);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Role)(user_entity_1.RolePermitted.moderator),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [exam_dto_1.CreateExamDto, Object]),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "createExam", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "findAllExams", null);
__decorate([
    (0, common_1.Post)('/course/:id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "findAllPlainExamsByCourseId", null);
__decorate([
    (0, common_1.Get)('/raw'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "findAllRawExams", null);
__decorate([
    (0, common_1.Get)('/current'),
    __param(0, (0, common_1.Query)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "findLatestExam", null);
__decorate([
    (0, common_1.Get)('/featured'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "findFeaturedExam", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Role)(user_entity_1.RolePermitted.student),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "findExamById", null);
__decorate([
    (0, common_1.Get)('/category/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "findExamByCatId", null);
__decorate([
    (0, common_1.Get)('questions/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, roles_decorator_1.Role)(user_entity_1.RolePermitted.student),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "findQuestionsByExamId", null);
__decorate([
    (0, common_1.Get)('reports/filterby'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Role)(user_entity_1.RolePermitted.student),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "findExamByIdForReports", null);
__decorate([
    (0, common_1.Get)('reports/questions/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, roles_decorator_1.Role)(user_entity_1.RolePermitted.student),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('answers')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "findQuestionsByExamIdForReports", null);
__decorate([
    (0, common_1.Get)('free/questions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "findFreeQuestionsByExamId", null);
__decorate([
    (0, common_1.Get)('feedback/:id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "getFeedbackByExamId", null);
__decorate([
    (0, common_1.Post)('feedback'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [flag_dto_1.CreateFeedbackDto]),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "createFeedback", null);
__decorate([
    (0, common_1.Patch)('feedback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Role)(user_entity_1.RolePermitted.moderator),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "ChangePendingStatus", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, exam_dto_1.CreateExamDto]),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "updateExamById", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Role)(user_entity_1.RolePermitted.coordinator),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "deleteQuestionById", null);
__decorate([
    (0, common_1.Delete)(),
    (0, roles_decorator_1.Role)(user_entity_1.RolePermitted.coordinator),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "deleteQuestion", null);
ExamsController = __decorate([
    (0, common_1.Controller)('exams'),
    __metadata("design:paramtypes", [exams_service_1.ExamsService])
], ExamsController);
exports.ExamsController = ExamsController;
//# sourceMappingURL=exams.controller.js.map