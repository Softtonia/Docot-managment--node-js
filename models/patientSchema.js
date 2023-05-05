const mongoose = require('mongoose');
const { CategoryData } = require('./treatmentSchema');
const DoctorData = require('./doctorSchema');


const patientSchema = new mongoose.Schema({
    assign_id : String,
    first_name : String,
    last_name : String,
    email :   { type : String },
    password : String,
    forget_token : String,
    forget_expire_time : String,

    phone : String,
 
    dob : String,
    gender : {
        type: String,
        default : "male"
    },
    allergies : String,
    medications : String,
    insurance_info : String,

    married_status: {
        type: String,
        default : "single"
    },
    s_o: String,
    d_o: String,
    h_o: String,
    age: String,
    department_info: {type : mongoose.Schema.Types.ObjectId , ref : CategoryData}, 
    doctor_info: {type : mongoose.Schema.Types.ObjectId , ref : DoctorData}, 
    health_history : String,
    disease: String,
    profile_image : {
        type : String,
    },

    address : {
        type : String,
        trim : true
    },
    status : {
        type: Boolean,
        default : true
    },

}, {
    timestamps : true
});

const PatientData = mongoose.model('patientpage' , patientSchema);
module.exports = PatientData;

