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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const payment_dto_1 = require("./dto/payment.dto");
const roles_decorator_1 = require("../roles.decorator");
const user_entity_1 = require("../users/user.entity");
const roles_guard_1 = require("../roles.guard");
const payment_service_1 = require("./payment.service");
let PaymentController = class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async getPaymentByManualMethodRecords(query) {
        if (!query) {
            return await this.paymentService.getPaymentByManualMethodRecords(query);
        }
        else {
            if (query.productId && query.userId) {
                return await this.paymentService.getPaymentRecordsByProductIdAndUserId(query.productId, query.userId);
            }
            return await this.paymentService.getPaymentByManualMethodRecords(query.userId);
        }
    }
    async makePaymentByBkash() {
        return await this.paymentService.bkashPgwGrantTokenRequest();
    }
    async createPaymentByBkash(createPaymentDto, req) {
        return await this.paymentService.bkashCreatePayment(createPaymentDto, req.user);
    }
    async executePaymentByBkash(param) {
        return await this.paymentService.bkashExecutePayment(param.paymentId);
    }
    async queryPaymentByBkash(param) {
        return await this.paymentService.bkashQueryPayment(param.paymentId);
    }
    async FailedPaymentByBkash(param) {
        return await this.paymentService.bkashPaymentFailure(param.paymentId, param.status);
    }
    async PaymentRefundTransactionByBkash(param) {
        return await this.paymentService.bkashPaymentRefundTransaction(param);
    }
    async PaymentRefundGetOne(param) {
        return await this.paymentService.bkashPaymentRefundFindOne(param.paymentId);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Role)(user_entity_1.RolePermitted.coordinator),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getPaymentByManualMethodRecords", null);
__decorate([
    (0, common_1.Post)('/bkash/token/grant'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Role)(user_entity_1.RolePermitted.student),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "makePaymentByBkash", null);
__decorate([
    (0, common_1.Post)('/bkash/create'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Role)(user_entity_1.RolePermitted.student),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_dto_1.CreatePaymentDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createPaymentByBkash", null);
__decorate([
    (0, common_1.Post)('/bkash/execute/:paymentId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Role)(user_entity_1.RolePermitted.student),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "executePaymentByBkash", null);
__decorate([
    (0, common_1.Post)('/bkash/status/:paymentId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Role)(user_entity_1.RolePermitted.coordinator),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "queryPaymentByBkash", null);
__decorate([
    (0, common_1.Post)('/bkash/failure/:paymentId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Role)(user_entity_1.RolePermitted.student),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "FailedPaymentByBkash", null);
__decorate([
    (0, common_1.Post)('/bkash/refund/:paymentId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Role)(user_entity_1.RolePermitted.coordinator),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "PaymentRefundTransactionByBkash", null);
__decorate([
    (0, common_1.Get)('/bkash/refund/:paymentId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Role)(user_entity_1.RolePermitted.coordinator),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "PaymentRefundGetOne", null);
PaymentController = __decorate([
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
exports.PaymentController = PaymentController;
//# sourceMappingURL=payment.controller.js.map