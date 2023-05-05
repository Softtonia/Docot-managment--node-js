const TimeslotData = require("../models/timeslotsSchema");


const timeslotsGet = async (req,res) =>{
    try{
  
            let findData = await TimeslotData.find().select('-__v -createdAt -updatedAt')
            if(findData){
                let count = findData.length;
                res.status(200).json({status:true , message :'success', total : count  , data:findData });
            }
            else{
                res.status(404).json({status:false , message :'failed'});
            }
    
    }
    catch(err){
        return err;
    }
}

const timeslotsPost = async (req,res) =>{
    try{
            let {start_time,end_time} = req.body;
            if(!start_time|| !end_time){
                return res.status(406).json({status:false , message : 'some field are required.'})
            }

            else{
                let newData = new TimeslotData({
                    start_time,end_time })
                let saveData = await newData.save();
                if(saveData){
                    res.status(202).json({status:true , message:'success' , data:saveData });
                }
                else{
                    res.status(404).json({status:false , message:'failed: failed to save'});
                }
                
            }
    }
    catch(err){
        return err;
    }
}

const timeslotsPut = async (req,res) =>{
    try{

            let keywords = req.query;
            if(!keywords.id) return res.status(406).json({status:false , message : `failed: timeslots id missing`});
            let findData = await TimeslotData.findById({_id:keywords.id });
            if(!findData){
                return res.status(406).json({status:false , message : `failed: data not found`})
            }
            else{
                findData.start_time =  req.body.start_time || findData.start_time, 
                findData.end_time =  req.body.end_time || findData.end_time,
                await findData.save();
                res.status(200).json({status:true , message:'success: updation successs'});
            }
    }
    catch(err){
        return err;
    }
}
const timeslotsPatch = async (req,res) =>{
    try{
        let keywords = req.query;
        if(!keywords.id) return res.status(406).json({status:false , message : `failed: time slot id missing`});

        let findData = await TimeslotData.updateOne({_id: keywords.id } , {
            $set : req.body
        });
        res.status(200).json({status:true , message:'success' , data: findData});
}
    catch(err){
        return err;
    }
}

const timeslotsDelete = async (req,res) =>{
    try{
        let keywords = req.query;

        if(!keywords.id) return res.status(406).json({status:false , message : `failed: time slot id missing`});
        let deleteData = await TimeslotData.findByIdAndDelete({_id:keywords.id });
        if(!deleteData){
            return res.status(406).json({status:false , message : `failed: data not found`});
        }
        else{
            res.status(200).json({status:true , message:'success'});
        }
}
    catch(err){
        return err;
    }
}


module.exports = {timeslotsGet, timeslotsPost,timeslotsPut, timeslotsPatch, timeslotsDelete};

