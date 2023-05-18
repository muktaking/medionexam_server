"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailBasic = void 0;
const config = require("config");
const nodemailer = require("nodemailer");
const emailConfig = config.get('email');
async function emailBasic(subject, html, receiverEmail = emailConfig.forward_address) {
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
        to: receiverEmail,
        subject,
        html,
    };
    const emailPromise = new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            }
            resolve(info);
        });
    });
    return emailPromise;
}
exports.emailBasic = emailBasic;
//# sourceMappingURL=email.utils.js.map