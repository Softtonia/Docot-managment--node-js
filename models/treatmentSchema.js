const mongoose = require('mongoose');




const categorySchema = new mongoose.Schema({
    name : {
        type : String,
        unique:true
    },
    // treatments_name : String,
    // treatments_info : {type : mongoose.Schema.Types.ObjectId , ref : TreatmentData},
    image : {
        type : String,
    },
    status : {
        type: Boolean,
        default : true
    },
});

const CategoryData = mongoose.model('categorypage' , categorySchema);



const departmentSchema = new mongoose.Schema({
    name : {
        type : String,
        unique:true
    },
    // treatments_name : String,
    // treatments_info : {type : mongoose.Schema.Types.ObjectId , ref : TreatmentData},
    image : {
        type : String,
    },
    status : {
        type: Boolean,
        default : true
    },
},
{
    timestamps : true
}
);

const DepartmentData = mongoose.model('departmentpage' , departmentSchema);




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




const treatmentSchema = new mongoose.Schema({
    name : {
        type : String,
        unique:true
    },
    image : {
        type : String,
    },
    department_info : {type : mongoose.Schema.Types.ObjectId , ref : DepartmentData},
    status : {
        type: Boolean,
        default : true
    },
},
{
    timestamps : true
});
const TreatmentData = mongoose.model('treatmentpage' , treatmentSchema);



module.exports = {TreatmentData,CategoryData,ExpertiseData,DepartmentData};



