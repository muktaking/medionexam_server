import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/users/user.repository';
import { Logger } from 'winston';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private readonly logger;
    private userRepository;
    private readonly usersService;
    private readonly jwtService;
    constructor(logger: Logger, userRepository: UserRepository, usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        accessToken: any;
        id: any;
        expireIn: any;
    }>;
    reset(email: string): Promise<void>;
    resetPassword(token: number, password: string): Promise<{
        message: string;
    }>;
    facebookLogin({ userID, name, email, accessToken, picture }: {
        userID: any;
        name: any;
        email: any;
        accessToken: any;
        picture: any;
    }): Promise<{
        accessToken: any;
        id: any;
        expireIn: any;
        message?: undefined;
    } | {
        message: string;
        accessToken?: undefined;
        id?: undefined;
        expireIn?: undefined;
    }>;
    facebookTokenAutolog(userID: any, accessToken: any): Promise<{
        accessToken: string;
        id: any;
        expireIn: any;
    }>;
    googleLogin(idToken: any): Promise<void | {
        accessToken: string;
        id: any;
        expireIn: any;
    }>;
}
