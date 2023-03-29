const deletefile = require("../helper/deletefile");
const DoctorData = require("../models/doctorSchema");
const { ExpertiseData } = require("../models/treatmentSchema");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const randomstring = require('randomstring');
const mailGlobalTemplate = require("../helper/mailController");
const renderTemplate = require("../helper/renderMail");
const { MailTemplateData } = require("../models/mailSchema");

const doctorGet = async (req,res) =>{
    try{
        let findData = await DoctorData.find().select('-password -__v');
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


const doctorLogin = async (req,res) =>{
    try{
        let {email,password} = req.body;

        if(!email || !password)  return res.status(406).json({status:false , message : 'failed: some field are required.'});

        let findEmail = await DoctorData.findOne({email : email});
        if(findEmail.status===false)  return res.status(406).json({status:false , message : 'failed: Account Deactived'});

        if(findEmail){
            let hashPassword = await bcrypt.compare(password , findEmail.password);

            if(!hashPassword) return res.status(406).json({status:false , message : `login details didn't matched.`});

            const token = jwt.sign({_id:findEmail._id} , process.env.SECRET_KEY , {expiresIn : '30000s'});
            res.status(200).json({status:true , message :'success' , user_id:findEmail._id , token});
            
        }
        else{
            return res.status(406).json({status:false , message : `failed: login details didn't matched.`});
        }
    }
    catch(err){
        return err;
    }
}

const doctorPost = async (req,res) =>{
    try{
        let {
            first_name,
            last_name,
            email,
            password,
            cpassword,
            phone,
            hospital,
            dob,
            gender,
            bio,

            alternative_number,
            aadhar_number,
            pan_number,
            degree,
            treatments_info, 
            category_info, 
            expertise_info,
            timeslots,
            start_time,
            end_time,
            popular,
            address,
            education
        } = req.body;

        if(!email || !password || !cpassword){
            return res.status(406).json({status:false , message : 'some field are required.'})
        }
        email = email.toLowerCase();
        if(password !== cpassword){
            return res.status(400).json({status:false , message:`failed: password & confirm password didn't matched`});
        }

        else{

            let findEmail = await DoctorData.findOne({email : email});
            if(findEmail){
                return res.status(404).json({status:false , message:`failed: email already exits, try new email`});
            }
            else{


                let file1;
                if(req.file){
                    file1 = process.env.SERVER_FILEUPLOAD_URL+req.file.filename;
                }
                
                const passwordHash = await bcrypt.hash(password , 10);

                const self_token = randomstring.generate();
                const self_expire = new Date().getTime()+300*10000;

                let newDoctor = new DoctorData({

                    first_name,
                    last_name,
                    email,
                    password : passwordHash,
                    phone,
                    hospital,
                    dob,
                    gender,
                    bio,
                    self_token : self_token,
                    self_expire_time : self_expire,
                    alternative_number,
                    aadhar_number,
                    pan_number,
                    degree,
                    treatments_info, 
                    category_info, 
                    expertise_info,
                    timeslots,
                    start_time,
                    end_time,
                    popular,
                    profile_image : file1,
                    address,
                    education
                });

                await newDoctor.save();

            /* ============== mail service starts ==============  */
            const template = await MailTemplateData.findOne({type:'signup'});
            const data = {
                first_name: first_name,
                self_token: self_token,
                self_expire: self_expire,
                update_link: template.redirect_link,
                email:email,
                password:password
            }
            const content = renderTemplate(template.body, data);
            let info = await mailGlobalTemplate({body:content , email:email , subject: template.subject});

      

            /* ============== mail service ends ==============  */
                res.status(200).json({status:true , message:'accoutn creation success' , data: newDoctor , info});
            }
            
        }
}
catch(err){
    return err;
}
}

const doctorPut = async (req,res) =>{
    try{


            let keywords = req.query;



        
            if(keywords.self_token){
                let findData = await DoctorData.findOne({self_token:keywords.self_token });
                if(!findData){
                    return res.status(406).json({status:false , message : `failed: data not found`})
                }
            
                else{

                    const currentTime = new Date().getTime()
                    const expiteTime = findData.self_expire_time;
                    
                    if(currentTime>expiteTime) return res.status(400).json({status:false , message:`failed: token expired`});


                    
                    
                    let file1;
                    if(req.file){
                        file1 = process.env.SERVER_FILEUPLOAD_URL+req.file.filename;
                        if(findData.profile_image){deletefile(findData.profile_image);}
                    }
    
    
                    if(req.body.email){
                        let findEmail = await DoctorData.findOne( {email:req.body.email} );
                        if (findEmail && findEmail.id !== keywords.id) {
                            return res.status(406).json({status:false , message : `failed: email already used.`});
                          }
                          req.body.email = req.body.email.toLowerCase();
                    }
    
    
                    let passwordHash;
                    if(req.body.password){
                      passwordHash = await bcrypt.hash(req.body.password , 10);
                    }

                    findData.first_name =   req.body.first_name || findData.first_name ;
                    findData.last_name =   req.body.last_name  || findData.last_name ;
                    findData.email =   req.body.email || findData.email ;
                    findData.password = passwordHash || findData.password ;
                    findData.phone =   req.body.phone  || findData.phone ;
                    findData.hospital =   req.body.hospital  || findData.hospital ;
                    findData.dob =   req.body.dob  || findData.dob ;
                    findData.gender =   req.body.gender  || findData.gender ;
                    findData.bio =   req.body.bio  || findData.bio ;
                    findData.alternative_number = req.body.alternative_number || findData.alternative_number;
                    findData.aadhar_number = req.body.aadhar_number || findData.aadhar_number;
                    findData.pan_number = req.body.pan_number || findData.pan_number;
    
                    findData.education =   req.body.education  || findData.education ;
                    findData.degree =   req.body.degree  || findData.degree ;
                    findData.treatments_info =   req.body.treatments_info || findData.treatments_info ; 
                    findData.category_info =   req.body.category_info || findData.category_info ; 
                    findData.expertise_info =   req.body.expertise_info || findData.expertise_info ;
                    findData.timeslots =   req.body.timeslots  || findData.timeslots ;
                    
                    findData.start_time =   req.body.start_time  || findData.start_time ;
                    findData.end_time =   req.body.end_time  || findData.end_time ;
                    findData.popular =   req.body.popular  || findData.popular ;
                    findData.profile_image =  file1  || findData.profile_image ;
                    findData.address =   req.body.address  || findData.address ;

                      findData.self_token = null;
                      findData.self_expire_time = null;

                    console.log('stage 03' , findData)
                      await findData.save();
                      
                      res.status(200).json({status:true , message:'success' , data: findData});
            
                                                                                                                                                                                                                                                                                                                                                                                   
                }
            }
            else{
        
        

            let findData = await DoctorData.findOne({_id:keywords.id });

            // console.log( '============== test entry 02 ============== ' , findData)

            if(!findData){
                return res.status(406).json({status:false , message : `failed: data not found`})
            }
            else{
                let file1;
                if(req.file){
                    file1 = process.env.SERVER_FILEUPLOAD_URL+req.file.filename;
                    if(findData.profile_image){deletefile(findData.profile_image);}
                }


                if(req.body.email){
                    let findEmail = await DoctorData.findOne( {email:req.body.email} );
                    if (findEmail && findEmail.id !== keywords.id) {
                        return res.status(406).json({status:false , message : `failed: email already used.`});
                      }
                      req.body.email = req.body.email.toLowerCase();
                }


                  let passwordHash;
                  if(req.body.password){
                    passwordHash = await bcrypt.hash(req.body.password , 10);
                  }

                  

                  findData.first_name =   req.body.first_name || findData.first_name ;
                  findData.last_name =   req.body.last_name  || findData.last_name ;
                  findData.email =   req.body.email  || findData.email ;
                  findData.password = passwordHash || findData.password ;
                  findData.phone =   req.body.phone  || findData.phone ;
                  findData.hospital =   req.body.hospital  || findData.hospital ;
                  findData.dob =   req.body.dob  || findData.dob ;
                  findData.gender =   req.body.gender  || findData.gender ;
                  findData.bio =   req.body.bio  || findData.bio ;
                  findData.alternative_number = req.body.alternative_number || findData.alternative_number;
                  findData.aadhar_number = req.body.aadhar_number || findData.aadhar_number;
                  findData.pan_number = req.body.pan_number || findData.pan_number;


                //   findData.degree =   req.body.degree  || findData.degree ;
                  findData.treatments_info =   req.body.treatments_info || findData.treatments_info ; 
                  findData.category_info =   req.body.category_info || findData.category_info ; 
                  findData.expertise_info =   req.body.expertise_info || findData.expertise_info ;
                  findData.timeslots =   req.body.timeslots  || findData.timeslots ;


                  findData.education =   req.body.education  || findData.education ;


                  findData.start_time =   req.body.start_time  || findData.start_time ;
                  findData.end_time =   req.body.end_time  || findData.end_time ;
                  findData.popular =   req.body.popular  || findData.popular ;
                  findData.profile_image =  file1  || findData.profile_image ;
                  findData.address =   req.body.address  || findData.address ;
                  findData.status =    req.body.status || findData.status;
                  await findData.save();

                  res.status(200).json({status:true , message:'success' , data: findData});
        
                
            }
        }
    }
    catch(err){
        return err;
    }
}

const doctorDelete = async (req,res) =>{
    try{
        let keywords = req.query;
        let deleteData = await DoctorData.findByIdAndDelete({_id:keywords.id });
        if(!deleteData){
            return res.status(406).json({status:false , message : `failed: data not found`})
        }
        else{
            res.status(200).json({status:true , message:'success'});
        }
}
    catch(err){
        return err;
    }
}

const doctorPassword = async (req,res) =>{
    try{

        
        if(!req.body.password || !req.body.cpassword){
            return res.status(406).json({status:false , message : 'some field are required.'})
        }
        if(req.body.password !== req.body.cpassword){
            return res.status(400).json({status:false , message:`failed: password & confirm password didn't matched`});
        }


        let findData = await DoctorData.findOne({_id:req.rootID });

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


const doctorForget = async (req,res) =>{
    try{
        let {email} = req.body;
       
        if(!email){
            return res.status(400).json({status:false , message:`failed: email is required`});
        }
        else{
           let findEmail = await DoctorData.findOne({email:email});

           if(!findEmail){
            return res.status(400).json({status:false , message:`failed: email not found`});
           }
           else{
            const forget_token = randomstring.generate();
            const ftoken_expire = new Date().getTime()+300*1000;
            findEmail.forget_token  = forget_token;
            findEmail.ftoken_expire  = ftoken_expire;
            await findEmail.save();


            let info = await mailGlobalTemplate({type: 'forgetpassword', email : findEmail.email , subject: 'Forget Password Request.' , forget_token , ftoken_expire});
            return res.status(200).json({status:true , message:'success' , data: `email found` , mail_status : info});
           }
        }
    }
    catch(err){
        return err;
    }
}

const doctorReset = async (req,res) =>{
    try{
        if(!req.body.ftoken){
            return res.status(400).json({status:false , message:`failed: ftoken is required`});
        }
        if(!req.body.password){
            return res.status(406).json({status:false , message : 'password field are required.'})
        }

        else{
           let findftoken = await DoctorData.findOne({forget_token:req.body.ftoken});

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

module.exports = {doctorGet, doctorLogin, doctorPost, doctorPut, doctorDelete,doctorPassword,doctorForget,doctorReset};

