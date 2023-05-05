const mongoose = require('mongoose');


const newPatientSchema = new mongoose.Schema({
    assign_id : String,
    first_name : String,
    last_name : String,
    email:String,
    phone : String,
    dob : String,
    gender : String,
    married_status: {
        type: String,
        default : "single"
    },
    s_o: String,
    d_o: String,
    h_o: String,
    age: String,
    profile_image :String,
    address :String,
    status : {
        type: Boolean,
        default : true
    },
}, {
    timestamps : true
});


const NewPatientData = mongoose.model('newpatientpage' , newPatientSchema);
module.exports = NewPatientData;