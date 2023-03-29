const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    role_name : String,

    admin : {
        type : Boolean,
        default : false
    },
    appointment : {
        type : Boolean,
        default : false
    },
    category : {
        type : Boolean,
        default : false
    },
    experts : {
        type : Boolean,
        default : false
    },
    email_template : {
        type : Boolean,
        default : false
    },
    doctor : {
        type : Boolean,
        default : false
    },
    commission : {
        type : Boolean,
        default : false
    },
    role : {
        type : Boolean,
        default : false
    },
    payment : {
        type : Boolean,
        default : false
    },
    treatment : {
        type : Boolean,
        default : false
    },
    settings : {
        type : Boolean,
        default : false
    },
}) ;


const RoleData = mongoose.model('rolepage' , roleSchema);

module.exports = RoleData;

