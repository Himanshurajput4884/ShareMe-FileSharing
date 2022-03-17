const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');


dotenv.config({ path: './.env'});

const app = express();

app.use(express.urlencoded({ extended:true }));
app.set('view engine', 'hbs');
const publicDirectory = path.join(__dirname, './public');  
app.use(express.static(publicDirectory));  


app.use(express.json());         // now it parse JSON data too.


const connectdb = require('./config/db.js');
const { dirname } = require('path');
connectdb();


// cors
const corsOptions = {
    origin: process.env.ALLOWED_CLIENTS.split(",")
}

//  as it is middleware to use this middleware
app.use(cors(corsOptions));   

// define routes

app.use('/', require('./routes/pages'));
// route to upload file
app.use('/api/files', require('./routes/pages'));
//  route to find uuid in database and return download page.
app.use('/files', require('./routes/show'));
// route to original downlaod file
app.use('/files/download', require('./routes/download.js'));   


const PORT = process.env.PORT || 3005;
app.listen(PORT, ()=>{
    console.log(`Server is stated at Port : ${PORT}`);
});