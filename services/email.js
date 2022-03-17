const nodemailer = require('nodemailer');


module.exports = async ({ from, to, sub, text, html })=> {
    
try{
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,

        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });
    transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log("Server is ready to take our messages");
        }
    });
  
    let mailoptions = {
        from: `ShareMe <${from}>`,
        to : to,
        subject: sub,
        text: text,
        html: html        
    }

    await transporter.sendMail(mailoptions, (error, info)=>{
        if(error){
            return console.log(error);
        }
        console.log("Message id : %s", info.messageId);
        console.log('preview : %s', nodemailer.getTestMessageUrl(info));
    });




}catch(err){
        console.log(err);
}
    
}



