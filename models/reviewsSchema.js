const mongoose = require('mongoose');
const DoctorData = require('./doctorSchema');
const PatientData = require('./patientSchema');


const reviewSchema = new mongoose.Schema({
    doctor_info :{type : mongoose.Schema.Types.ObjectId , ref : DoctorData},
    patient_info :{type : mongoose.Schema.Types.ObjectId , ref : PatientData},
    review_star : {
        type: Number,
        default : 1
    },
    review_discription : String
});

const ReviewData = mongoose.model('reviewpage' , reviewSchema);


module.exports = ReviewData;

