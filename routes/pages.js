const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4: uuid4 } = require('uuid');  // we receive here version 4 API's


router.get('/', (req, res)=>{
    res.render('index');
})


const storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null, 'upload/');
    },
    
    filename: (req, file, cb)=>{
        const unique_name = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, unique_name);
    }
});


let upload = multer({
    storage,
    limit: { fileSize: 1000000 * 100 }  // it is 100MB, here we have to give info in bytes.  1MB = 1 Million byte
}).single('FileName');


router.post('/', (req, res) => {
    upload(req, res, async (err)=>{
        console.log(req.body);
        //  1. Validate Request here.
        if(!req.file){
            return res.json({ error: 'All blank should be filled.' });
        }
        if(err){
            return res.status(500).send({ error : err.message });
        }
        
        const file = new File({
            filename: req.file.filename,
            uuid: uuid4(),           // uuid4() generates the unique uuid, and store in databse.
            path: req.file.path,  // this path is we created upper, destination and file gives the path, multer give this.
            size: req.file.size
        })

        const response = await file.save();  
        
        return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}`});
        // download link: https://localhost:3005/files/234ejnrfjn34r-234njrn23efrf
        // res.render('index', {link: `${process.env.APP_BASE_URL}/files/${response.uuid}`});
        
    });
    
    // 4. Send Response  ==>> it contain download link.
})


router.post('/send', async (req, res)=>{
    console.log(req.body);
    const { uuid, senders, receivers } = req.body;
    if(!uuid || !senders || !receivers){
        return res.status(422).send({error : 'All fields are required.'});
    }

try{
        const file = await File.findOne({ uuid: uuid });
        if(file.sender){
            console.log('Email Already exist');
            return res.status(422).send({ error : 'Email is already sent.'});
        }

    file.sender = senders;
    file.receiver = receivers;
    const response = await file.save();

    
    const SendMail = require('../services/email')({
        fron: senders,
        to: receivers,
        sub: 'ShareMe File',
        text: `${senders} sends a File for you.`,
        html: require('../services/mailTemplate')({
            sender: senders,
            shareme: `${process.env.APP_BASE_URL}/`,
            download: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            // pareseInt ==>> to convert decimal into integer.
            size: parseInt(file.size/1000) + ' KB',   // to convert it into KB, 
            expires: '24 Hours'
        })
    }).then(()=>{
        console.log("success");
        return res.json({message:'Successs'});
    }).catch(err=> {
        return res.status(500).json({ error : 'Some error in Email sending'});
    });
    // return res.json({message:'Successs'});
    
}catch(err){
    return res.status(500).json({ error : 'Something went wrong.'});
}

}); 


module.exports = router;