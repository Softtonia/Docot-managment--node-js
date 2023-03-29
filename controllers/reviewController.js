const { default: mongoose } = require("mongoose");
const ReviewData = require("../models/reviewsSchema");



const reviewGet = async (req,res) =>{
    try{
        let keywords = req.query;
        if(keywords.doctor_info){
            
            let findData = await ReviewData.find({doctor_info:keywords.doctor_info}).select('-__v -doctor_info').populate('patient_info' , 'first_name last_name')

            if(findData){
                let avg=0;
                for(let i=0; i<findData.length; i++){
                    avg = avg+findData[i].review_star;
                }
                
                let count = findData.length;
                res.status(200).json({status:true , message :'success', total : count , avrage_star: Number((avg/count).toFixed(1)) , data:findData });
            }
            else{
                res.status(404).json({status:false , message :'failed'});
            }


        }

        else{
     
            let findData = await ReviewData.find().select('-__v').populate('doctor_info' , 'first_name last_name').populate('patient_info' , 'first_name last_name');
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

const reviewPost = async (req,res) =>{
    try{
            let {doctor_info,review_star,review_discription} = req.body;
            if(!doctor_info || !review_star){
                return res.status(406).json({status:false , message : 'some field are required.'})
            }

            let findExistingReview = await ReviewData.findOne({
                "$and" : [{doctor_info:doctor_info},{patient_info: req.rootID}]
            });
            
            console.log(findExistingReview , 'findExistingReview');
            if(findExistingReview){

                findExistingReview.doctor_info = doctor_info || findExistingReview.doctor_info;
                findExistingReview.patient_info = req.rootID || findExistingReview.patient_info;
                findExistingReview.review_star = review_star || findExistingReview.review_star;
                findExistingReview.review_discription = review_discription || findExistingReview.review_discription;

                await findExistingReview.save();
                res.status(200).json({status:true , message:'success' , data:findExistingReview });
            }
            else{

                let newReview = new ReviewData({
                    doctor_info,patient_info:req.rootID,review_star,review_discription
                });
                await newReview.save();

                res.status(200).json({status:true , message:'success' , data:newReview });
            }
            
     
    }
    catch(err){
        return err;
    }
}

const reviewPut = async (req,res) =>{
    try{
            let keywords = req.query;
            if(!keywords.id) return res.status(406).json({status:false , message : `failed: id missing`});

            let updateData = await ReviewData.updateOne({_id:keywords.id }, {
                $set : req.body
            });

            if(!updateData) return res.status(200).json({status:false , message:'failed'});
            else{
                res.status(200).json({status:true , message:'success'});
            }
    }
    catch(err){
        return err;
    }
}

const reviewDelete = async (req,res) =>{
    try{
        let keywords = req.query;
        if(!keywords.id) return res.status(406).json({status:false , message : `failed: id missing`});


        let deleteData = await ReviewData.findByIdAndDelete({_id:keywords.id });
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

module.exports = {reviewGet,reviewPost,reviewPut,reviewDelete};

