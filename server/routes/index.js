const express = require('express');
const router = express.Router();
const controlers = require('../controlers/index');
const pathUser = 'users'

router.get(`/${pathUser}`, controlers.getAllUsers);
router.get(`/${pathUser}/:id`, controlers.getUserById);
router.post(`/${pathUser}`, controlers.createUser);


const pathFiles= 'fiels'

router.get(`/${pathFiles}`, controlers.getAllFiles);
router.get(`/${pathFiles}/:id`, controlers.getFileById);
router.post(`/${pathFiles}`, controlers.uploadFile);

module.exports = router;