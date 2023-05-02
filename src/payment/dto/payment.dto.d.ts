import { PaymentGateway, ProductType } from '../payment.entity';
export declare class CreatePaymentDto {
    productType: ProductType;
    productId: string;
    senderMobile: string;
    txId: string;
    paymentAmount: string;
    paymentGateway: PaymentGateway;
    ref: string;
}
