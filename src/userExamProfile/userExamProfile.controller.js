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
exports.UserExamProfileController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_decorator_1 = require("../roles.decorator");
const user_entity_1 = require("../users/user.entity");
const userExamprofile_service_1 = require("./userExamprofile.service");
let UserExamProfileController = class UserExamProfileController {
    constructor(userExamProfileService) {
        this.userExamProfileService = userExamProfileService;
    }
    async findAllUserExamActivityStat() {
        return await this.userExamProfileService.findAllUserExamActivityStat();
    }
    async findAllUserExamActivityStatByCourseId(id, req) {
        let userId = req.user.id;
        let courseId = id;
        if (id.includes('_')) {
            if (req.user.role > user_entity_1.RolePermitted.moderator) {
                userId = id.split('_')[0];
                courseId = id.split('_')[1];
            }
            else
                throw new common_1.UnauthorizedException();
        }
        return await this.userExamProfileService.findAllUserExamActivityStatByCourseId(userId, courseId);
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserExamProfileController.prototype, "findAllUserExamActivityStat", null);
__decorate([
    (0, common_1.Get)('/courses/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, roles_decorator_1.Role)(user_entity_1.RolePermitted.student),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserExamProfileController.prototype, "findAllUserExamActivityStatByCourseId", null);
UserExamProfileController = __decorate([
    (0, common_1.Controller)('userExamProfile'),
    __metadata("design:paramtypes", [userExamprofile_service_1.UserExamProfileService])
], UserExamProfileController);
exports.UserExamProfileController = UserExamProfileController;
//# sourceMappingURL=userExamProfile.controller.js.map