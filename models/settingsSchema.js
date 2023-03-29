const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    hospital_name : String,
    logo : String,
    contact : String,
    email : String,
    gst : String,
    address : String,
    state : String,
    district : String,
    country : String,
    timezone : String,
},{
    timestamps : true
});

const SettingsData = mongoose.model('settingspage' , settingsSchema);


module.exports = SettingsData;

