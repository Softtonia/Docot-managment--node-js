const nodemailer = require('nodemailer');

const mailGlobalTemplate = async (props) =>{
    try{

      console.log(props , 'email template 001')

        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: true, 
            auth: {
              user: process.env.MAIL_ID,
              pass: process.env.MAIL_PASS,
            },
          });
        
          // send mail with defined transport object
          let info = await transporter.sendMail({
            from: ` "${process.env.MAIL_NAME}" ${process.env.MAIL_ID}`, 
            to: props.email, 
            subject: props.subject, 
            text: props.subject, 
            html: props.body,
          });
        
          return info
    }
    catch(err){
        console.log(err)
    }
}


module.exports = mailGlobalTemplate;