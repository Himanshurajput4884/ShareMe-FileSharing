const mongoose = require('mongoose');

const schema = mongoose.Schema;
const fileSchema = new schema({
    filename : { type: String, required: true},    // name of file in database.
    path : { type: String, required: true},      // path, where the file  is stored.
    size : { type: Number, required: true},      
    uuid : { type: String, required: true},    // it is generated during storing of data in database.      
    sender : { type: String, required: false },       // sender email, optional
    receiver : { type: String, required: false} 
}, { timestamps: true });



module.exports = mongoose.model('File', fileSchema);
// Our model is 'File' and in database model will be 'Files'.



