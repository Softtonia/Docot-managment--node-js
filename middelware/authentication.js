
const jwt = require('jsonwebtoken');
const AdminData = require('../models/adminSchema');
const DoctorData = require('../models/doctorSchema');
const PatientData = require('../models/patientSchema');


const authentication = async (req,res,next) =>{
    try{


        const token = req.headers['auth-token'];

        const verifyToken = jwt.verify(token , process.env.SECRET_KEY);

        if(verifyToken){
            const findAdmin = await AdminData.findById({_id:verifyToken._id}).select('-password -tokens -__v');
            if(findAdmin.super_admin===true || findAdmin.account_type==='admin'){

                
                let account_role = null;
                // if(findAdmin.role){
                //     const findroles = await RoleData.findById({_id:findAdmin.role}).select(' -__v');
                //     account_role = findroles;
                // }

                req.rootID = verifyToken._id;
                req.rootUser = findAdmin;
                req.token = token;
                req.roles = account_role;
                req.super_admin = findAdmin.super_admin;


            }
            else{
                return res.status(404).json({status:false , message:'failed: account type is not set to admin '});
            }
        }
        else{
            return res.status(404).json({status:false , message:'failed: token verification '});
        }

        next();
    }
    catch(err){
        return res.status(406).json({status:false , message:`failed :${err.name}` , token_error: err});
    }
}


const doctor_authentication = async (req,res,next) =>{
    try{


        const token = req.headers['auth-token'];

        const verifyToken = jwt.verify(token , process.env.SECRET_KEY);

        if(verifyToken){
            const findAdmin = await DoctorData.findById({_id:verifyToken._id}).select('-password -tokens -__v');


            if(findAdmin){

                req.rootID = verifyToken._id;
                req.rootUser = findAdmin;
                req.token = token;
            }
            else{
                return res.status(404).json({status:false , message:'failed: account did not found '});
            }
        }
        else{
            return res.status(404).json({status:false , message:'failed: token verification '});
        }

        next();
    }
    catch(err){
        return res.status(406).json({status:false , message:`failed :${err.name}` , token_error: err});
    }
}

const patient_authentication = async (req,res,next) =>{
    try{


        const token = req.headers['auth-token'];

        const verifyToken = jwt.verify(token , process.env.SECRET_KEY);

        if(verifyToken){
            const findAdmin = await PatientData.findById({_id:verifyToken._id}).select('-password -tokens -__v');


            if(findAdmin){

                req.rootID = verifyToken._id;
                req.rootUser = findAdmin;
                req.token = token;
            }
            else{
                return res.status(404).json({status:false , message:'failed: account did not found '});
            }
        }
        else{
            return res.status(404).json({status:false , message:'failed: token verification '});
        }

        next();
    }
    catch(err){
        return res.status(406).json({status:false , message:`failed :${err.name}` , token_error: err});
    }
}


module.exports = {authentication,doctor_authentication,patient_authentication};

