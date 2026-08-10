const multer = require("multer");
const fileFilter = require("../utils/fileValidation");

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {

        const uniqueName =
           file.originalname + "-" + Date.now();

        cb(null, uniqueName);
    }
});

// upload middleware
const upload = multer({ storage, fileFilter });

module.exports = upload;