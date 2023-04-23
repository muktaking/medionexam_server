"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.winstonConfig = void 0;
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const myFormat = printf(({ level, message, label, timestamp }) => {
    return ` [${label}] - ${timestamp}  ${level}: ${message}`;
});
function winstonConfig() {
    return {
        level: 'info',
        format: format.combine(timestamp({
            format: 'DD-MM-YYYY, HH:mm:ss A'
        }), myFormat),
        transports: [
            (process.env.NODE_ENV !== 'production') && new transports.Console({
                format: format.simple(),
            }),
            new transports.File({ filename: 'logs/error.log', level: 'error' }),
            new transports.File({ filename: 'logs/combined.log' }),
        ],
    };
}
exports.winstonConfig = winstonConfig;
//# sourceMappingURL=winston.config.js.map