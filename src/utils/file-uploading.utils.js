"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageResizer = exports.editFileName = exports.csvFileFilter = exports.excelFileFilter = exports.imageFileFilter = void 0;
const fs = require("fs");
const path_1 = require("path");
const sharp = require("sharp");
const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
};
exports.imageFileFilter = imageFileFilter;
const excelFileFilter = (req, file, callback) => {
    if (file.mimetype !==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        return callback(new Error('Only Excell files are allowed!'), false);
    }
    callback(null, true);
};
exports.excelFileFilter = excelFileFilter;
const csvFileFilter = (req, file, callback) => {
    if (file.mimetype !== 'text/csv' &&
        file.mimetype !== 'application/vnd.ms-excel') {
        return callback(new Error('Only CSV files are allowed!'), false);
    }
    callback(null, true);
};
exports.csvFileFilter = csvFileFilter;
const editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = (0, path_1.extname)(file.originalname);
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
};
exports.editFileName = editFileName;
async function imageResizer(image, folderPath) {
    const resizeImage = await sharp(image.path)
        .resize(350, 180)
        .png()
        .toBuffer();
    const resizeImageName = image.filename.split('.')[0] + '_350_180.png';
    const resizeImagePathName = `./uploads/images/${folderPath}/${resizeImageName}`;
    const imagePathPromise = new Promise((resolve, reject) => {
        fs.writeFile(resizeImagePathName, resizeImage, (err) => {
            if (!err) {
                fs.unlink(`./uploads/images/${folderPath}/${image.filename}`, (delErr) => {
                    if (delErr) {
                        console.log(delErr);
                    }
                });
                resolve('images/' + folderPath + '/' + resizeImageName);
            }
            else {
                reject(err.message);
            }
        });
    });
    return imagePathPromise;
}
exports.imageResizer = imageResizer;
//# sourceMappingURL=file-uploading.utils.js.map