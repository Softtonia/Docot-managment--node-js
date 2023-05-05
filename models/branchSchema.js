const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
    name : String,
    address : String,
    // assign_id : String,
    status : {
        type: Boolean,
        default : true
    }
},{
    timestamps : true
});

const BranchData = mongoose.model('branchpage' , branchSchema);


module.exports = BranchData;

