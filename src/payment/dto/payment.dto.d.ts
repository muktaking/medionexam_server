import { PaymentGateway, ProductType } from '../payment.entity';
export declare class CreatePaymentDto {
    productType: ProductType;
    productId: string;
    paymentGateway: PaymentGateway;
    ref: string;
}
