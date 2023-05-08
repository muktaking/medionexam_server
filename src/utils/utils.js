"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twoDigits = exports.duplicateImageFile = exports.deleteImageFile = exports.to = exports.firstltrCapRestLow = void 0;
const fs = require("fs");
const firstltrCapRestLow = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};
exports.firstltrCapRestLow = firstltrCapRestLow;
function to(promise) {
    return promise
        .then((data) => {
        return [null, data];
    })
        .catch((err) => [err]);
}
exports.to = to;
async function deleteImageFile(imageUrl) {
    const delPromise = new Promise((resolve, reject) => {
        fs.unlink('uploads/' + imageUrl, (error) => {
            if (!error) {
                resolve('File Deleted Successfully');
            }
            else {
                reject(error.message);
            }
        });
    });
    return delPromise;
}
exports.deleteImageFile = deleteImageFile;
async function duplicateImageFile(imageUrl) {
    const dupPromise = new Promise((resolve, reject) => {
        const sourceFilePath = 'uploads/' + imageUrl;
        const destinationFilePath = sourceFilePath.slice(0, sourceFilePath.lastIndexOf('.')) + '_copy' + sourceFilePath.slice(sourceFilePath.lastIndexOf('.'));
        const destinationImageUrl = imageUrl.slice(0, imageUrl.lastIndexOf('.')) + '_copy' + imageUrl.slice(imageUrl.lastIndexOf('.'));
        const readStream = fs.createReadStream(sourceFilePath);
        const writeStream = fs.createWriteStream(destinationFilePath);
        readStream.pipe(writeStream);
        writeStream.on('error', (err) => {
            reject(err.message);
        });
        writeStream.on('finish', () => {
            resolve(destinationImageUrl);
        });
    });
    return dupPromise;
}
exports.duplicateImageFile = duplicateImageFile;
function twoDigits(d) {
    if (0 <= d && d < 10)
        return '0' + d.toString();
    if (-10 < d && d < 0)
        return '-0' + (-1 * d).toString();
    return d.toString();
}
exports.twoDigits = twoDigits;
//# sourceMappingURL=utils.js.map