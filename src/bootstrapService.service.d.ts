import { OnApplicationBootstrap } from "@nestjs/common";
import { Logger } from 'winston';
export declare class BootstrapService implements OnApplicationBootstrap {
    private readonly logger;
    constructor(logger: Logger);
    onApplicationBootstrap(): Promise<void>;
}
