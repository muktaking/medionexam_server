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
var PaymentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const moment = require("moment");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const axios_1 = require("@nestjs/axios");
const config = require("config");
const uuid_1 = require("uuid");
const payment_repository_1 = require("./payment.repository");
const payment_entity_1 = require("./payment.entity");
const utils_1 = require("../utils/utils");
const rxjs_1 = require("rxjs");
const nest_winston_1 = require("nest-winston");
const course_repository_1 = require("../courses/course.repository");
const paymentRefund_repository_1 = require("./paymentRefund.repository");
const paymentRefund_entity_1 = require("./paymentRefund.entity");
const bkashConfig = config.get('bkash');
let PaymentService = PaymentService_1 = class PaymentService {
    constructor(logger, paymentRepository, paymentRefundRepository, courseRepository, httpService) {
        this.logger = logger;
        this.paymentRepository = paymentRepository;
        this.paymentRefundRepository = paymentRefundRepository;
        this.courseRepository = courseRepository;
        this.httpService = httpService;
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
    async bkashPgwGrantTokenRequest() {
        const headers = {
            "username": bkashConfig.username,
            "password": bkashConfig.password
        };
        const bodyData = {
            app_key: bkashConfig.app_key,
            app_secret: bkashConfig.app_secret
        };
        const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.post('token/grant', bodyData, { headers }).pipe((0, rxjs_1.catchError)((error) => {
            console.log(error);
            this.logger.error(error.message, { label: PaymentService_1.name });
            throw new common_1.InternalServerErrorException('Grant Token could not be retrieved from Bkash.');
        })));
        return data;
    }
    async bkashCreatePayment(createPaymentDto, user) {
        const { productType, productId, ref, paymentGateway } = createPaymentDto;
        const [error, course] = await (0, utils_1.to)(this.courseRepository.findOne(productId));
        if (error) {
            this.logger.error(error.message, { label: PaymentService_1.name });
            throw new common_1.InternalServerErrorException(error.message);
        }
        const netPrice = course.discountPricePercentage ? course.price - Math.ceil((course.price * course.discountPricePercentage) / 100)
            : course.price;
        const paymentObj = new payment_entity_1.Payment();
        paymentObj.userId = user.id;
        paymentObj.productType = productType;
        paymentObj.productId = +productId;
        paymentObj.invoiceId = (0, uuid_1.v4)();
        paymentObj.paymentAmount = netPrice;
        paymentObj.ref = ref;
        paymentObj.paymentGateway = paymentGateway;
        let errorGT, token;
        [errorGT, token] = await (0, utils_1.to)(this.bkashPgwGrantTokenRequest());
        if (errorGT) {
            this.logger.error(errorGT.message, { label: PaymentService_1.name });
            throw new common_1.InternalServerErrorException(errorGT.message);
        }
        const headers = {
            Authorization: token.id_token,
            'X-App-Key': bkashConfig.app_key
        };
        const createPayment = new payment_entity_1.BkashCreatePayment({ payerReference: ref, amount: netPrice.toString(), merchantInvoiceNumber: paymentObj.invoiceId });
        const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.post('create', createPayment, { headers }).pipe((0, rxjs_1.catchError)((error) => {
            this.logger.error(error.message, { label: PaymentService_1.name });
            throw new common_1.HttpException('Payment Creation Failure: ' + error.message, common_1.HttpStatus.BAD_REQUEST);
        })));
        paymentObj.id = data.paymentID;
        paymentObj.status = payment_entity_1.PaymentStatus.Initiated;
        paymentObj.paymentCreateTime = moment(data.paymentCreateTime, "YYYY-MM-DDTHH:mm:ss GMTZ").format('YYYY-MM-DD HH:mm:ss');
        const [errorPayment, res] = await (0, utils_1.to)(paymentObj.save());
        if (errorPayment) {
            this.logger.error(errorPayment.message, { label: PaymentService_1.name });
            throw new common_1.InternalServerErrorException(errorPayment.message);
        }
        return { bkashURL: data.bkashURL };
    }
    async bkashQueryPayment(paymentId, oldTokenId) {
        let tokenId;
        if (!oldTokenId) {
            let errorGT, token;
            [errorGT, token] = await (0, utils_1.to)(this.bkashPgwGrantTokenRequest());
            if (errorGT) {
                this.logger.error(errorGT.message, { label: PaymentService_1.name });
                throw new common_1.InternalServerErrorException(errorGT.message);
            }
            tokenId = token.id_token;
        }
        else {
            tokenId = oldTokenId;
        }
        const headers = {
            Authorization: tokenId,
            'X-App-Key': bkashConfig.app_key
        };
        const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`payment/status`, { paymentID: paymentId }, { headers }).pipe((0, rxjs_1.catchError)((error) => {
            this.logger.error(error.message, { label: PaymentService_1.name });
            throw new common_1.HttpException('Payment Query Failure: ' + error.message, common_1.HttpStatus.BAD_REQUEST);
        })));
        return data;
    }
    async bkashExecutePayment(paymentId) {
        let errorGT, token;
        [errorGT, token] = await (0, utils_1.to)(this.bkashPgwGrantTokenRequest());
        if (errorGT) {
            this.logger.error(errorGT.message, { label: PaymentService_1.name });
            throw new common_1.InternalServerErrorException(errorGT.message);
        }
        const headers = {
            Authorization: token.id_token,
            'X-App-Key': bkashConfig.app_key,
        };
        const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`execute`, { paymentID: paymentId }, { timeout: 30000, headers }).pipe((0, rxjs_1.catchError)((error) => {
            this.logger.error(error.message, { label: PaymentService_1.name });
            throw new common_1.HttpException('Payment Execution Failure: ' + error.message, common_1.HttpStatus.BAD_REQUEST);
        })));
        const [error, payment] = await (0, utils_1.to)(this.paymentRepository.findOne(data.paymentID));
        if (error || (Object.keys(payment).length === 0)) {
            this.logger.error(error.message, { label: PaymentService_1.name });
            throw new common_1.InternalServerErrorException('Payment data can not be retrieved from database.');
        }
        const [errorCourse, course] = await (0, utils_1.to)(this.courseRepository.findOne(payment.productId));
        if (errorCourse) {
            this.logger.error(error.message, { label: PaymentService_1.name });
            throw new common_1.InternalServerErrorException('Course Enrollment Failue: course could not be retrieved from database. Please contact with admin.');
        }
        if (data.statusCode === "0000") {
            if (course) {
                if (course.enrolledStuIds) {
                    if (!course.enrolledStuIds.includes(payment.userId.toString())) {
                        course.enrolledStuIds.push(+payment.userId);
                    }
                }
                else {
                    course.enrolledStuIds = [+payment.userId];
                }
                const [err, result] = await (0, utils_1.to)(course.save());
                if (err) {
                    this.logger.error(err.message, { label: PaymentService_1.name });
                    throw new common_1.InternalServerErrorException('Course Enrollment Failue: Auto enrollment could not be possible. Please contact with admin.');
                }
            }
            payment.status = payment_entity_1.PaymentStatus.Successful;
            payment.paymentExecuteTime = moment(data.paymentExecuteTime, "YYYY-MM-DDTHH:mm:ss GMTZ").format('YYYY-MM-DD HH:mm:ss');
            payment.customerMsisdn = data.customerMsisdn;
            payment.trxId = data.trxID;
            try {
                await payment.save();
            }
            catch (error) {
                this.logger.error(error.message, { label: PaymentService_1.name });
                throw new common_1.InternalServerErrorException('Payment data can not be saved to database.');
            }
            return {
                statusCode: "0",
                statusMessage: "Successful. You are auto enrolled to the course.",
                amount: data.ammount,
                currency: data.currency,
                merchantInvoice: payment.invoiceId,
                productType: payment.productType,
                productId: payment.productId
            };
        }
        else {
            const [errorQuery, paymentQuery] = await (0, utils_1.to)(this.bkashQueryPayment(paymentId, token.id_token));
            if (errorQuery) {
                throw new common_1.InternalServerErrorException(errorQuery.message);
            }
            if (course) {
                if (course.enrolledStuIds) {
                    if (!course.enrolledStuIds.includes(payment.userId.toString())) {
                        course.enrolledStuIds.push(+payment.userId);
                    }
                }
                else {
                    course.enrolledStuIds = [+payment.userId];
                }
                const [err, result] = await (0, utils_1.to)(course.save());
                if (err) {
                    this.logger.error(err.message, { label: PaymentService_1.name });
                    throw new common_1.InternalServerErrorException('Course Enrollment Failue: Auto enrollment could not be possible. Please contact with admin.');
                }
            }
            if (paymentQuery.statusCode === '0000') {
                if (paymentQuery.transactionStatus === 'Completed') {
                    payment.status = payment_entity_1.PaymentStatus.Successful;
                    payment.paymentExecuteTime = moment(paymentQuery.paymentExecuteTime, "YYYY-MM-DDTHH:mm:ss GMTZ").format('YYYY-MM-DD HH:mm:ss');
                    ;
                    payment.customerMsisdn = paymentQuery.customerMsisdn;
                    try {
                        await payment.save();
                    }
                    catch (error) {
                        this.logger.error(error.message, { label: PaymentService_1.name });
                        throw new common_1.InternalServerErrorException('Payment data can not be saved to database.');
                    }
                    return {
                        statusCode: "1",
                        statusMessage: "Already Payment Completed.",
                        amount: paymentQuery.ammount,
                        currency: paymentQuery.currency,
                        merchantInvoice: payment.invoiceId,
                        productType: payment.productType,
                        productId: payment.productId
                    };
                }
                else if (paymentQuery.transactionStatus === 'Initiated' && paymentQuery.verificationStatus === "Incomplete") {
                    payment.status = payment_entity_1.PaymentStatus.Failed;
                    payment.paymentExecuteTime = moment(data.paymentExecuteTime, "YYYY-MM-DDTHH:mm:ss GMTZ").format('YYYY-MM-DD HH:mm:ss');
                    return {
                        statusCode: "2",
                        statusMessage: "Payment Failure: Problems at Bkash authentication (OTP or PIN verification).",
                        amount: paymentQuery.ammount,
                        currency: paymentQuery.currency,
                        merchantInvoice: payment.invoiceId,
                        productType: payment.productType,
                        productId: payment.productId
                    };
                }
                else {
                    return {
                        statusCode: "3",
                        statusMessage: paymentQuery.statusMessage,
                        productType: payment.productType,
                        productId: payment.productId,
                        merchantInvoice: payment.invoiceId
                    };
                }
            }
            return {
                statusCode: "3",
                statusMessage: paymentQuery.statusMessage,
                productType: payment.productType,
                productId: payment.productId,
                merchantInvoice: payment.invoiceId
            };
        }
    }
    async bkashPaymentFailure(paymentId, status) {
        if (status === 'failure')
            status = payment_entity_1.PaymentStatus.Failed;
        if (status === 'cancel')
            status = payment_entity_1.PaymentStatus.Cancelled;
        const [error, payment] = await (0, utils_1.to)(this.paymentRepository.findOne(paymentId));
        if (error || (Object.keys(payment).length === 0)) {
            this.logger.error(error.message, { label: PaymentService_1.name });
            throw new common_1.InternalServerErrorException('Payment data can not be retrieved from database.');
        }
        payment.status = status;
        try {
            await payment.save();
        }
        catch (error) {
            this.logger.error(error.message, { label: PaymentService_1.name });
            throw new common_1.InternalServerErrorException('Payment data can not be saved to database.');
        }
        return {
            statusCode: "11",
            statusMessage: "Payment Failure: Payment status saved for future inquery.",
            merchantInvoice: payment.invoiceId,
            productType: payment.productType,
            productId: payment.productId
        };
    }
    async bkashPaymentRefundFindOne(id) {
        const [error, refundData] = await (0, utils_1.to)(this.paymentRefundRepository.findOne(id));
        if (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
        return refundData;
    }
    async bkashPaymentRefundTransaction(refundTransaction) {
        const { paymentId, amount, trxId, sku, reason } = refundTransaction;
        let errorGT, token;
        [errorGT, token] = await (0, utils_1.to)(this.bkashPgwGrantTokenRequest());
        if (errorGT) {
            this.logger.error(errorGT.message, { label: PaymentService_1.name });
            throw new common_1.InternalServerErrorException(errorGT.message);
        }
        const headers = {
            Authorization: token.id_token,
            'X-App-Key': bkashConfig.app_key,
        };
        const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`payment/refund`, { paymentID: paymentId, amount, trxID: trxId, sku, reason }, { timeout: 30000, headers }).pipe((0, rxjs_1.catchError)((error) => {
            this.logger.error(error.message, { label: PaymentService_1.name });
            throw new common_1.HttpException('Payment Refund Failure: ' + error.message, common_1.HttpStatus.BAD_REQUEST);
        })));
        if (data.statusCode === '0000') {
            const paymentRefund = new paymentRefund_entity_1.PaymentRefund();
            paymentRefund.id = paymentId;
            paymentRefund.trxId = trxId;
            paymentRefund.refundTrxId = data.refundTrxID;
            paymentRefund.refundAmount = data.amount;
            paymentRefund.refundCompletedTime = moment(data.completedTime, "YYYY-MM-DDTHH:mm:ss GMTZ").format('YYYY-MM-DD HH:mm:ss');
            paymentRefund.status = data.transactionStatus;
            paymentRefund.sku = sku;
            paymentRefund.reason = reason;
            const [errorRefund, refundRes] = await (0, utils_1.to)(paymentRefund.save());
            if (errorRefund) {
                throw new common_1.InternalServerErrorException('Refund data can not be saved at database.' + errorRefund.message);
            }
            return refundRes;
        }
        return data;
    }
};
PaymentService = PaymentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __param(1, (0, typeorm_1.InjectRepository)(payment_repository_1.PaymentRepository)),
    __param(2, (0, typeorm_1.InjectRepository)(paymentRefund_repository_1.PaymentRefundRepository)),
    __param(3, (0, typeorm_1.InjectRepository)(course_repository_1.CourseRepository)),
    __metadata("design:paramtypes", [common_1.Logger,
        payment_repository_1.PaymentRepository,
        paymentRefund_repository_1.PaymentRefundRepository,
        course_repository_1.CourseRepository,
        axios_1.HttpService])
], PaymentService);
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map