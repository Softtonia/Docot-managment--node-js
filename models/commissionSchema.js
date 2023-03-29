const mongoose = require('mongoose');
const DoctorData = require('./doctorSchema');

const commissionSchema = new mongoose.Schema({
    based_on : {type:String,
            required:true
    },
    doctor_info : {type : mongoose.Schema.Types.ObjectId , ref: DoctorData,   required:true},
    amount: {type:String,
        required:true
},
    status: {
        type:Boolean,
        default: true
    }
});

const CommissionData = mongoose.model('commissionpage' , commissionSchema);
module.exports = CommissionData;
