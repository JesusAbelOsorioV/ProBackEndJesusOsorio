import multer from "multer";
import fs from 'fs';
import path from "path";
import { __dirname } from "../utils.js";

const folders = {
    profile: 'profiles',
    products: 'products',
    documents: 'documen'
};

const ensureDirectoryExists = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const folder = folders[file.fieldname];
        const uploadFolder = `src/public/uploadsFiles/${req.params.uid}/${folder}`;
        
        ensureDirectoryExists(uploadFolder);

        callback(null, uploadFolder);
    },
    filename: (req, file, callback) => {
        
        const suffix = req.body.suffix ? `-${req.body.suffix}` : '';
        logger.info('Suffix received:', suffix); // Debugging line
        const fileExtension = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, fileExtension);
        const uniqueFilename = `${Date.now()}-${baseName}${suffix}${fileExtension}`;
        callback(null, uniqueFilename);
    },
});

export const uploader = multer({
    storage,
    onError: (err, next) => {
        logger.error('Multer Error:', err);
        next(err);
    }
}).fields([
    { name: 'profile' },
    { name: 'products' },
    { name: 'documents' }
]);
