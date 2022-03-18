const File = require('./models/file');
const fs = require('fs');
const connectDB = require('./config/db');
connectDB();

async function fetchData(){
    const PastDate = new Date(Date.now() - (24*60*60*1000));
    const files = await File.find({ createdAt : { $lt: PastDate }});
    if(files.length){
        for(const file of files){
            try{
                fs.unlinkSync(file.path);
                await file.remove();
                console.log(`Deleted File : ${file.filename}`);
            }catch(err){
                console.log(`Error while deleting files : ${err}`);
            }
        }
        console.log('All Files Deleted.');
    }
}

fetchData().then(() =>{
    process.exit;
})