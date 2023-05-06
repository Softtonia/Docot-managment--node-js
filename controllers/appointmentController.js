const deletefile = require("../helper/deletefile");
const {AppointmentData, AppointmentTypeData, AppointmentBookedTimeSlotsData} = require("../models/appointmentSchema");
const cron = require('node-cron');

const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const mailGlobalTemplate = require("../helper/mailController");
const PatientData = require("../models/patientSchema");
const CalendarTimeSoltData = require("../models/calandertimeslotSchema");
const { default: mongoose } = require("mongoose");
const NewPatientData = require("../models/newpatientSchema");


const publicDirectoryPath = path.join(__dirname, '../template/email.html');

const source = fs.readFileSync(publicDirectoryPath, 'utf8');
const template = handlebars.compile(source);




const appointmentGet = async (req,res) =>{
    try{

        let keywords = req.query;
        if(keywords.doctor_info){
            let findData = await AppointmentData.find({doctor_info:keywords.doctor_info}).select('-__v').populate('patient_info' , '_id first_name last_name assign_id phone')
            .populate('appointment_time', 'start_time end_time')
            .populate('department_info' , 'name')
            .populate('treatment_info' , 'name')
            .populate('branch_info' , 'name')
            .sort({ createdAt: 'desc' });
            if(findData){
                let count = findData.length;
                res.status(200).json({status:true , message :'success', total : count  , data:findData });
            }
            else{
                res.status(404).json({status:false , message :'failed'});
            }
        }


        else{
            let findData = await AppointmentData.find().select('-__v').populate('doctor_info' , '_id first_name last_name ').populate('patient_info' , '_id first_name last_name assign_id phone')
            .populate('appointment_time', 'start_time end_time')
            .populate('department_info' , 'name')
            .populate('treatment_info' , 'name')
            .populate('branch_info' , 'name')
            .sort({ createdAt: 'desc' });
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

const appointmentPost = async (req,res) =>{
    try{

            let {        
                doctor_info, 
                appointment_date,
                appointment_time,
                patient_info,
                department_info,
                treatment_info,
                branch_info,
                } = req.body;

            if(!doctor_info|| !appointment_date|| !appointment_time|| !department_info|| !patient_info || !treatment_info || !branch_info){
                return res.status(406).json({status:false , message : 'some field are required.'})
            }

            else{

                // let confirmSlot = await  AppointmentData.find({
                //     "$and" : [{doctor_info : doctor_info},{appointment_date : appointment_date},{appointment_time : appointment_time}]
                // }).countDocuments();

                
                // let appointment_status_data = 'confirm';


                // if(confirmSlot>0){
                //         appointment_status_data = 'waiting';
                // }


                let newData = new AppointmentData({
                    doctor_info, 
                    appointment_date,
                    appointment_time,
                    patient_info,
                    department_info,
                    treatment_info,
                    branch_info
                })
                let saveData = await newData.save();

                let newBookedSlot = new AppointmentBookedTimeSlotsData({
                    doctor_info :   doctor_info, 
                    date: appointment_date,
                    timeslot_data: appointment_time
                });
                await newBookedSlot.save();


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

const appointmentNewPost = async (req,res) =>{
    try{
        if(!req.body.phone){
            return res.status(406).json({status:false , message : 'some field are required.'})
        }

        console.log(req.body , 'entered api')
        let savedPatient;
      

        let findPhone = await NewPatientData.findOne({phone : req.body.phone});
        if(findPhone){
            findPhone.first_name = req.body.first_name || findPhone.first_name;
            findPhone.last_name = req.body.last_name || findPhone.last_name ;
            findPhone.gender = req.body.gender || findPhone.gender;
            findPhone.age = req.body.age || findPhone.age;
            findPhone.married_status = req.body.married || findPhone.married;
            await findPhone.save();
            savedPatient = findPhone._id;
            console.log(findPhone._id , 'exit code savedPatient b1')
        }

        else{
            
        console.log(findPhone , 'entered findPhone')

        /* uid starts */
        const lastData = await NewPatientData.findOne().sort({ createdAt: -1 });
        const nextId = lastData ? parseInt(lastData.assign_id.substring(3)) + 1 : 1;
        const newId = `VAB${nextId.toString().padStart(3, '0')}`;
        /* uid ends */
        console.log(newId , 'entered newId')

        let newPatient = new NewPatientData({
                    assign_id:newId,
                    first_name:req.body.first_name,
                    last_name:req.body.last_name,
                    phone:req.body.phone,
                    gender:req.body.gender,
                    married_status:req.body.married,
                    age :req.body.age
        });
        await newPatient.save(); 

        savedPatient = newPatient._id;
    
    }

        let newData = new AppointmentData({
        doctor_info : req.body.doctor_info, 
        appointment_date : req.body.appointment_date,
        appointment_time : req.body.appointment_time,
        patient_info:savedPatient,
        appointment_type : req.body.appointment_type,
        appointment_for : req.body.appointment_for,
        department_info: req.body.department_info,
        treatment_info : req.body.treatment_info,
        experties_info : req.body.experties_info,
        branch_info: req.body.branch_info,
        
        })
        let saveData = await newData.save();
        if(saveData){

    let newBookedSlot = new AppointmentBookedTimeSlotsData({
        doctor_info :  req.body.doctor_info, 
        date:req.body.appointment_date,
        timeslot_data:req.body.appointment_time
    });
    await newBookedSlot.save();
    res.status(202).json({status:true , message:'success' , data:saveData });
        }
        else{
            res.status(404).json({status:false , message:'failed: failed to save'});
        }


        console.log('exit newId')
        res.status(200).json({status:true , message:'accoutn creation success' , data: newPatient});


}
catch(err){
    return err;
}
}

const createPID = async ()=>{
  console.log('entredd PID  statemtne');

  /* uid starts */
  const lastData = await PatientData.findOne().sort({ createdAt: -1 });
  const nextId = lastData ? parseInt(lastData.assign_id.substring(3)) + 1 : 1;
  const newId = `VAB${nextId.toString().padStart(3, '0')}`;
  /* uid ends */
  console.log('newId statemtne' , newId);
  return newId;
}




const createPatient = async (props) =>{
   /* uid starts */
   const lastData = await PatientData.findOne().sort({ createdAt: -1 });
   const nextId = lastData ? parseInt(lastData.assign_id.substring(3)) + 1 : 1;
   const newId = `VAB${nextId.toString().padStart(3, '0')}`;
   /* uid ends */

   console.log(newId,props, 'entred else newId');
   props.assign_id = newId;
   console.log(props, 'entred else props adaina');


   let newPatient = new PatientData({
    assign_id:newId,
    first_name : 'test',
    last_name : 'test',
    phone : 'test',
    gender : 'test',
    married_status : 'test',
    age : 'test'
});
await newPatient.save();

    // let dataaaaaa = await PatientData.insertOne(props);


   console.log(newPatient , 'saveData')

   

//    return newPatient._id


}

const findAviableSlots = async (props) =>{
   
    let allbookedslots = await AppointmentBookedTimeSlotsData.find({
        $and : [{date : props.appointment_date , doctor_info : props.doctor_info }]
    });
    let allsots = await CalendarTimeSoltData.find({
        $and : [{date : props.appointment_date , doctor_info : props.doctor_info }]
    });

    allsots = JSON.parse(allsots[0].timeslot_data);
    // Filter the total slots to only include unbooked slots
    let unbookedSlots = allsots.filter(slot => {
        let slotId = slot._id;
        let isBooked = allbookedslots.some(bookedSlot => bookedSlot.timeslot_data === slotId && bookedSlot.status === true);
        return !isBooked;
    });

    console.log(unbookedSlots, unbookedSlots.length,'ADdddddddddddddd| ')




}

const appointmentPut = async (req,res) =>{
    try{

            if(req.body.appointment_status==='confirm') return res.status(406).json({status:false , message : `failed: patient cannot change appointment status to confrim`});
            let keywords = req.query;
            if(!keywords.id) return res.status(406).json({status:false , message : `failed: appointment id missing`});
            let findData = await AppointmentData.findById({_id:keywords.id });
            if(!findData){
                return res.status(406).json({status:false , message : `failed: data not found`})
            }
            

            else{
     
                findData.doctor_info =  req.body.doctor_info || findData.doctor_info, 
                findData.appointment_date =  req.body.appointment_date || findData.appointment_date,
                findData.appointment_time =  req.body.appointment_time || findData.appointment_time,
                findData.appointment_type =  req.body.appointment_type || findData.appointment_type,
                findData.patient_info =  req.body.patient_info || findData.patient_info,
                findData.appointment_status =  req.body.appointment_status || findData.appointment_status,
                await findData.save();

                if(req.body.appointment_status==='cancel'){

                    let checkWaiting =  await  AppointmentData.findOne({
                        "$and" : [{doctor_info : findData.doctor_info},{appointment_date : findData.appointment_date},{appointment_time : findData.appointment_time},{appointment_status : 'waiting'}]
                    })

                    if(!checkWaiting) return;
                    checkWaiting.appointment_status = 'confirm';
                    let reson = await checkWaiting.save();
    
                }


                res.status(200).json({status:true , message:'success: updation successs'});
            }
    }
    catch(err){
        return err;
    }
}

const appointmentDoctorPut = async (req,res) =>{
    try{
            let keywords = req.query;
            if(!keywords.id) return res.status(406).json({status:false , message : `failed: appointment id missing`});
            let findData = await AppointmentData.findById({_id:keywords.id });
            if(!findData){
                return res.status(406).json({status:false , message : `failed: data not found`});
            }

         
            else{
                findData.appointment_status =  req.body.appointment_status || findData.appointment_status,
                await findData.save();
                if(req.body.appointment_status==='cancel'){

                    let checkWaiting =  await  AppointmentData.findOne({
                        "$and" : [{doctor_info : req.rootID},{appointment_date : findData.appointment_date},{appointment_time : findData.appointment_time},{appointment_status : 'waiting'}]
                    })

                    if(!checkWaiting) return;
                    checkWaiting.appointment_status = 'confirm';
                    let reson = await checkWaiting.save();
    
                }


                res.status(200).json({status:true , message:'success: updation successs'});
            }
    }
    catch(err){
        return err;
    }
}

const appointmentPatch = async (req,res) =>{
    try{
        let keywords = req.query;
        if(!keywords.id) return res.status(406).json({status:false , message : `failed: appointment id missing`});

        let findData = await AppointmentData.updateOne({_id: keywords.id } , {
            $set : req.body
        });
        res.status(200).json({status:true , message:'success' , data: findData});
}
    catch(err){
        return err;
    }
}

const appointmentDelete = async (req,res) =>{
    try{
        let keywords = req.query;

        if(!keywords.id) return res.status(406).json({status:false , message : `failed: appointment id missing`});
        let deleteData = await AppointmentData.findByIdAndDelete({_id:keywords.id });
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




// cron.schedule('*/5 * * * * *', function() {
//     reminderFn();
// },
// {
//     timezone : 'Asia/Kolkata'
// }).start();

const reminderFn = async (req,res) =>{
    try{
        let count = 0;

        let findData = await AppointmentData.find().populate('patient_info' , 'first_name last_name email').then((result)=>{
            result.forEach((res)=>{

                let appDate = res.appointment_date;
                let appTime = res.appointment_time;

                const dateTimeStr = appDate + ' ' +appTime
                const dateAppms = new Date(dateTimeStr).getTime()

                let currentDate = new Date().getTime()

                if(currentDate<dateAppms && dateAppms-currentDate > 14,400,000 && !res.email_reminder_status && res.appointment_status==='confirm'){
                    console.log('ok tested')
                }
                else{
                    console.log('false test')
                }

                console.log(appDate , 'date' , appTime , 'time' , dateTimeStr,'dateTimeStr' , dateAppms , 'dateAppms' , currentDate,'currentDate');


                if(!res.email_reminder_status){

                    const data = {
                        title: 'Welcome to my website',
                        heading: 'Hello there!',
                        message: 'Thanks for signing up. We hope you enjoy our content.'
                      };

                      const html = template(data);
                      let info 
                   

                    let pre =  async () =>{
                        info = await mailGlobalTemplate({ email : res.patient_info.email , subject: 'Appointment Reminder' , body: html });

                                  
                      if(info){
                        res.email_reminder_status= true;
                        res.save();
                      }

                     }

                     pre();
           

                }
            })
        })
    }

    catch(err){
        return console.log(err);
    }
}





/* Appointment Type */

const appointmentTypeGet = async (req,res) =>{
    try{

        let keywords = req.query;
        if(keywords.name){
            let findData = await AppointmentTypeData.find({name:keywords.name}).select('-__v');
            if(findData){
                let count = findData.length;
                res.status(200).json({status:true , message :'success', total : count  , data:findData });
            }
            else{
                res.status(404).json({status:false , message :'failed'});
            }
        }
        else{
            let findData = await AppointmentTypeData.find().select('-__v');
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

const appointmentTypePost = async (req,res) =>{
    try{

            let {name} = req.body;
            name = name.toLowerCase();

            if(!name){
                return res.status(406).json({status:false , message : 'some field are required.'})
            }

            else{

                let confirmData = await  AppointmentTypeData.findOne({name:name});
                console.log(confirmData , 'tes cofirm')

                if(confirmData){

                    console.log('enter for update',confirmData)
                    confirmData.name = name;
                    await confirmData.save();
                    res.status(404).json({status:true , message:'updation success'});
                }
                else{
                    let newData = new AppointmentTypeData({name});
                    let saveData = await newData.save();
                    if(saveData){
                        res.status(202).json({status:true , message:'success' , data:saveData });
                    }
                    else{
                        res.status(404).json({status:false , message:'failed: failed to save'});
                    }
                    
                } 
            }
    }
    catch(err){
        return err;
    }
}

const appointmentTypeDelete = async (req,res) =>{
    try{
        let keywords = req.query;

        if(!keywords.id) return res.status(406).json({status:false , message : `failed: appointment id missing`});
        let deleteData = await AppointmentTypeData.findByIdAndDelete({_id:keywords.id });
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



module.exports = {appointmentGet, appointmentPost,appointmentDoctorPut,appointmentNewPost, appointmentPut, appointmentPatch, appointmentDelete,
    appointmentTypeGet,appointmentTypePost,appointmentTypeDelete
};

