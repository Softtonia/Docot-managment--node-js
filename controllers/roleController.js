const AdminData = require("../models/adminSchema");
const RoleData = require("../models/roleSchema");

const roleGet = async (req,res) =>{
    try{
        let keywords = req.query;

        if(keywords.id){
            const findData = await RoleData.findById({_id:keywords.id});
            if(findData){
                res.status(200).json({status:true , message :'success' , data:findData });
            }
            else{
               res.status(404).json({status:false , message :'failed'});
            }
        }
        else{
            const findData = await RoleData.find();
            if(findData){
                res.status(200).json({status:true , message :'success', total : findData.length , data:findData });
            }
            else{
               res.status(404).json({status:false , message :'failed'});
            }
        }
    }
    catch(err){
             return err
    }
}

const rolePost = async (req,res) =>{
    try{
        let keywords = req.query;

        if(keywords.id || keywords.name || req.body.role_name ){
            req.body.role_name = req.body.role_name.toLowerCase();
            const findData = await RoleData.findOne({
                "$or" :[ {_id:keywords.id},{role_name: keywords.name},{role_name: req.body.role_name}]
            });
            if(findData){
                findData.role_name = req.body.role_name || findData.role_name;
                findData.admin = req.body.admin || findData.admin;
                findData.appointment = req.body.appointment || findData.appointment;
                findData.category = req.body.category || findData.category;
                findData.experts = req.body.experts || findData.experts;
                findData.email_template = req.body.email_template || findData.email_template;
                findData.doctor = req.body.doctor || findData.doctor;
                findData.commission = req.body.commission || findData.commission;
                findData.role = req.body.role || findData.role;
                findData.payment = req.body.payment || findData.payment;
                findData.treatment = req.body.treatment || findData.treatment;
                findData.settings = req.body.settings || findData.settings;
                await findData.save();
                res.status(200).json({status:true , message :'success' , data:findData });
            }
            else{
                const findData = new RoleData(req.body);
                let saveData = await findData.save();
    
                if(saveData){
                    res.status(200).json({status:true , message :'success' , data:saveData });
                }
                else{
                   res.status(404).json({status:false , message :'failed'});
                }
            }
        }
        else{
            return res.status(404).json({status:false , message :`failed: role name is required`});
         }
      
    }
    catch(err){
             return err
    }
}


const roleDelete = async (req,res) =>{
    try{
        let keywords = req.query;
        if(!keywords.id) return res.status(400).json({status:false, message: `failed: id is missing`});
        
        let findData = await RoleData.findByIdAndDelete({_id:keywords.id});
        if(!findData) return res.status(406).json({status:false, message: `failed: failed to delete`});

        res.status(200).json({status:true, message: `success: deleted`});
    }
    catch(err){
        return err
    }
}


const roleAssign = async (req,res) =>{
    try{
        let keywords = req.query;
        if(!keywords.id || !req.body.role_id) return res.status(400).json({status:false, message: `failed: user id is missing`});
        
        let findData = await AdminData.findById({_id:keywords.id});
        if(!findData) return res.status(406).json({status:false, message: `failed: data not found`});

        findData.role_info = req.body.role_id;
        await findData.save();

        res.status(200).json({status:true, message: `success: role added.`});
    }
    catch(err){
        return err
    }
}


module.exports = {roleGet,rolePost,roleDelete,roleAssign}