"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const axios_1 = require("axios");
const bcrypt = require("bcryptjs");
const config = require("config");
const crypto = require("crypto");
const generator = require("generate-password");
const google_auth_library_1 = require("google-auth-library");
const _ = require("lodash");
const nest_winston_1 = require("nest-winston");
const nodemailer = require("nodemailer");
const user_entity_1 = require("../users/user.entity");
const user_repository_1 = require("../users/user.repository");
const utils_1 = require("../utils/utils");
const typeorm_2 = require("typeorm");
const users_service_1 = require("../users/users.service");
const moment = require('moment');
const jwtConfig = config.get('jwt');
const googleAuthConfig = config.get('googleAuth');
const emailConfig = config.get('email');
const baseSiteConfig = config.get('base_site');
const client = new google_auth_library_1.OAuth2Client(googleAuthConfig.client_id);
let AuthService = AuthService_1 = class AuthService {
    constructor(logger, userRepository, usersService, jwtService) {
        this.logger = logger;
        this.userRepository = userRepository;
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        let user = await this.usersService.findOneUser(email, false, true);
        if (user) {
            const isValid = await bcrypt.compare(password, user.password);
            user = isValid ? _.pick(user, ['email', 'role', 'id']) : null;
            return user;
        }
        return null;
    }
    async login(user) {
        const payload = {
            email: user.email,
            id: user.id,
            role: user.role,
        };
        const accessToken = await this.jwtService.sign(payload);
        return {
            accessToken,
            id: user.id,
            expireIn: process.env.JWT_EXPIRESIN || jwtConfig.expiresIn,
        };
    }
    async reset(email) {
        crypto.randomBytes(32, (err, buffer) => {
            if (err) {
                this.logger.error(err.message, { label: AuthService_1.name });
                throw new common_1.InternalServerErrorException();
            }
            const token = buffer.toString('hex');
            this.userRepository
                .findOne({ email })
                .then((user) => {
                if (!user) {
                    this.logger.warn(`User Not Exist: ${email} is not exist.`, { label: AuthService_1.name });
                    throw new common_1.HttpException('User is not available', common_1.HttpStatus.NOT_FOUND);
                }
                user.resetToken = token;
                user.resetTokenExpiration = moment()
                    .add(3 * 60 * 60 * 1000, 'milliseconds')
                    .format('YYYY-MM-DD HH:mm:ss');
                user
                    .save()
                    .then((saved) => {
                    let transporter = nodemailer.createTransport({
                        host: process.env.EMAIL_HOST || emailConfig.host,
                        port: process.env.EMAIL_PORT || emailConfig.port,
                        secure: process.env.IS_SECURE || emailConfig.is_secure,
                        auth: {
                            user: process.env.EMAIL_USER || emailConfig.user,
                            pass: process.env.EMAIL_PASSWORD || emailConfig.password,
                        },
                        tls: {
                            rejectUnauthorized: false,
                        },
                    });
                    let mailOptions = {
                        from: `"No-reply" <${process.env.EMAIL_USER ||
                            emailConfig.user}>`,
                        to: email,
                        subject: 'Reset Your Password, ',
                        html: `<h3>Reset Your Password</h3>
                          <p>If you request for password reset, click this <a href="${process
                            .env.BASE_SITE_URL ||
                            baseSiteConfig.url}/reset/${token}">reset link</a></p>
                  `,
                    };
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            this.logger.error(error.message, { label: AuthService_1.name });
                        }
                        this.logger.info(err.message, { label: AuthService_1.name });
                    });
                    return { message: 'Reset password successfull' };
                })
                    .catch((err) => {
                    this.logger.error(err.message, { label: AuthService_1.name });
                });
            })
                .catch((err) => {
                this.logger.error(err.message, { label: AuthService_1.name });
            });
        });
    }
    async resetPassword(token, password) {
        const newPassword = password;
        const passwordToken = token;
        const [err, user] = await (0, utils_1.to)(this.userRepository.findOne({
            where: {
                resetToken: passwordToken,
                resetTokenExpiration: (0, typeorm_2.MoreThan)(moment().format('YYYY-MM-DD HH:mm:ss')),
            },
        }));
        if (err) {
            this.logger.error(err.message, { label: AuthService_1.name });
            throw new common_1.InternalServerErrorException();
        }
        if (user) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            user.resetToken = null;
            user.resetTokenExpiration = undefined;
            await user.save();
            return { message: 'Password reset Successfully' };
        }
        else {
            this.logger.info('[Reset Token Expired]', { label: AuthService_1.name });
            throw new common_1.HttpException('Password Can not be resetted. Reset token may ne expired', common_1.HttpStatus.GONE);
        }
    }
    async facebookLogin({ userID, name, email, accessToken, picture }) {
        let payload;
        const [err, user] = await (0, utils_1.to)(this.userRepository.findOne({ fbId: userID }));
        if (err) {
            this.logger.error(err.message, { label: AuthService_1.name });
            throw new common_1.InternalServerErrorException(err.message);
        }
        if (user) {
            if (user.identityStatus == user_entity_1.IdentityStatus.checked) {
                payload = {
                    email: user.email,
                    id: user.id,
                    role: user.role,
                };
                accessToken = await this.jwtService.sign(payload);
                return {
                    accessToken,
                    id: user.id,
                    expireIn: process.env.JWT_EXPIRESIN || jwtConfig.expiresIn,
                };
            }
            else {
                this.logger.info('[Account Not Approved]: Please contact with admin.', { label: AuthService_1.name });
                throw new common_1.UnauthorizedException('Admin has not approved your account. Please contact with admin.');
            }
        }
        else {
            const newUser = new user_entity_1.User();
            newUser.fbId = userID;
            newUser.firstName = name.split(' ')[0];
            newUser.lastName = name.split(' ').reverse()[0];
            newUser.email = email;
            newUser.userName = name.split(' ')[0];
            newUser.password = generator
                .generateMultiple(3, {
                length: 10,
                uppercase: false,
            })
                .toString();
            newUser.loginProvider = user_entity_1.LoginProvider.facebook;
            newUser.identityStatus = user_entity_1.IdentityStatus.unchecked;
            newUser.avatar = picture.data.url;
            const [err, result] = await (0, utils_1.to)(newUser.save());
            if (err) {
                this.logger.error(err.message, { label: AuthService_1.name });
                throw new common_1.InternalServerErrorException(err.message);
            }
            return { message: 'Wait until Admin approve your account.' };
        }
    }
    async facebookTokenAutolog(userID, accessToken) {
        let urlGraphFacebook = `https://graph.facebook.com/v13.0/${userID}?fields=id%2Cname%2Cemail%2Cpicture&access_token=${accessToken}`;
        return axios_1.default.get(urlGraphFacebook)
            .then(async (res) => {
            const { name, email, picture } = res.data;
            const [err, user] = await (0, utils_1.to)(this.userRepository.findOne({ fbId: userID }));
            if (err) {
                this.logger.error(err.message, { label: AuthService_1.name });
                throw new common_1.InternalServerErrorException(err.message);
            }
            if (user) {
                if (moment(user.resetTokenExpiration).isBefore()) {
                    user.avatar = picture.data.url;
                    user.resetTokenExpiration = moment()
                        .add(60 * 24 * 60 * 60 * 1000, 'milliseconds')
                        .format('YYYY-MM-DD HH:mm:ss');
                    await user.save();
                }
                if (user.identityStatus == user_entity_1.IdentityStatus.checked) {
                    return {
                        accessToken: this.jwtService.sign({
                            email: user.email,
                            id: user.id,
                            role: user.role,
                        }),
                        id: user.id,
                        expireIn: process.env.JWT_EXPIRESIN || jwtConfig.expiresIn,
                    };
                }
                else {
                    this.logger.info('[Account Not Approved]: Please contact with admin.', { label: AuthService_1.name });
                    throw new common_1.UnauthorizedException('Admin has not approved your account. Please contact with admin.');
                }
            }
            else {
                const newUser = new user_entity_1.User();
                newUser.fbId = userID;
                newUser.firstName = name.split(' ')[0];
                newUser.lastName = name.split(' ').reverse()[0];
                newUser.email = email;
                newUser.userName = name.split(' ')[0];
                newUser.password = generator
                    .generateMultiple(3, {
                    length: 10,
                    uppercase: false,
                })
                    .toString();
                newUser.loginProvider = user_entity_1.LoginProvider.facebook;
                newUser.identityStatus = user_entity_1.IdentityStatus.checked;
                newUser.avatar = picture.data.url;
                newUser.resetTokenExpiration = moment()
                    .add(60 * 24 * 60 * 60 * 1000, 'milliseconds')
                    .format('YYYY-MM-DD HH:mm:ss');
                const [err, result] = await (0, utils_1.to)(newUser.save());
                if (err) {
                    this.logger.error(err.message, { label: AuthService_1.name });
                    throw new common_1.InternalServerErrorException(err.message);
                }
                if (result) {
                    return {
                        accessToken: this.jwtService.sign({
                            email: result.email,
                            id: result.id,
                            role: result.role,
                        }),
                        id: result.id,
                        expireIn: process.env.JWT_EXPIRESIN || jwtConfig.expiresIn,
                    };
                }
            }
        })
            .catch(err => {
            this.logger.error(err.message, { label: AuthService_1.name });
            throw new common_1.InternalServerErrorException(err.message);
        });
    }
    async googleLogin(idToken) {
        return client.verifyIdToken({ idToken, audience: googleAuthConfig.client_id })
            .then(async (res) => {
            const { email_verified, email, picture, given_name, family_name } = res.getPayload();
            if (!email_verified) {
                throw new common_1.UnauthorizedException('Email can not be verified.');
            }
            const [err, user] = await (0, utils_1.to)(this.userRepository.findOne({ email: email }));
            if (err) {
                this.logger.error(err.message, { label: AuthService_1.name });
                throw new common_1.InternalServerErrorException(err.message);
            }
            if (user) {
                const obj = {
                    accessToken: this.jwtService.sign({
                        email: user.email,
                        id: user.id,
                        role: user.role,
                    }),
                    id: user.id,
                    expireIn: process.env.JWT_EXPIRESIN || jwtConfig.expiresIn,
                };
                return obj;
            }
            else {
                const newUser = new user_entity_1.User();
                newUser.firstName = given_name;
                newUser.lastName = family_name;
                newUser.email = email;
                newUser.userName = given_name;
                newUser.password = generator
                    .generateMultiple(3, {
                    length: 10,
                    uppercase: false,
                })
                    .toString();
                newUser.loginProvider = user_entity_1.LoginProvider.google;
                newUser.identityStatus = user_entity_1.IdentityStatus.unrequired;
                newUser.avatar = picture;
                const [err, result] = await (0, utils_1.to)(newUser.save());
                if (err) {
                    this.logger.error(err.message, { label: AuthService_1.name });
                    throw new common_1.InternalServerErrorException(err.message);
                }
                if (result) {
                    const obj = {
                        accessToken: this.jwtService.sign({
                            email: result.email,
                            id: result.id,
                            role: result.role,
                        }),
                        id: result.id,
                        expireIn: process.env.JWT_EXPIRESIN || jwtConfig.expiresIn,
                    };
                    return obj;
                }
            }
        })
            .catch(err => console.log(err));
    }
};
AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __param(1, (0, typeorm_1.InjectRepository)(user_repository_1.UserRepository)),
    __metadata("design:paramtypes", [Object, user_repository_1.UserRepository,
        users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map