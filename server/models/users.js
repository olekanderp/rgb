const mongoose = require('mongoose');
const {Schema} = require("mongoose");
const usersData = new mongoose.Schema({
    name: String,
    files: [{ type: Schema.Types.ObjectId, ref: 'File' }]
});

const Users = mongoose.model('Users', usersData);

module.exports = Users;