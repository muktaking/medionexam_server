"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update1681755318020 = void 0;
class update1681755318020 {
    constructor() {
        this.name = 'update1681755318020';
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
exports.update1681755318020 = update1681755318020;
//# sourceMappingURL=1681755318020-update.js.map