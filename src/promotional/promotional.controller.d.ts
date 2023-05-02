import { PromotionalService } from './promotional.service';
export declare class PromotionalController {
    private readonly promotionalService;
    constructor(promotionalService: PromotionalService);
    getAllPromotions(): Promise<object | Error>;
}
