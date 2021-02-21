const path = require('path');
const fs = require('fs').promises;

const multer = require('multer'); 

const { access, mkdir } = fs;

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        const dir = path.join(__dirname, '../tmp');
        
        try {
            await access(dir);
            cb(null, './tmp');
        } catch (err) {
            try {
                await mkdir(dir, { recursive: true });
                cb(null, './tmp');
            } catch (err) {
                throw err
            }
        }        
    },
    filename: function (req, file, cb) {
        let { ext } = path.parse(file.originalname);    
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
    
})

const limits = {
    fileSize: 1E6
}

const fileFilter = (req, file, cb) => {
    if (file.mimetype !== 'image/jpeg') {
        cb(null, false);
    } else {
        cb(null, true);
    }
}

const upload = multer({
    storage,
    limits,
    fileFilter
})
module.exports = upload