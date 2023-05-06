const AdminData = require("../models/adminSchema");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const randomstring = require('randomstring');
const mailGlobalTemplate = require("../helper/mailController");
const renderTemplate = require("../helper/renderMail");
const {MailTemplateData } = require("../models/mailSchema");
const DoctorData = require("../models/doctorSchema");
const deletefile = require("../helper/deletefile");





const adminLogin = async (req,res) =>{
    try{
        let {email,password} = req.body;

        if(!email || !password)  return res.status(406).json({status:false , message : 'some field are required.'});

        let findEmail = await AdminData.findOne({email : email});
        if(findEmail){
            let hashPassword = await bcrypt.compare(password , findEmail.password);

            if(!hashPassword) return res.status(406).json({status:false , message : `login details didn't matched.`});

            const token = jwt.sign({_id:findEmail._id} , process.env.SECRET_KEY , {expiresIn : '30000s'});
            res.status(200).json({status:true , message :'success' , user_id:findEmail._id , token});
        }
        else{
            return res.status(406).json({status:false , message : `login details didn't matched.`});
        }
    }
    catch(err){
        return err;
    }
}

const adminGet = async (req,res) =>{
    try{

        
        let findData = await AdminData.find().select('-password -__v');
        if(findData){
            let count = findData.length;
            res.status(200).json({status:true , message :'success', total_user : count  , data:findData });
        }
        else{
            res.status(404).json({status:false , message :'failed'});
        }
    }
    catch(err){
        return err;
    }
}

const adminProfile = async (req,res) =>{
    try{

        
        let findData = await AdminData.findOne({_id:req.rootID}).select('-password -__v');
        if(findData){
            let count = findData.length;
            res.status(200).json({status:true , message :'success', total_user : count  , data:findData });
        }
        else{
            res.status(404).json({status:false , message :'failed'});
        }
    }
    catch(err){
        return err;
    }
}

const adminRegister = async (req,res) =>{
    try{
            let {first_name,last_name,email,password,cpassword,address,phone,department,tax,fax,alternative_number,hospital} = req.body;

            if(!email || !password || !cpassword){
                return res.status(406).json({status:false , message : 'some field are required.'})
            }

            email = email.toLowerCase();

            if(password !== cpassword){
                return res.status(400).json({status:false , message:`failed: password & confirm password didn't matched`});
            }
    
            else{
    
                let findEmail = await AdminData.findOne({email : email});
                if(findEmail){
                    return res.status(404).json({status:false , message:`failed: email already exits, try new email`});
                }
                else{
    
                    const passwordHash = await bcrypt.hash(password , 10);
                    let newAdmin = new AdminData({
                        first_name,last_name,email,password:passwordHash,phone,address,department,tax,fax,alternative_number,hospital
                    });

                    await newAdmin.save();
                    res.status(200).json({status:true , message:'accoutn creation success' , data: newAdmin});
                }
                
            }
    }
    catch(err){
        return err;
    }
}


const adminUpdate = async (req,res) =>{
    try{

            let keywords = req.query;
            let findData = await AdminData.findOne({_id:keywords.id });
            if(!findData){
                return res.status(406).json({status:false , message : `failed: data not found`})
            }
            else{
                let file1;

                console.log(file1, 'else ene point 00')


                if(req.file){
                    file1 = process.env.SERVER_FILEUPLOAD_URL+req.file.filename;
                    if(findData.profile_image){deletefile(findData.profile_image);}
                }
                console.log(file1, 'ckeck point 00')

                if(req.body.email){
                    let findEmail = await AdminData.findOne( {email:req.body.email} );
                    if (findEmail && findEmail.id !== keywords.id) {
                        return res.status(406).json({status:false , message : `failed: email already used.`});
                      }
                      req.body.email = req.body.email.toLowerCase();
                }
                  
                  let  passwordHash ;
                  if(req.body.password){
                    passwordHash = await bcrypt.hash(req.body.password , 10);
                  }


                  console.log(req.body,file1, 'ckeck point 01')
                  findData.first_name =   req.body.first_name || findData.first_name ;
                  findData.last_name =   req.body.last_name  || findData.last_name ;
                  findData.email =   req.body.email  || findData.email ;
                  findData.password = passwordHash || findData.password ;
                  findData.phone =   req.body.phone  || findData.phone ;
                  findData.profile_image =  file1  || findData.profile_image ;
                  findData.address =   req.body.address  || findData.address ;
                  findData.status =    req.body.status || findData.status ;
                  findData.department =    req.body.department || findData.department ;

                  findData.district  =   req.body.district || findData.district ;
                  findData.state  =   req.body.state || findData.state ;
                  findData.country  =   req.body.country || findData.country ;
                  findData.pincode  =   req.body.pincode || findData.pincode ;
                  findData.gst  =   req.body.gst || findData.gst ;
                  findData.tax  =   req.body.tax || findData.tax ;

                  findData.fax  =   req.body.fax || findData.fax ;
                  findData.alternative_number  =   req.body.alternative_number || findData.alternative_number ;
                  findData.hospital  =   req.body.hospital || findData.hospital ;


                  await findData.save();
                  res.status(200).json({status:true , message:'success' , data: findData});
            }
    }
    catch(err){
        return err;
    }
}


