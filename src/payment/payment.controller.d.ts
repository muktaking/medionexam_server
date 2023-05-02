import { CreatePaymentDto } from './dto/payment.dto';
import { PaymentService } from './payment.service';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createPaymentByManualMethodRecords(createPaymentDto: CreatePaymentDto, req: any): Promise<{
        data: any;
        message: string;
    }>;
    getPaymentByManualMethodRecords(query: any): Promise<any>;
}
