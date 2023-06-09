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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = exports.BkashCreatePayment = exports.ProductType = exports.PaymentGateway = exports.PaymentStatus = void 0;
const typeorm_1 = require("typeorm");
const config = require("config");
const siteConfig = config.get('base_site');
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus[PaymentStatus["Initiated"] = 0] = "Initiated";
    PaymentStatus[PaymentStatus["Successful"] = 1] = "Successful";
    PaymentStatus[PaymentStatus["Failed"] = 2] = "Failed";
    PaymentStatus[PaymentStatus["Cancelled"] = 3] = "Cancelled";
})(PaymentStatus = exports.PaymentStatus || (exports.PaymentStatus = {}));
var PaymentGateway;
(function (PaymentGateway) {
    PaymentGateway[PaymentGateway["Bkash"] = 0] = "Bkash";
    PaymentGateway[PaymentGateway["Rocket"] = 1] = "Rocket";
    PaymentGateway[PaymentGateway["Nagad"] = 2] = "Nagad";
})(PaymentGateway = exports.PaymentGateway || (exports.PaymentGateway = {}));
var ProductType;
(function (ProductType) {
    ProductType[ProductType["Lecture"] = 0] = "Lecture";
    ProductType[ProductType["Course"] = 1] = "Course";
    ProductType[ProductType["Exam"] = 2] = "Exam";
})(ProductType = exports.ProductType || (exports.ProductType = {}));
class BkashCreatePayment {
    constructor(init) {
        this.mode = '0011';
        this.payerReference = '';
        this.callbackURL = siteConfig.paymentaCallbackUrl;
        this.currency = 'BDT';
        this.intent = 'sale';
        Object.assign(this, init);
    }
}
exports.BkashCreatePayment = BkashCreatePayment;
let Payment = class Payment extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Payment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Payment.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "agreementId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "customerMsisdn", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ProductType }),
    __metadata("design:type", Number)
], Payment.prototype, "productType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Payment.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Payment.prototype, "invoiceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: true }),
    __metadata("design:type", String)
], Payment.prototype, "trxId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Payment.prototype, "paymentAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "ref", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PaymentGateway }),
    __metadata("design:type", Number)
], Payment.prototype, "paymentGateway", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", typeorm_1.Timestamp)
], Payment.prototype, "transactionAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Payment.prototype, "paymentCreateTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", typeorm_1.Timestamp)
], Payment.prototype, "paymentExecuteTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PaymentStatus }),
    __metadata("design:type", Number)
], Payment.prototype, "status", void 0);
Payment = __decorate([
    (0, typeorm_1.Entity)()
], Payment);
exports.Payment = Payment;
//# sourceMappingURL=payment.entity.js.map