const adminPassword = async (req,res) =>{
    try{

        if(!req.body.password || !req.body.cpassword){
            return res.status(406).json({status:false , message : 'some field are required.'})
        }
        if(req.body.password !== req.body.cpassword){
            return res.status(400).json({status:false , message:`failed: password & confirm password didn't matched`});
        }

        let findData = await AdminData.findOne({_id:req.rootID });
        if(!findData){
            return res.status(406).json({status:false , message : `failed: data not found`})
        }

        else{
              let passwordHash;
              if(req.body.password){
                passwordHash = await bcrypt.hash(req.body.password , 10);
              }
             
              findData.password = passwordHash || findData.password ;
              await findData.save();

              res.status(200).json({status:true , message:'success' , data: findData});
    
            
        }
}
    catch(err){
        return err;
    }
}

const adminForget = async (req,res) =>{
    try{
        let {email} = req.body;
       
        if(!email){
            return res.status(400).json({status:false , message:`failed: email is required`});
        }
        else{
           let findEmail = await AdminData.findOne({email:email});

           if(!findEmail){
            return res.status(400).json({status:false , message:`failed: email not found`});
           }
           else{
            const forget_token = randomstring.generate();
            const ftoken_expire = new Date().getTime()+300*1000;
            findEmail.forget_token  = forget_token;
            findEmail.ftoken_expire  = ftoken_expire;
            await findEmail.save();

            /* ============== mail service starts ==============  */
            // const template = await ForgetPasswordMailTemplateData.findOne();
            const template = await MailTemplateData.findOne({type:'forgetpassword'});
            const data = {
                first_name: findEmail.first_name,
                forget_token: forget_token,
                ftoken_expire: ftoken_expire,
                redirect_link: template.redirect_link
            }
            const content = renderTemplate(template.body, data);


            let info = await mailGlobalTemplate({body:content , email : findEmail.email , subject: template.subject});

            /* ============== mail service ends ==============  */
            return res.status(200).json({status:true , message:'success' , data: `email found` , mail_status : info});
           }
        }
    }
    catch(err){
        return err;
    }
}

const adminReset = async (req,res) =>{
    try{
        if(!req.body.ftoken){
            return res.status(400).json({status:false , message:`failed: ftoken is required`});
        }
        if(!req.body.password || !req.body.cpassword){
            return res.status(406).json({status:false , message : 'password field are required.'})
        }

        if(req.body.password !== req.body.cpassword){
            return res.status(406).json({status:false , message : 'password & confirm password dosenot match'})
        }

        else{
           let findftoken = await AdminData.findOne({forget_token:req.body.ftoken});

           if(!findftoken){
            return res.status(400).json({status:false , message:`failed: reset token not found`});
           }
           else{
            const currentTime = new Date().getTime()
            const expiteTime = findftoken.ftoken_expire;
            if(currentTime>expiteTime) return res.status(400).json({status:false , message:`failed: forget password token expired`});


            findftoken.forget_token  = null;
            findftoken.ftoken_expire  = null;
            let passwordHash = await bcrypt.hash(req.body.password , 10);
            findftoken.password = passwordHash || findftoken.password ;
            await findftoken.save();
            
            return res.status(200).json({status:true , message:'success: password reset.'});
           }
        }
    }
    catch(err){
        return err;
    }
}



const adminDoctorUpdate = async (req,res) =>{
    try{

        console.log(req.body , 'bb')

        let keywords = req.query;
        if(!keywords.id) return res.status(406).json({status:false , message : `failed: doctor id missing`});

    

        let findDoctor = await DoctorData.findOneAndUpdate({_id:keywords.id}, 
           { $set : req.body}
            );

        if(!findDoctor) return res.status(400).json({status:false , message:`failed: doctor not found`});
   
        else{
            // let passwordHash;
            // if(req.body.password){
            //    passwordHash = await bcrypt.hash(req.body.password , 10);
            // }

            
        


            // findDoctor.status = req.body.status || findDoctor.status;
            // findDoctor.password = passwordHash || findDoctor.password;

            
            // await findDoctor.save(); 
            // console.log('entder 01' ,findDoctor )
            
            res.status(200).json({status:true , message:'success: user updated.' , data: findDoctor});
        
        }
    }
    catch(err){
        return err;
    }
}

module.exports = {adminLogin,adminRegister,adminGet,adminUpdate,adminPassword,adminForget,adminReset,adminDoctorUpdate,adminProfile}