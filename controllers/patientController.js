const deletefile = require("../helper/deletefile");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const randomstring = require('randomstring');
const mailGlobalTemplate = require("../helper/mailController");
const NewPatientData = require("../models/newpatientSchema");


const patientGet = async (req,res) =>{
    try{
        let findData = await NewPatientData.find().select('-password -__v');
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

        let findEmail = await NewPatientData.findOne({email : email});
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
            phone,
            dob,
            gender,
            married_status,
            s_o,
            d_o,
            h_o,
            age,
            address,

            // health_history,
            // allergies,
            // medications,
            // insurance_info,
            // department_info,
            // doctor_info,
            // disease, 
         } = req.body;

      
        if(!phone){
            return res.status(406).json({status:false , message : 'some field are required.'})
        }
        
        if(email){
            email = email.toLowerCase();
            let findEmail = await NewPatientData.findOne({email : email});
            if(findEmail){
                return res.status(404).json({status:false , message:`failed: email already exits, try new email`});
            }
        }

        let findPhone = await NewPatientData.findOne({phone : phone});
        if(findPhone){
            return res.status(404).json({status:false , message:`failed: phone number already exits, try new phone number`});
        }



        let file1;
        if(req.file){
            file1 = process.env.SERVER_FILEUPLOAD_URL+req.file.filename;
        }


        /* uid starts */
        const lastData = await NewPatientData.findOne().sort({ createdAt: -1 });
        const nextId = lastData ? parseInt(lastData.assign_id.substring(3)) + 1 : 1;
        const newId = `VAB${nextId.toString().padStart(3, '0')}`;
        /* uid ends */


        let newPatient = new NewPatientData({
                    assign_id:newId,
                    first_name,
                    last_name,
                    email,
                    phone,
                    dob,
                    gender,
                    profile_image : file1,
                    married_status,
                    s_o,
                    d_o,
                    h_o,
                    address,
                    age,
                    // health_history,
                    // allergies,
                    // medications,
                    // insurance_info, 
                    // department_info,
                    // doctor_info,
                    // disease, 

        });
        await newPatient.save();
        res.status(200).json({status:true , message:'accoutn creation success' , data: newPatient});


}
catch(err){
    return err;
}
}

const patientPut = async (req,res) =>{
    try{
            let keywords = req.query;
            if(!keywords.id) return res.status(406).json({status:false , message : `failed: id missing`});
            let findData = await NewPatientData.findOne({_id:keywords.id });
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
                    let findEmail = await NewPatientData.findOne( {email:req.body.email} );
                    if (findEmail && findEmail.id !== keywords.id) {
                        return res.status(406).json({status:false , message : `failed: email already used.`});
                      }
                      req.body.email = req.body.email.toLowerCase();
                }

                findData.first_name =   req.body.first_name || findData.first_name ;
                findData.last_name =   req.body.last_name  || findData.last_name ;
                findData.email =   req.body.email || findData.email ;
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
                findData.department_info  =  req.body.department_info || findData.department_info;
                findData.doctor_info  =  req.body.doctor_info || findData.doctor_info;
                findData.disease  =  req.body.disease || findData.disease;
                findData.age  =  req.body.age || findData.age;

                await findData.save();
                res.status(200).json({status:true , message:'success' , data: findData});
                              
            }
    }
    catch(err){
        return err;
    }
}


const patientPatch = async (req,res) =>{
    try{
        let keywords = req.query;
        if(!keywords.id) return res.status(406).json({status:false , message : `failed: patient id missing`});

        let findData = await NewPatientData.updateOne({_id: keywords.id } , {
            $set : req.body
        });
        if(!findData){
            return res.status(406).json({status:false , message : `failed: to change`})
        }
        else{
            res.status(200).json({status:true , message:'success'});
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
        let deleteData = await NewPatientData.findByIdAndDelete({_id:keywords.id });
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

        let findData = await NewPatientData.findOne({_id:req.rootID });
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
           let findEmail = await NewPatientData.findOne({email:email});

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
           let findftoken = await NewPatientData.findOne({forget_token:req.body.ftoken});

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

module.exports = {patientGet, patientLogin, patientPost, patientPut,patientPatch, patientDelete,patientPassword,patientForget,patientReset};

