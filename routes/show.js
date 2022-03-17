const express = require('express');
const router = express.Router();
const File = require('../models/file');

router.get('/:uuid', async (req, res)=>{
    try{
        const file = await File.findOne( {uuid: req.params.uuid} );
        if(!file){
            return res.render('download', { error: 'Link Expired.'});
        }

        return res.render('download', { 
            uuid : file.uuid,
            FileName: file.filename,
            size: parseInt(file.size/1000) + 'KB',
            download: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
            // Download File Link : https://localhost:3005/files/jernfernfkmd-wefjwnekfjnewkjf
         })

    } catch(err){
        return res.render('download', { error : 'Request Failed!' });
    }
})



module.exports = router;