import { BaseEntity, Timestamp } from "typeorm";
export interface RefundTransaction {
    paymentId: string;
    amount: string;
    trxId: string;
    sku: string;
    reason: string;
}
export declare class PaymentRefund extends BaseEntity {
    id: string;
    trxId: string;
    refundTrxId: string;
    refundAmount: number;
    refundCompletedTime: Timestamp | string;
    status: string;
    sku: string;
    reason: string;
}
