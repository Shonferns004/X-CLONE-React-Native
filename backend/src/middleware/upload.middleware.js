import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith("image/")){
        cb(null, true);
    }else{
        cb(new Error("Invalid file type"), false);
    }
}


const upload = multer({
    storage:storage,
    fileFilter:fileFilter,
    limits:{
        fileSize:1024 * 1024 * 5, // 5MB
    },
});

export default upload;