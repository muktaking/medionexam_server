import { BaseEntity, Timestamp } from "typeorm";
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
export declare class Payment extends BaseEntity {
    id: number;
    userId: number;
    productType: ProductType;
    productId: number;
    senderMobile: string;
    txId: string;
    paymentAmount: number;
    ref: string;
    paymentGateway: PaymentGateway;
    transactionAt: Timestamp;
}
