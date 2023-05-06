const mongoose = require('mongoose');
const DoctorData = require('./doctorSchema');
// const PatientData = require('./patientSchema');
const { TreatmentData, DepartmentData } = require('./treatmentSchema');
const BranchData = require('./branchSchema');
const NewPatientData = require('./newpatientSchema');
const TimeslotData = require('./timeslotsSchema');


const appointmentSchema = new mongoose.Schema({
    appointment_date : String,
    appointment_time : {type : mongoose.Schema.Types.ObjectId , ref : TimeslotData},
    appointment_type : String,
    appointment_for : String,
    patient_info : {type : mongoose.Schema.Types.ObjectId , ref : NewPatientData},

    appointment_status: {
        type: String,
        default : 'waiting'
    },

    department_info : {type : mongoose.Schema.Types.ObjectId , ref : DepartmentData},
    treatment_info : {type : mongoose.Schema.Types.ObjectId , ref : TreatmentData},
    experties_info : {type : mongoose.Schema.Types.ObjectId , ref : TreatmentData},
    branch_info : {type : mongoose.Schema.Types.ObjectId , ref : BranchData},
    doctor_info : {type : mongoose.Schema.Types.ObjectId , ref : DoctorData},

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


const appointmentTypeSchema = new mongoose.Schema({
    name : String,
    status : {
        type: Boolean,
        default : true
    }
}, {
    timestamps : true
});

const AppointmentTypeData = mongoose.model('appointmenttypepage' , appointmentTypeSchema);



const appointmentBookedTimeSlotsSchema = new mongoose.Schema({
    doctor_info : {type : mongoose.Schema.Types.ObjectId , ref : DoctorData},
    date:String,
    timeslot_data:String,
    status : {
        type: Boolean,
        default : true
    }
}, {
    timestamps : true
});

const AppointmentBookedTimeSlotsData = mongoose.model('appointmentbookedtimeslotspage' , appointmentBookedTimeSlotsSchema);


module.exports = {AppointmentData,AppointmentTypeData,AppointmentBookedTimeSlotsData};

