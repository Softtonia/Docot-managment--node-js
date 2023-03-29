const mongoose = require('mongoose');


const treatmentSchema = new mongoose.Schema({
    name : {
        type : String,
        unique:true
    },
    image : {
        type : String,
    },
    status : {
        type: Boolean,
        default : true
    },
});

const TreatmentData = mongoose.model('treatmentpage' , treatmentSchema);


const categorySchema = new mongoose.Schema({
    name : {
        type : String,
        unique:true
    },
    treatments_name : String,
    treatments_info : {type : mongoose.Schema.Types.ObjectId , ref : TreatmentData},
    image : {
        type : String,
    },
    status : {
        type: Boolean,
        default : true
    },
});

const CategoryData = mongoose.model('categorypage' , categorySchema);


const expertiseSchema = new mongoose.Schema({
    name : {
        type : String,
        unique:true
    },
    category_name : String,
    category_info : {type : mongoose.Schema.Types.ObjectId , ref : CategoryData},
    image : {
        type : String,
    },
    status : {
        type: Boolean,
        default : true
    },
});

const ExpertiseData = mongoose.model('expertisepage' , expertiseSchema);


module.exports = {TreatmentData,CategoryData,ExpertiseData};

