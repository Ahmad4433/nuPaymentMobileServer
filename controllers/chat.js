const { uploadFile } = require("../helpers/tools/fileUploader");
const { Chat } = require("../models/Chat");

// To upload file
const onUploadFile = async (req, res) => {
    try {

        const files = req.files?.files

        const fileUrls = await Chat.createChat({ files })

        return res.status(200).json({ success: true, fileUrls });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, error: error });
    }
}


module.exports = {
    onUploadFile
}