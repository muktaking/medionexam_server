import { BaseEntity, Timestamp } from "typeorm";
export declare enum PaymentStatus {
    Initiated = 0,
    Successful = 1,
    Failed = 2,
    Cancelled = 3
}
export declare enum PaymentGateway {
    Bkash = 0,
    Rocket = 1,
    Nagad = 2
}
export declare enum ProductType {
    Lecture = 0,
    Course = 1,
    Exam = 2
}
export interface GrantTokenResponse {
    expires_in: string;
    id_token: string;
    refresh_token: string;
    token_type: string;
    statusCode: string;
    statusMessage: string;
}
export declare class BkashCreatePayment {
    mode: string;
    payerReference: string;
    private callbackURL;
    amount: string;
    currency: string;
    intent: string;
    merchantInvoiceNumber: string;
    constructor(init?: Partial<BkashCreatePayment>);
}
export declare class Payment extends BaseEntity {
    id: string;
    userId: number;
    agreementId: string;
    customerMsisdn: string;
    productType: ProductType;
    productId: number;
    invoiceId: string;
    trxId: string;
    paymentAmount: number;
    ref: string;
    paymentGateway: PaymentGateway;
    transactionAt: Timestamp;
    paymentCreateTime: Timestamp | string;
    paymentExecuteTime: Timestamp;
    status: PaymentStatus;
}
