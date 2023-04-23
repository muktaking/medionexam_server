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
var BootstrapService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BootstrapService = void 0;
const common_1 = require("@nestjs/common");
const nest_winston_1 = require("nest-winston");
const typeorm_1 = require("typeorm");
const category_entity_1 = require("./categories/category.entity");
let BootstrapService = BootstrapService_1 = class BootstrapService {
    constructor(logger) {
        this.logger = logger;
    }
    async onApplicationBootstrap() {
        await (0, typeorm_1.getRepository)(category_entity_1.Category)
            .createQueryBuilder('cat')
            .where('cat.name IN (:...names)', { names: ['Free', 'Featured'] })
            .execute()
            .then(async (cats) => {
            if (cats.length > 1) {
                return this.logger.info('Free and Freatured Exam are already created', { label: BootstrapService_1.name });
            }
            await (0, typeorm_1.getConnection)()
                .createQueryBuilder()
                .insert()
                .into(category_entity_1.Category)
                .values([
                {
                    id: 1,
                    name: 'Free',
                    slug: 'Top_Free',
                    description: 'The exams under <Free> category will be accessible by everyone.',
                    parentId: null,
                    order: 2,
                    imageUrl: 'images/categories/free.png'
                },
                {
                    id: 2,
                    name: 'Featured',
                    slug: 'Top_Featured',
                    description: 'The exams under <Featued> category are high top exams.',
                    parentId: null,
                    order: 1,
                    imageUrl: 'images/categories/featured.png'
                }
            ])
                .execute()
                .then(async (res) => {
                this.logger.info('Free & Featured category created successfully', { label: BootstrapService_1.name });
            });
        })
            .catch(e => {
            this.logger.error(e.message, { label: BootstrapService_1.name });
        });
    }
};
BootstrapService = BootstrapService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [Object])
], BootstrapService);
exports.BootstrapService = BootstrapService;
//# sourceMappingURL=bootstrapService.service.js.map