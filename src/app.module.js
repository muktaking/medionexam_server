"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const platform_express_1 = require("@nestjs/platform-express");
const serve_static_1 = require("@nestjs/serve-static");
const typeorm_1 = require("@nestjs/typeorm");
const nest_winston_1 = require("nest-winston");
const path_1 = require("path");
const auth_module_1 = require("./auth/auth.module");
const bootstrapService_service_1 = require("./bootstrapService.service");
const categories_module_1 = require("./categories/categories.module");
const courses_controller_1 = require("./courses/courses.controller");
const courses_module_1 = require("./courses/courses.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const exams_module_1 = require("./exams/exams.module");
const notification_module_1 = require("./notification/notification.module");
const postexams_module_1 = require("./postexams/postexams.module");
const questions_module_1 = require("./questions/questions.module");
const routine_module_1 = require("./routine/routine.module");
const typeorm_config_1 = require("./typeormconfig/typeorm.config");
const userExamProfile_module_1 = require("./userExamProfile/userExamProfile.module");
const users_module_1 = require("./users/users.module");
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const myFormat = printf(({ level, message, label, timestamp }) => {
    return ` [${label}] - ${timestamp}  ${level}: ${message}`;
});
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            common_1.CacheModule.register({
                ttl: 60 * 60 * 24 * 3,
                max: 100,
                isGlobal: true,
            }),
            config_1.ConfigModule.forRoot(),
            typeorm_1.TypeOrmModule.forRoot(typeorm_config_1.typeOrmConfig),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', '/../uploads'),
                serveStaticOptions: {
                    dotfiles: 'ignore',
                    etag: true,
                    extensions: ['htm', 'html'],
                    index: false,
                    maxAge: '7d',
                    redirect: false,
                    setHeaders: (res, path, stat) => {
                        res.set('x-timestamp', Date.now());
                    }
                }
            }),
            platform_express_1.MulterModule.register({
                dest: './uploads',
            }),
            nest_winston_1.WinstonModule.forRoot({
                level: 'info',
                format: format.combine(timestamp({
                    format: 'DD-MM-YYYY, HH:mm:ss A'
                }), myFormat),
                transports: [
                    new transports.File({ filename: 'logs/error.log', level: 'error' }),
                    new transports.File({ filename: 'logs/combined.log' }),
                ],
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            categories_module_1.CategoriesModule,
            questions_module_1.QuestionsModule,
            exams_module_1.ExamsModule,
            postexams_module_1.PostexamsModule,
            dashboard_module_1.DashboardModule,
            routine_module_1.RoutineModule,
            courses_module_1.CoursesModule,
            userExamProfile_module_1.UserExamProfileModule,
            notification_module_1.NotificationModule,
        ],
        controllers: [courses_controller_1.CoursesController],
        providers: [bootstrapService_service_1.BootstrapService]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map