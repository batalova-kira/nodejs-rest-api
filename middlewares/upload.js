import multer from "multer";
import path from "path";
import { HttpError } from "../helpers";

const destination = path.resolve("temp");
const storage = multer.diskStorage({
    destination,
});

const limits = {
    fileSize: 1024 * 1024 * 5,
};

const fileFilter = (req, file, callback) => {
    const extension = req.originalname.split(".").pop();
    if (extension === "exe") {
        callback(HttpError(400, ".exe not valid extension"));
    }
};

const upload = multer({
    storage,
    limits,
    // fileFilter,
});

export default upload;