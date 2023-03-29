const CommissionData = require("../models/commissionSchema");



const commissionGet = async (req,res) =>{
    try{
        let keywords = req.query;
        
        if(keywords.id){
            let findData = await CommissionData.find({_id:keywords.id}).populate('doctor_info' , 'first_name last_name');
            if(findData){
                res.status(200).json({status:true , message :'success' , data:findData });
            }
            else{
               res.status(404).json({status:false , message :'failed'});
            }
        }

        else{
            let findData = await CommissionData.find().populate('doctor_info' , 'first_name last_name');
            if(findData){
                let count = findData.length;
                res.status(200).json({status:true , message :'success', total : count  , data:findData });
            }
            else{
                res.status(404).json({status:false , message :'failed'});
            }
        }
    }
    catch(err){
        return err;
    }
}

const commissionPost = async (req,res) =>{
    try{
            let {    
            based_on,
            doctor_info,
            amount,
            status
        
        } = req.body;
            if(!based_on || !doctor_info || !amount){
                return res.status(406).json({status:false , message : 'some field are required.'})
            }

            let findDoctor = await CommissionData.findOne({doctor_info:doctor_info})
            if(findDoctor){
                findDoctor.based_on = based_on || findDoctor.based_on,
                findDoctor.doctor_info = doctor_info || findDoctor.doctor_info,
                findDoctor.amount = amount || findDoctor.amount,
                findDoctor.status = status || findDoctor.status
                await findDoctor.save();
                

                res.status(200).json({status:true , message:'success' , data: findDoctor });
            }

            else{
            let newCommission = new CommissionData(req.body);
            let saveCommission = await newCommission.save();

            if(saveCommission){
                res.status(200).json({status:true , message:'success' , data:saveCommission });
            }
            else{
                res.status(406).json({status:false , message:'failed'});
            }
            }
            
     
    }
    catch(err){
        return err;
    }
}

const commissionDelete = async (req,res) =>{
    try{
        let keywords = req.query;
        if(!keywords.id) return res.status(406).json({status:false , message : `failed: commission id missing`});
            let deleteData = await CommissionData.findByIdAndDelete({_id:keywords.id});
            if(deleteData){
                res.status(200).json({status:true , message:'success'});
            }

            else{
                res.status(406).json({status:false , message:'failed'});
            }
            
     
    }
    catch(err){
        return err;
    }
}


module.exports = {commissionGet,commissionPost,commissionDelete};
