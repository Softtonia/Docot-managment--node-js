const { AppointmentBookedTimeSlotsData } = require("../models/appointmentSchema");
const CalendarTimeSoltData = require("../models/calandertimeslotSchema");



const assigntimeslotsGet = async (req,res) =>{
    try{

            let keywords = req.query;
            if(!keywords.id) return res.status(406).json({status:false , message : `failed: time slot id missing`});

            if(keywords.date){

                let findData = await CalendarTimeSoltData.find({
                    $and : [{doctor_info: keywords.id },{date: keywords.date }]
                });
                if(findData){
                    let count = findData.length;
                    res.status(200).json({status:true , message :'success', total : count  , data:findData });
                }
                else{
                    res.status(404).json({status:false , message :'failed: data not found'});
                }
            }

            else{
                let findData = await CalendarTimeSoltData.find({doctor_info: keywords.id });
                if(findData){
                    let count = findData.length;
                    res.status(200).json({status:true , message :'success', total : count  , data:findData });
                }
                else{
                    res.status(404).json({status:false , message :'failed: data not found'});
                }
            }
    
    }
    catch(err){
        return err;
    }
}

const assigntimeslotsAvailableGet = async (req,res) =>{
    try{

            let keywords = req.query;
            let unbookedSlots=[];
            if(!keywords.id) return res.status(406).json({status:false , message : `failed: time slot id missing`});

            if(keywords.date){

                    let allbookedslots = await AppointmentBookedTimeSlotsData.find({
                        $and : [{date : keywords.date , doctor_info : keywords.id }]
                    });

      
                    let allsots = await CalendarTimeSoltData.find({
                        $and : [{date : keywords.date , doctor_info : keywords.id }]
                    });
                  

                    if(allsots.length>0){
                        
                        allsots = JSON.parse(allsots[0]?.timeslot_data);

                        unbookedSlots = allsots?.filter(slot => {
                            let slotId = slot._id;
                            let isBooked = allbookedslots.some(bookedSlot => bookedSlot.timeslot_data === slotId);
                            return !isBooked;
                        });
    
                      
                        let count = unbookedSlots.length;
                        res.status(200).json({status:true , message :'success', total : count  , data:unbookedSlots });


                    }
                    else{
                    
                        res.status(200).json({status:true , message :'success', total : allsots.length  , data:unbookedSlots });
                    }

            }
            else{
                return res.status(406).json({status:false , message : `failed: date missing`});
            }

    }
    catch(err){
        return err;
    }
}

const assigntimeslotsPost = async (req,res) =>{
    try{
            let {doctor_info,date,timeslot_data} = req.body;

            if(!doctor_info || !date || !timeslot_data){
                return res.status(406).json({status:false , message : 'some field are required.'})
            }
            let checkDuplicate =  await CalendarTimeSoltData.findOne({
                $and : [{ doctor_info:doctor_info},{ date:date} ]
            })

            console.log(checkDuplicate, 'checkDuplicate')

            if(checkDuplicate){
            console.log('entred 01')
                checkDuplicate.timeslot_data = timeslot_data;
                await checkDuplicate.save();
                return res.status(200).json({status:true , message : 'Updation Success'})
            }
            else{
                let newData = new CalendarTimeSoltData({
                    doctor_info,date,timeslot_data })
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
const assigntimeslotsPatch = async (req,res) =>{
    try{
        let keywords = req.query;
        if(!keywords.id) return res.status(406).json({status:false , message : `failed: time slot id missing`});

        let findData = await CalendarTimeSoltData.updateOne({_id: keywords.id } , {
            $set : req.body
        });
        res.status(200).json({status:true , message:'success' , data: findData});
}
    catch(err){
        return err;
    }
}

const assigntimeslotsDelete = async (req,res) =>{
    try{
        let keywords = req.query;

        if(!keywords.id) return res.status(406).json({status:false , message : `failed: time slot id missing`});
        let deleteData = await CalendarTimeSoltData.findByIdAndDelete({_id:keywords.id });
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


module.exports = {assigntimeslotsGet,assigntimeslotsAvailableGet, assigntimeslotsPost, assigntimeslotsPatch, assigntimeslotsDelete};

