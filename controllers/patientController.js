const deletefile = require("../helper/deletefile");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const randomstring = require('randomstring');
const mailGlobalTemplate = require("../helper/mailController");
const PatientData = require("../models/patientSchema");

const patientGet = async (req,res) =>{
    try{
        let findData = await PatientData.find().select('-password -__v');
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


const patientLogin = async (req,res) =>{
    try{
        let {email,password} = req.body;

        if(!email || !password)  return res.status(406).json({status:false , message : 'some field are required.'});

        let findEmail = await PatientData.findOne({email : email});
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

const patientPost = async (req,res) =>{
    try{
        let {
            first_name,
            last_name,
            email,
            password,
            cpassword,
            phone,
            health_history,
            dob,
            gender,
            allergies,
            medications,
            insurance_info,
            married_status,
            s_o,
            d_o,
            h_o,
            department,
            disease, 
            address } = req.body;

            email = email.toLowerCase();
        if(!phone){
            return res.status(406).json({status:false , message : 'some field are required.'})
        }
        
        // if(password !== cpassword){
        //     return res.status(400).json({status:false , message:`failed: password & confirm password didn't matched`});
        // }

        else{

            let findPhone = await PatientData.findOne({phone : phone});
            if(findPhone){
                return res.status(404).json({status:false , message:`failed: phone number already exits, try new email`});
            }
            else{


                let file1;
                if(req.file){
                    file1 = process.env.SERVER_FILEUPLOAD_URL+req.file.filename;
                }
                
                // const passwordHash = await bcrypt.hash(password , 10);

                let newPatient = new PatientData({
                    first_name,
                    last_name,
                    email,
                    // password : passwordHash,
                    phone,
                    health_history,
                    dob,
                    gender,
                    allergies,
                    medications,
                    insurance_info, 
                    profile_image : file1,
                    married_status,
                    s_o,
                    d_o,
                    h_o,
                    department,
                    disease, 
                    address
                });

                await newPatient.save();
                res.status(200).json({status:true , message:'accoutn creation success' , data: newPatient});
            }
            
        }
}
catch(err){
    return err;
}
}

const patientPut = async (req,res) =>{
    try{


            let keywords = req.query;
            if(!keywords.id) return res.status(406).json({status:false , message : `failed: id missing`});
            let findData = await PatientData.findOne({_id:keywords.id });
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
                    let findEmail = await PatientData.findOne( {email:req.body.email} );
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
                  findData.health_history =   req.body.health_history  || findData.health_history ;
                  findData.dob =   req.body.dob  || findData.dob ;
                  findData.gender =   req.body.gender  || findData.gender ;
                  findData.allergies =   req.body.allergies  || findData.allergies ;
                  findData.medications =   req.body.medications  || findData.medications ;
                  findData.insurance_info =   req.body.insurance_info || findData.insurance_info ; 
                  findData.profile_image =  file1  || findData.profile_image ;
                  findData.address =   req.body.address  || findData.address ;
                  findData.status =    req.body.status || findData.status;

                  findData.married_status  =  req.body.married_status || findData.married_status;
                  findData.s_o  =  req.body.s_o || findData.s_o;
                  findData.d_o  =  req.body.d_o || findData.d_o;
                  findData.h_o  =  req.body.h_o || findData.h_o;
                  findData.department  =  req.body.department || findData.department;
                  findData.disease  =  req.body.disease || findData.disease;

                  await findData.save();

                  res.status(200).json({status:true , message:'success' , data: findData});
        
                
            }
    }
    catch(err){
        return err;
    }
}

const patientDelete = async (req,res) =>{
    try{
        let keywords = req.query;
        if(!keywords.id) return res.status(406).json({status:false , message : `failed: id missing`});
        let deleteData = await PatientData.findByIdAndDelete({_id:keywords.id });
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

const patientPassword = async (req,res) =>{
    try{

        
        if(!req.body.password || !req.body.cpassword){
            return res.status(406).json({status:false , message : 'some field are required.'})
        }
        if(req.body.password !== req.body.cpassword){
            return res.status(400).json({status:false , message:`failed: password & confirm password didn't matched`});
        }


        let findData = await PatientData.findOne({_id:req.rootID });

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


const patientForget = async (req,res) =>{
    try{
        let {email} = req.body;
       
        if(!email){
            return res.status(400).json({status:false , message:`failed: email is required`});
        }
        else{
           let findEmail = await PatientData.findOne({email:email});

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

const patientReset = async (req,res) =>{
    try{
        if(!req.body.ftoken){
            return res.status(400).json({status:false , message:`failed: ftoken is required`});
        }
        if(!req.body.password){
            return res.status(406).json({status:false , message : 'password field are required.'})
        }

        else{
           let findftoken = await PatientData.findOne({forget_token:req.body.ftoken});

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

module.exports = {patientGet, patientLogin, patientPost, patientPut, patientDelete,patientPassword,patientForget,patientReset};

