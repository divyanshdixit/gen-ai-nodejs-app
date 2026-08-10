const fileFilter = (req, file, cb) => {

    if (file.mimetype === "application/pdf") {

        cb(null, true);

    } else {

        cb(new Error("Only PDF files are allowed."));
    }
};

module.exports = fileFilter;