const mongoose = require('mongoose');

const deasesSchema = new mongoose.Schema({
    name : String,
    image : String,
    status : {
        type: Boolean,
        default : true
    }
}, {
    timestamps : true
});

const DeasesData = mongoose.model('deasespage' , deasesSchema);
module.exports = DeasesData;

