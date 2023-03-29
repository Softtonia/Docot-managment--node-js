const { default: mongoose } = require("mongoose");
const renderTemplate = require("../helper/renderMail");
const {MailTemplateData } = require("../models/mailSchema");
const ReviewData = require("../models/reviewsSchema");



const emailTemplateGet = async (req,res) =>{
    try{
        let keywords = req.query;
        if(!keywords.type) return res.status(406).json({status:false , message : `failed: email type missing`});

        let findTemplate = await MailTemplateData.find({type:keywords.type}).select('-__v -_id');
                res.status(200).json({status:true , message:'success', data:findTemplate});


        
        // switch (keywords.type) {
        //         case 'notification':

        //         let findTemplate01 = await MailTemplateData.find({type:keywords.type}).select('-__v -_id');
        //         res.status(200).json({status:true , message:'success', data:findTemplate01});
                
        //         break;


        //         case 'forgetpassword':
        //             let findTemplate02 = await MailTemplateData.find({type:keywords.type}).select('-__v -_id');
        //             res.status(200).json({status:true , message:'success', data:findTemplate02});
                
        //         break;

        //         case 'signup':
        //             let findTemplate03 = await MailTemplateData.find({type:keywords.type}).select('-__v -_id');
        //             res.status(200).json({status:true , message:'success', data:findTemplate03});
                
        //         break;

        //         case 'otp':
        //             let findTemplate04 = await MailTemplateData.find({type:keywords.type}).select('-__v -_id');
        //             res.status(200).json({status:true , message:'success', data:findTemplate04});
                
        //         break;

        //         case 'offer':
        //             let findTemplate05 = await MailTemplateData.find({type:keywords.type}).select('-__v -_id');
        //             res.status(200).json({status:true , message:'success', data:findTemplate05});
                
        //         break;

        //         case 'subscription':
        //             let findTemplate06 = await MailTemplateData.find({type:keywords.type}).select('-__v -_id');
        //             res.status(200).json({status:true , message:'success', data:findTemplate06});
                
        //         break;

        //         case 'letterpad':
        //             let findTemplate07 = await MailTemplateData.find({type:keywords.type}).select('-__v -_id');
        //             res.status(200).json({status:true , message:'success', data:findTemplate07});
                
        //         break;

        //         case 'invoice':
        //             let findTemplate08 = await MailTemplateData.find({type:keywords.type}).select('-__v -_id');
        //             res.status(200).json({status:true , message:'success', data:findTemplate08});
                
        //         break;
        
        //     default:
        //         res.status(406).json({status:true , message:'failed: email type error'});
        //         break;
        // }

        
    }
    catch(err){
        return err;
    }
}

const emailTemplatePost = async (req,res) =>{
    try{
        let keywords = req.query;
        if(!keywords.type) return res.status(406).json({status:false , message : `failed: email type missing`});
        
        let findTemplate = await MailTemplateData.findOne({type:keywords.type});
        if(findTemplate){
            findTemplate.subject = req.body.subject || findTemplate.subject;
            findTemplate.body = req.body.body || findTemplate.body;
            findTemplate.redirect_link = req.body.redirect_link || findTemplate.redirect_link;
            await findTemplate.save();
            res.status(200).json({status:true , message:'success', data:findTemplate});
        }
        else{
            let newTemplate = new MailTemplateData({
                type: keywords.type,
                subject : req.body.subject,
                body : req.body.body,
                reset_link : req.body.reset_link,
            })
            await newTemplate.save();
            res.status(200).json({status:true , message:'success', data:newTemplate});
        }

        
    }
    catch(err){
        return err;
    }
}


const emailTemplateTest = async (req,res) =>{
    try{
        const data = {
            first_name: 'Rahul',
            message: 'ok test message'
        }

        const template = await NotifyMailTemplateData.findOne({type:keywords.type});
        const content = renderTemplate(template.body, data);

        res.status(200).json({status:true , message:'success', data:content});
        
    }
    catch(err){
        return err;
    }
}



// function renderTemplate(template, data) {
//     for (let key in data) {
//       const pattern = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
//       template = template.replace(pattern, data[key]);
//     }
//     return template;
//   }



module.exports = {emailTemplateGet,emailTemplatePost,emailTemplateTest};

