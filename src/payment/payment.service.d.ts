import { PaymentRepository } from './payment.repository';
import { CreatePaymentDto } from './dto/payment.dto';
export declare class PaymentService {
    private paymentRepository;
    constructor(paymentRepository: PaymentRepository);
    createPaymentByManualMethodRecords(createPaymentDto: CreatePaymentDto, user: any): Promise<{
        data: any;
        message: string;
    }>;
    getPaymentByManualMethodRecords(userId?: any): Promise<any>;
    getPaymentRecordsByProductIdAndUserId(productId: any, userId: any): Promise<any>;
}
