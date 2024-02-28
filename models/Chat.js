const Joi = require("joi");
const mongoose = require("mongoose");
const { uploadImage, deleteFile, uploadFile } = require("../helpers/tools/fileUploader.js")

const chatSchema = new mongoose.Schema(
    {
        files: {
            type: [String]
        },
    },
    {
        timestamps: true,
        collection: "chat",
    }
);

// To create chat
chatSchema.statics.createChat = async function ({ files }) {
    try {

        let fileUrls = []

        // Check if multiple files is provided
        if (files) {

            await Promise.all(files.map(async (file) => {

                const fileUrl = await uploadFile({
                    file: file,
                    path: "chatFiles/",
                });

                if (fileUrl != false) {
                    fileUrls.push(fileUrl)
                }
            }));
        }

        await this.create({ files: fileUrls })

        return fileUrls;
    } catch (error) {
        throw error;
    }
}

const Chat = mongoose.model("chat", chatSchema);

module.exports = {
    Chat
}