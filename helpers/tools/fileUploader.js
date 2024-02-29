const sharp = require("sharp");
const fs = require("fs");
var watermark = require('image-watermark');
require('dotenv').config()

const uploadImage = async ({ path, file, existingFile }) => {
    try {
        // Delete already existing image
        if (existingFile) {
            deleteFile(existingFile);
        }

        // Check if folder is there
        // If not, create new
        absPath = `${process.env.FILES_PATH}${path}`;
        if (!fs.existsSync(absPath)) {
            fs.mkdirSync(absPath, { recursive: true });
        }
        const { buffer, mimetype } = file;

        // Check image validity
        if (!isImageValid(mimetype)) {
            return false;
        }

        const fileName = getImageName(file);
        const fileNameWithPath = `${absPath}/${fileName}`;

        // Compress and store
        await sharp(buffer).webp({ quality: 20 }).toFile(fileNameWithPath);
        return `${path}${fileName}`;
    } catch (error) {
        console.log(error);
        return false;
    }
};

const deleteFile = (existingFile) => {
    try {
        existingImagePath = `${process.env.FILES_PATH}${existingFile}`;
        if (fs.existsSync(existingImagePath)) {
            fs.unlinkSync(existingImagePath);
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const isImageValid = (mimetype) => {
    const availableImageType = ["image/jpeg", "image/png", "image/webp,image/jpg"];
    return availableImageType.includes(mimetype);
};

const getImageName = (file) => {
    const { originalname, mimetype } = file;
    const timestamp = Date.now();

    return `${timestamp}-${originalname}.webp`;
};

const getFileName = (file) => {
    const { originalname } = file;
    const timestamp = Date.now();

    return `${timestamp}-${originalname}`;
};

// Files area
const uploadFile = async ({ path, file }) => {
    try {

        // Check if folder is there
        // If not, create new
        absPath = `${process.env.FILES_PATH}${path}`;
        if (!fs.existsSync(absPath)) {
            fs.mkdirSync(absPath, { recursive: true });
        }
        const { buffer, mimetype } = file;

        // Check image validity
        if (isImageValid(mimetype)) {
            const fileName = getImageName(file);
            const fileNameWithPath = `${absPath}/${fileName}`;

            // Compress and store
            await sharp(buffer).webp({ quality: 20 }).toFile(fileNameWithPath);
            return `${path}${fileName}`;
        }
        // Check file validity
        else if (isFileValid(mimetype)) {
            const fileName = getFileName(file);
            const fileNameWithPath = `${absPath}/${fileName}`;

            // Store file
            try {
                fs.writeFileSync(fileNameWithPath, buffer);
                return `${path}${fileName}`;
            } catch (error) {
                return false;
            }
        }

        return false;

    } catch (error) {
        console.log(error);
        return false;
    }
};

// Upload image with watermark
const uploadImageWithWatermark = async ({ path, watermarkPath, file }) => {
    try {
        // Delete already existing image
        if (existingFile) {
            deleteFile(existingFile);
        }

        // Check if folder is there
        // If not, create new
        absPath = `${process.env.FILES_PATH}${path}`;
        if (!fs.existsSync(absPath)) {
            fs.mkdirSync(absPath, { recursive: true });
        }
        const { buffer, mimetype } = file;

        // Check image validity
        if (!isImageValid(mimetype)) {
            return false;
        }

        const fileName = getImageName(file);
        const fileNameWithPath = `${absPath}/${fileName}`;

        // Compress and store
        await sharp(buffer).webp({ quality: 20 }).toFile(fileNameWithPath);


        var options = {
            'text': 'Marketplace',
            'dstPath': `${absPath}/watermark/${fileName}`
        };

        watermark.embedWatermark(fileNameWithPath, options);

        return `${path}${fileName}`;
    } catch (error) {
        console.log(error);
        return false;
    }
};

const isFileValid = (mimetype) => {
    console.log(mimetype);
    const availableImageType = [
        "application/pdf", //.pdf
        "application/msword", //.doc
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", //.docx
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlxs
        "application/vnd.ms-excel" //xls
    ];
    return availableImageType.includes(mimetype);
};

// CSV area
const saveCSV = ({ csv, path }) => {
    // Check if folder is there
    // If not, create new
    absPath = `${process.env.FILES_PATH}${path}`;

    if (fs.existsSync(absPath)) {
        fs.rmSync(absPath, { recursive: true, force: true });
    }

    fs.mkdirSync(absPath, { recursive: true, force: true });

    const csvName = getNameWithTimestamp("");
    const fileNameWithPath = `${absPath}${csvName}`;

    try {
        fs.writeFileSync(fileNameWithPath, csv);
        return `/${path}${csvName}`;
    } catch (error) {
        return false;
    }
}

const getNameWithTimestamp = (fileName) => {
    const timestamp = Date.now();
    return fileName ? `${timestamp}-${fileName}.csv` : `${timestamp}.csv`;
};

module.exports = {
    uploadImage,
    deleteFile,
    uploadFile,
    saveCSV,
    uploadImageWithWatermark
};
