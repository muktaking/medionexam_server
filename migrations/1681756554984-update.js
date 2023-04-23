"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update1681756554984 = void 0;
class update1681756554984 {
    constructor() {
        this.name = 'update1681756554984';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`course\` ADD \`discountPricePercentage\` smallint NULL`);
        await queryRunner.query(`ALTER TABLE \`course\` ADD \`pgCourseType\` enum ('0', '1', '2', '3', '4', '5') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`course\` ADD \`faculty\` enum ('0', '1', '2', '3', '4') NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`course\` DROP COLUMN \`faculty\``);
        await queryRunner.query(`ALTER TABLE \`course\` DROP COLUMN \`pgCourseType\``);
        await queryRunner.query(`ALTER TABLE \`course\` DROP COLUMN \`discountPricePercentage\``);
    }
}
exports.update1681756554984 = update1681756554984;
//# sourceMappingURL=1681756554984-update.js.map