import { CreatePaymentDto } from './dto/payment.dto';
import { PaymentService } from './payment.service';
import { RefundTransaction } from './paymentRefund.entity';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    getPaymentByManualMethodRecords(query: any): Promise<any>;
    makePaymentByBkash(): Promise<import("./payment.entity").GrantTokenResponse>;
    createPaymentByBkash(createPaymentDto: CreatePaymentDto, req: any): Promise<{
        bkashURL: any;
    }>;
    executePaymentByBkash(param: any): Promise<{
        statusCode: string;
        statusMessage: string;
        amount: any;
        currency: any;
        merchantInvoice: any;
        productType: any;
        productId: any;
    } | {
        statusCode: string;
        statusMessage: any;
        productType: any;
        productId: any;
        merchantInvoice: any;
        amount?: undefined;
        currency?: undefined;
    }>;
    queryPaymentByBkash(param: any): Promise<any>;
    FailedPaymentByBkash(param: any): Promise<{
        statusCode: string;
        statusMessage: string;
        merchantInvoice: any;
        productType: any;
        productId: any;
    }>;
    PaymentRefundTransactionByBkash(param: RefundTransaction): Promise<any>;
    PaymentRefundGetOne(param: any): Promise<any>;
}
