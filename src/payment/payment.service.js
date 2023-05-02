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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const payment_repository_1 = require("./payment.repository");
const payment_entity_1 = require("./payment.entity");
const utils_1 = require("../utils/utils");
let PaymentService = class PaymentService {
    constructor(paymentRepository) {
        this.paymentRepository = paymentRepository;
    }
    async createPaymentByManualMethodRecords(createPaymentDto, user) {
        const { productId, productType, senderMobile, txId, paymentAmount, paymentGateway, ref } = createPaymentDto;
        const paymentRecord = new payment_entity_1.Payment;
        paymentRecord.productId = +productId;
        paymentRecord.productType = productType;
        paymentRecord.senderMobile = senderMobile;
        paymentRecord.txId = txId;
        paymentRecord.paymentAmount = +paymentAmount;
        paymentRecord.paymentGateway = paymentGateway;
        paymentRecord.ref = ref;
        paymentRecord.userId = user.id;
        const [previousPaymentRecordsError, previousPaymentRecords] = await (0, utils_1.to)(this.getPaymentRecordsByProductIdAndUserId(productId, user.id));
        if (previousPaymentRecordsError)
            throw new common_1.InternalServerErrorException(previousPaymentRecordsError.message);
        if (previousPaymentRecords.length > 0)
            throw new common_1.HttpException('Product payment by user is under verification. Please wait.', common_1.HttpStatus.CONFLICT);
        const [error, paymentRes] = await (0, utils_1.to)(paymentRecord.save());
        if (error)
            throw new common_1.InternalServerErrorException(error.message);
        return { data: paymentRes, message: 'Payment record successfully saved. Admin will verify it.' };
    }
    async getPaymentByManualMethodRecords(userId = null) {
        let error, paymentRecords;
        if (userId) {
            [error, paymentRecords] = await (0, utils_1.to)(this.paymentRepository.findOne({ userId: +userId }));
        }
        else {
            [error, paymentRecords] = await (0, utils_1.to)(this.paymentRepository.find({ order: { transactionAt: 'ASC' } }));
        }
        if (error)
            throw new common_1.InternalServerErrorException(error.message);
        return paymentRecords;
    }
    async getPaymentRecordsByProductIdAndUserId(productId, userId) {
        const [error, paymentRecords] = await (0, utils_1.to)(this.paymentRepository.find({ where: { userId: +userId, productId: +productId }, order: { transactionAt: 'ASC' } }));
        if (error)
            throw new common_1.InternalServerErrorException(error.message);
        return paymentRecords;
    }
};
PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_repository_1.PaymentRepository)),
    __metadata("design:paramtypes", [payment_repository_1.PaymentRepository])
], PaymentService);
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map