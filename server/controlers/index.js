const Users = require('../models/users');
const File = require('../models/files');
const { PDFDocument } = require('pdf-lib');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Максимальний розмір файлу - 5 МБ
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only .pdf files are allowed!'));
        }
    }
}).single('file');



exports.getAllUsers = async (req, res) => {
    try {
        const users = await Users.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching song' });
    }
};

exports.getAllFiles = async (req, res) => {
    try {
        const files = await File.find();
        let infoRes = []
        for (let item of files){
            let info = await getPDFInfo(item.path)
            info.name = item.name
            info.id = item._id
            infoRes.push(info)
        }

        res.status(200).json(infoRes);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.uploadFile = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        const filePath = path.join(__dirname, '../' + process.env.APP_DIR_FILE, req.file.originalname);

        fs.writeFile(filePath, req.file.buffer, async (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving file' });
            }
            try {
                const userId = req.body.userId;
                const file = new File({
                    name: req.file.originalname,
                    path: filePath,
                    uploadedBy: userId
                });
                let savedFile = await file.save();
                const user = await Users.findById(userId);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                user.files.push(savedFile._id);
                await user.save();
                res.status(200).json({ message: 'File uploaded and linked to user successfully', data: savedFile });
            }catch (e) {
                res.status(201).json({status: 500, msg: e});
            }
        });
    });
};


exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await Users.findById(userId).populate('files');  // Включення даних про файли

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getFileById = async (req, res) => {
    try {
        const fileId = req.params.id;
        const file = await File.findById(fileId).populate('uploadedBy'); // Включення даних про користувача
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }
        res.status(200).json(file);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const {name} = req.body;
        const newUser = new Users({name, files: []});
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


async function getPDFInfo(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error('File does not exist');
    }

    const fileBuffer = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(fileBuffer);
    const title = pdfDoc.getTitle() || path.basename(filePath);
    const numberOfPages = pdfDoc.getPageCount();
    const fileSize = fs.statSync(filePath).size;
    const format = path.extname(filePath);

    return {
        title,
        numberOfPages,
        fileSize,
        format
    };
}