const mongoose = require('mongoose');
const DoctorData = require('./doctorSchema');

const calandertimeShema = new mongoose.Schema({
    timeslot_data : String,
    doctor_info : {type : mongoose.Schema.Types.ObjectId , ref : DoctorData},
    date:String,
    status : {
        type: Boolean,
        default : true
    }
},{
    timestamps : true
});

const CalendarTimeSoltData = mongoose.model('calendartimesoltpage' , calandertimeShema);
module.exports = CalendarTimeSoltData;

