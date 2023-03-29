const mongoose = require('mongoose');
const { TreatmentData, CategoryData, ExpertiseData } = require('./treatmentSchema');


const doctorSchema = new mongoose.Schema({
    first_name : String,
    last_name : String,
    email :   {
        type : String ,
         unique : true,
        },
    password : String,
    forget_token : String,
    forget_expire_time : String,
    self_token : String,
    self_expire_time : String,

    phone : String,
    hospital : String,
    dob : String,
    gender : String,
    bio : String,

    alternative_number: String,

    aadhar_number: Number,
    pan_number : String,

    education :{
        type : Array,
        default : null
    },




    degree : String,
    treatments_info : {type : mongoose.Schema.Types.ObjectId , ref : TreatmentData}, 
    category_info : {type : mongoose.Schema.Types.ObjectId , ref : CategoryData}, 
    expertise_info : {type : mongoose.Schema.Types.ObjectId , ref : ExpertiseData},
    timeslots : String,
    based_on:String,
    commission_amount:String,
    start_time:String,
    end_time:String,
    popular :  {
        type : Boolean ,
         default : false,
        },
    profile_image : {
        type : String,
    },
 
    address : {
        type : String,
        trim : true
    },
    account_type : {
        type: String,
        default : 'user'
    },
    super_admin : {
        type: Boolean,
        default : false
    },
    status : {
        type: Boolean,
        default : true
    },

}, {
    timestamps : true
});

const DoctorData = mongoose.model('doctorpage' , doctorSchema);
module.exports = DoctorData;

