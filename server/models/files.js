const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    name: String,
    path: String,
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'Users' }
});

const File = mongoose.model('File', fileSchema);

module.exports = File;