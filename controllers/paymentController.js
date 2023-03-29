const PaymentData = require("../models/paymentSchema");


const paymentListGet = async (req,res) =>{
    try{
        let keywords = req.query;

        if(keywords.id){
            let findData = await PaymentData.find({_id:keywords.id});
            if(findData){
                res.status(200).json({status:true , message :'success' , data:findData });
            }
            else{
                res.status(404).json({status:false , message :'failed'});
            }
        }

        else{
            let findData = await PaymentData.find();
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

const paymentListPost = async (req,res) =>{
    try{
            let {    
                payment_id,
                appointment_info,	
                email, 
                address,	
                amount,	
                date,	
                notes} = req.body;
            if(!appointment_info || !email|| !address|| !amount){
                return res.status(406).json({status:false , message : 'some field are required.'})
            }

            let newPayment = new PaymentData(req.body);
            let savePayment = await newPayment.save();

            if(savePayment){
                res.status(200).json({status:true , message:'success' , data:savePayment });
            }
            else{
                res.status(406).json({status:false , message:'failed'});
            }
            
     
    }
    catch(err){
        return err;
    }
}

module.exports = {paymentListGet,paymentListPost};
