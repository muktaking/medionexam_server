import { Strategy } from "passport-local";
import { Logger } from 'winston';
import { AuthService } from "./auth.service";
declare const LocalStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalStrategy extends LocalStrategy_base {
    private readonly logger;
    private readonly authService;
    constructor(logger: Logger, authService: AuthService);
    validate(username: string, password: string): Promise<any>;
}
export {};
