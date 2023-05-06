const mongoose = require('mongoose');
const RoleData = require('./roleSchema');


const adminSchema = new mongoose.Schema({
    first_name : String,
    last_name : String,
    email : String,
    password : String,
    forget_token : String,
    ftoken_expire : String,
    phone : String,
    department : String,
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
    alternative_number : String,
    district: String,
    state: String,
    country: String,
    pincode: String,
    gst: String,
    tax: String,
    hospital: String,
    fax: String,
    logo: String,

    status: {
        type: Boolean,
        default : true
    },
    role_info  : {type: mongoose.Types.ObjectId , ref : RoleData}


}, {
    timestamps : true
});

const AdminData = mongoose.model('adminpage' , adminSchema);
module.exports = AdminData;

