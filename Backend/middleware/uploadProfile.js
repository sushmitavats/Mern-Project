import multer from "multer";
import path from "path";
import fs from "fs";
const profilePath = "uploads/profile";
const chequePath = "uploads/cancelledCheque";
const identityPath = "uploads/identity";
if (!fs.existsSync(profilePath)) {
    fs.mkdirSync(profilePath, { recursive: true });
}
if (!fs.existsSync(chequePath)) {
    fs.mkdirSync(chequePath, { recursive: true });
}
if (!fs.existsSync(identityPath)) {
    fs.mkdirSync(identityPath, { recursive: true });
}
const storage = multer.diskStorage({
    destination(req, file, cb) {
        if (file.fieldname === "profilePhoto") {
            cb(null, profilePath);
        }
        else if (file.fieldname === "cancelledCheque") {
            cb(null, chequePath);
        }
        else if (file.fieldname === "identityDocuments") {
        cb(null, identityPath);
    }
        else {
            cb(new Error("Invalid file field"));
        }
    },
    filename(req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null,Date.now() + "-" +
           Math.round(Math.random() * 1000000) +
            ext);
    }
});
const fileFilter = (req, file, cb) => {
    const allowed = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf"
    ];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only JPG, JPEG, PNG and PDF files are allowed."
            ),
            false
        );
    }
};
export default multer({
    storage,
    fileFilter,
    limits: {
        // 2 MB each file
        fileSize: 2 * 1024 * 1024,
        // Total uploaded files
        files: 13
        // 1 profile + 6 cancelledCheque
    }
});
