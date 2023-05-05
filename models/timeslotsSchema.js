const mongoose = require('mongoose');

const timeslotSchema = new mongoose.Schema({
    start_time : String,
    end_time : String,
    status : {
        type: Boolean,
        default : true
    }
},{
    timestamps : true
});

const TimeslotData = mongoose.model('timeslotpage' , timeslotSchema);


module.exports = TimeslotData;

