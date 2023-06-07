import { Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PaymentRepository } from './payment.repository';
import { CreatePaymentDto } from './dto/payment.dto';
import { GrantTokenResponse } from './payment.entity';
import { User } from 'src/users/user.entity';
import { CourseRepository } from 'src/courses/course.repository';
import { PaymentRefundRepository } from './paymentRefund.repository';
import { RefundTransaction } from './paymentRefund.entity';
export declare class PaymentService {
    private readonly logger;
    private paymentRepository;
    private paymentRefundRepository;
    private courseRepository;
    private readonly httpService;
    constructor(logger: Logger, paymentRepository: PaymentRepository, paymentRefundRepository: PaymentRefundRepository, courseRepository: CourseRepository, httpService: HttpService);
    getPaymentByManualMethodRecords(userId?: any): Promise<any>;
    getPaymentRecordsByProductIdAndUserId(productId: any, userId: any): Promise<any>;
    bkashPgwGrantTokenRequest(): Promise<GrantTokenResponse>;
    bkashCreatePayment(createPaymentDto: CreatePaymentDto, user: User): Promise<{
        bkashURL: any;
    }>;
    bkashQueryPayment(paymentId: any, oldTokenId?: string): Promise<any>;
    bkashExecutePayment(paymentId: any): Promise<{
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
    bkashPaymentFailure(paymentId: string, status: any): Promise<{
        statusCode: string;
        statusMessage: string;
        merchantInvoice: any;
        productType: any;
        productId: any;
    }>;
    bkashPaymentRefundFindOne(id: string): Promise<any>;
    bkashPaymentRefundTransaction(refundTransaction: RefundTransaction): Promise<any>;
}
