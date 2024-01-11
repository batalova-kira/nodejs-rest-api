import multer from "multer";
import path from "path";
// import { HttpError } from "../helpers/index.js";

//абсолютний шлях до файлу
const destination = path.resolve("temp");

const storage = multer.diskStorage({
    destination,
    filename: (req, file, callback) => {
        const uniquePerffix = `${Date.now()}_${Math.round(
            Math.random() * 1e9
        )}`;
        const filename = `${uniquePerffix}_${file.originalname}`;
        callback(null, filename);
    },
});

//обмеження розміру файла
const limits = {
    fileSize: 1024 * 1024 * 5,
};

// const fileFilter = (req, file, callback) => {
//     const extension = req.originalname.split(".").pop();
//     if (extension === "exe") {
//         callback(HttpError(400, ".exe not valid extension"));
//     }
// };

const upload = multer({
    storage,
    limits,
    // fileFilter,
});

export default upload;
