const fs = require('fs').promises;
const { unlink } = fs;
const path = require('path');

const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const cloudinary = require('cloudinary').v2

async function minifyImages(req, res, next) {
    const { user, file } = req;

    try {
        const files = await imagemin([`tmp/${file.filename}`], {
            destination: 'public/images',
            plugins: [
                imageminJpegtran(),
            ]
        })
        const [ava] = files;

        await cloudinary.uploader.upload(ava.destinationPath, function (error, result) {
            user.avatarURL = result.secure_url;
            req.user = user;
        });

        await unlink(req.file.path);
        await unlink(path.join(__dirname, `/../public/images/${file.filename}`))
        
        next();
    } catch (err) {
        return res.status(500).json(err);
    }
}

module.exports = minifyImages