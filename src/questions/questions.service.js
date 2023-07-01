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
var QuestionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const fs = require("fs");
const category_repository_1 = require("../categories/category.repository");
const user_entity_1 = require("../users/user.entity");
const utils_1 = require("../utils/utils");
const typeorm_2 = require("typeorm");
const XLSX = require("xlsx");
const question_entity_1 = require("./question.entity");
const question_repository_1 = require("./question.repository");
const stem_entity_1 = require("./stem.entity");
const moment = require("moment");
const nest_winston_1 = require("nest-winston");
let QuestionsService = QuestionsService_1 = class QuestionsService {
    constructor(logger, questionRepository, categoryRepository) {
        this.logger = logger;
        this.questionRepository = questionRepository;
        this.categoryRepository = categoryRepository;
    }
    async findAllQuestions() {
        const [err, questions] = await (0, utils_1.to)(this.questionRepository.find());
        console.log(err);
        if (err)
            throw new common_1.InternalServerErrorException();
        return questions;
    }
    async findQuestionById(id) {
        if (!id.includes(',')) {
            const [err, question] = await (0, utils_1.to)(this.questionRepository.findOne(+id));
            if (err) {
                this.logger.error(err.message);
                this.logger.debug(err);
                throw new common_1.InternalServerErrorException(err.message);
            }
            return question;
        }
        const questionIds = id.split(',');
        const [err, questions] = await (0, utils_1.to)(this.questionRepository.findByIds(questionIds));
        if (err) {
            this.logger.error(err.message);
            this.logger.debug(err);
            throw new common_1.InternalServerErrorException(err.message);
        }
        return questions;
    }
    async findQuestionByFilter(filterName, filterValue) {
        if (filterName === 'categoryId') {
            const [err, category] = await (0, utils_1.to)(this.categoryRepository.findOne(+filterValue));
            if (err)
                throw new common_1.InternalServerErrorException(err.message);
            if (category) {
                const [err, categoriesIncChild] = await (0, utils_1.to)(this.categoryRepository.find({
                    select: ['id'],
                    where: {
                        slug: (0, typeorm_2.Like)(`${category.slug}%`)
                    }
                }));
                if (err)
                    throw new common_1.InternalServerErrorException(err.message);
                const [error, result] = await (0, utils_1.to)(this.questionRepository.find({ where: { [filterName]: (0, typeorm_2.In)(categoriesIncChild.map(cat => +cat.id)) } }));
                if (error)
                    throw new common_1.InternalServerErrorException(error.message);
                return result;
            }
        }
        const [err, result] = await (0, utils_1.to)(this.questionRepository.find({ where: { [filterName]: +filterValue } }));
        if (err)
            throw new common_1.InternalServerErrorException(err.message);
        return result;
    }
    async createQuestion(createQuestionDto, stem, creator) {
        const { title, category, qType, qText, generalFeedback, tags, } = createQuestionDto;
        const stems = [];
        stem.stem.forEach((element) => {
            const stem = new stem_entity_1.Stem();
            stem.qStem = element.qStem;
            stem.aStem = element.aStem;
            stem.fbStem = element.fbStem;
            stems.push(stem);
        });
        const question = new question_entity_1.Question();
        question.title = title;
        question.categoryId = +category;
        question.qType = qType;
        question.qText = qText;
        question.generalFeedback = generalFeedback ? generalFeedback : null;
        question.tags = tags ? tags.join(',') : null;
        question.creatorId = +creator;
        question.stems = stems;
        const [err, result] = await (0, utils_1.to)(question.save());
        if (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException();
        }
        return { result, message: stem.error };
    }
    async createQuestionByUpload(creator, category, file) {
        let excel = '';
        let data = [];
        try {
            excel = file.path;
            const workbook = XLSX.readFile(excel);
            data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
                header: 1,
                raw: false,
                defval: '',
                blankrows: false
            });
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException();
        }
        fs.unlink(excel, (err) => {
            if (err) {
                console.log(err);
            }
        });
        data.shift();
        const result = this.toCollection(data, category, creator);
        if (result.errorMessage.length > 0) {
            const msg = result.errorMessage
                .map((msg, ind) => result.errorIndex[ind] + '. ' + msg)
                .join('; ');
            throw new common_1.HttpException(msg, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        if (result.allData.length > 0) {
            const [err, isSaved] = await (0, utils_1.to)(this.questionRepository.save(result.allData));
            if (err) {
                console.log(err);
                throw new common_1.InternalServerErrorException(err.message);
            }
            return isSaved;
        }
    }
    async updateQuestionById(id, createQuestionDto, stem, modifiedBy) {
        const oldQuestion = await this.questionRepository
            .findOne(+id)
            .catch((e) => {
            throw new common_1.HttpException('Could not able to fetch oldQuestion from database ', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        });
        if (modifiedBy.role < user_entity_1.RolePermitted.moderator) {
            if (oldQuestion.creatorId !== modifiedBy.id)
                throw new common_1.UnauthorizedException();
        }
        const { title, category, qType, qText, generalFeedback, tags, } = createQuestionDto;
        const stems = [];
        stem.stem.forEach((element) => {
            const stem = new stem_entity_1.Stem();
            stem.qStem = element.qStem;
            stem.aStem = element.aStem;
            stem.fbStem = element.fbStem;
            stems.push(stem);
        });
        const newQuestion = Object.assign({}, oldQuestion);
        newQuestion.title = title;
        newQuestion.categoryId = +category;
        newQuestion.qType = qType;
        newQuestion.qText = qText;
        newQuestion.generalFeedback = generalFeedback ? generalFeedback : null;
        newQuestion.tags = tags ? tags.join(',') : null;
        newQuestion.modifiedDate = moment().format('YYYY-MM-DD HH=mm=sss');
        newQuestion.modifiedById = +modifiedBy.id;
        newQuestion.stems = stems;
        await this.questionRepository.delete(+id);
        return await this.questionRepository.save(newQuestion);
    }
    async deleteQuestion(args) {
        const [error, res] = await (0, utils_1.to)(this.questionRepository.delete(args.trim().split(',')));
        if (error) {
            this.logger.error(error.message, { label: QuestionsService_1.name });
            throw new common_1.InternalServerErrorException(error.message);
        }
        return { message: 'Question deleted successfully', data: res };
    }
    toCollection(data, category, user) {
        const allData = [];
        const errorIndex = [];
        const errorMessage = [];
        data.forEach((element, index) => {
            const stems = [];
            if (element[0] === '') {
                errorIndex.push(index + 1);
                errorMessage.push('A question Title can not be Empty');
                return;
            }
            if (element[1] === '') {
                errorIndex.push(index + 1);
                errorMessage.push('A question Type can not be Empty');
                return;
            }
            if (element[2] === '') {
                errorIndex.push(index + 1);
                errorMessage.push('A question Text can not be Empty');
                return;
            }
            if (element[3] === '') {
                errorIndex.push(index + 1);
                errorMessage.push('First stem can not be empty.');
                return;
            }
            for (let i = 3; i < 8; i++) {
                if (element[i] === '' && element[i + 10] !== '') {
                    errorIndex.push(index + 1);
                    errorMessage.push('Feedback Can not be on empty stems.');
                    return;
                }
            }
            if (element[1] === 'matrix') {
                for (let i = 3; i < 8; i++) {
                    if ((element[i] !== '' && element[i + 5] === '') ||
                        (element[i + 5] !== '' && element[i] === '')) {
                        errorIndex.push(index + 1);
                        errorMessage.push('Stem should have corresponding answer and vice versa.');
                        return;
                    }
                }
            }
            for (let i = 3; i < 8; i++) {
                let stem = {
                    qStem: '',
                    aStem: '',
                    fbStem: '',
                };
                stem.qStem = element[i] !== '' ? element[i] : null;
                stem.aStem = element[i + 5] !== '' ? element[i + 5] : null;
                stem.fbStem = element[i + 10] !== '' ? element[i + 10] : null;
                if (stem.qStem)
                    stems.push(stem);
            }
            allData.push({
                title: element[0],
                categoryId: category,
                creatorId: +user,
                qType: element[1],
                qText: element[2],
                stems: stems,
                generalFeedback: element[18],
                tags: element[19],
            });
        });
        return {
            allData,
            errorIndex,
            errorMessage,
        };
    }
};
QuestionsService = QuestionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __param(1, (0, typeorm_1.InjectRepository)(question_repository_1.QuestionRepository)),
    __param(2, (0, typeorm_1.InjectRepository)(category_repository_1.CategoryRepository)),
    __metadata("design:paramtypes", [common_1.Logger,
        question_repository_1.QuestionRepository,
        category_repository_1.CategoryRepository])
], QuestionsService);
exports.QuestionsService = QuestionsService;
//# sourceMappingURL=questions.service.js.map