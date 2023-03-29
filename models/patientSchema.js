const mongoose = require('mongoose');


const patientSchema = new mongoose.Schema({
    first_name : String,
    last_name : String,
    email :   {
        type : String ,
         unique : true,
        },
    password : String,
    forget_token : String,
    forget_expire_time : String,

    phone : String,
    health_history : String,
    dob : String,
    gender : String,
    allergies : String,
    medications : String,
    insurance_info : String,

    married_status: String,
    s_o: String,
    d_o: String,
    h_o: String,
    department: String,
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

