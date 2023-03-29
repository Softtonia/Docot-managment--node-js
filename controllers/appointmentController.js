const deletefile = require("../helper/deletefile");
const AppointmentData = require("../models/appointmentSchema");
const cron = require('node-cron');

const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const mailGlobalTemplate = require("../helper/mailController");


const publicDirectoryPath = path.join(__dirname, '../template/email.html');

const source = fs.readFileSync(publicDirectoryPath, 'utf8');
const template = handlebars.compile(source);




const appointmentGet = async (req,res) =>{
    try{

        let keywords = req.query;
        if(keywords.doctor_info){

            let findData = await AppointmentData.find({doctor_info:keywords.doctor_info}).select('-__v').populate('patient_info' , '_id first_name last_name');
            if(findData){
                let count = findData.length;
                res.status(200).json({status:true , message :'success', total : count  , data:findData });
            }
            else{
                res.status(404).json({status:false , message :'failed'});
            }

        }


        else{
            let findData = await AppointmentData.find().select('-__v').populate('doctor_info' , '_id first_name last_name').populate('patient_info' , '_id first_name last_name');
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
                appointment_type,
                patient_info} = req.body;

            if(!doctor_info|| !appointment_date|| !appointment_time|| !appointment_type|| !patient_info){
                return res.status(406).json({status:false , message : 'some field are required.'})
            }

            // let findCopy = await AppointmentData.find(req.body).countDocuments();
            // console.log(findCopy , '=================== ======================= =================')
            // if(findCopy>0) return res.status(406).json({status:false , message : 'duplicate data not allowed', data:findCopy})


            else{

                let confirmSlot = await  AppointmentData.find({
                    "$and" : [{doctor_info : doctor_info},{appointment_date : appointment_date},{appointment_time : appointment_time}]
                }).countDocuments();

                
                let appointment_status_data = 'confirm';


                if(confirmSlot>0){
                        appointment_status_data = 'waiting';
                }


                let newData = new AppointmentData({
                    doctor_info, 
                appointment_date,
                appointment_time,
                appointment_type,
                patient_info,
                appointment_status:appointment_status_data

                })
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




module.exports = {appointmentGet, appointmentPost,appointmentDoctorPut, appointmentPut, appointmentPatch, appointmentDelete};

