const mongoose = require('mongoose');
const DoctorData = require('./doctorSchema');
const PatientData = require('./patientSchema');
const { TreatmentData, CategoryData, ExpertiseData } = require('./treatmentSchema');


const appointmentSchema = new mongoose.Schema({
    doctor_info : {type : mongoose.Schema.Types.ObjectId , ref : DoctorData}, 
    appointment_date : String,
    appointment_time : String,
    appointment_type : String,

    patient_info : {type : mongoose.Schema.Types.ObjectId , ref : PatientData}, 

    appointment_status: {
        type: String,
        default : 'wating'
    },

    email_reminder_status :{
        type: Boolean,
        default : false
    },
    sms_reminder_status :{
        type: Boolean,
        default : false
    },
    push_reminder_status :{
        type: Boolean,
        default : false
    },

    status : {
        type: Boolean,
        default : true
    }

}, {
    timestamps : true
});

const AppointmentData = mongoose.model('appointmentpage' , appointmentSchema);
module.exports = AppointmentData;

