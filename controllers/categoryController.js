const deletefile = require("../helper/deletefile");
const { CategoryData } = require("../models/treatmentSchema");


const categoryGet = async (req,res) =>{
    try{
        let findData = await CategoryData.find().select('-__v').populate('treatments_info' , '-_id name');
        if(findData){
            let count = findData.length;
            res.status(200).json({status:true , message :'success', total : count  , data:findData });
        }
        else{
            res.status(404).json({status:false , message :'failed'});
        }
    }
    catch(err){
        return err;
    }
}

const categoryPost = async (req,res) =>{
    try{
            let {name,treatments_name,treatments_info,status} = req.body;
            if(!name){
                return res.status(406).json({status:false , message : 'some field are required.'})
            }

            name = name.toLowerCase();
            let countCopy = await CategoryData.find({name:name}).countDocuments();

            if(countCopy>0) return res.status(406).json({status:false , message : 'failed: category name already used.'})
            else{
                let file1;
                if(req.file){
                    file1 = process.env.SERVER_FILEUPLOAD_URL+req.file.filename;
                }

                let newData = new CategoryData({
                    name,image:file1,treatments_name,treatments_info,status
                })
                let saveData = await newData.save();
                if(saveData){
                    res.status(202).json({status:true , message:'success' , data:saveData });
                }
                else{
                    res.status(404).json({status:false , message:'failed: failed to save'});
                }
                
            }
    }
    catch(err){
        return err;
    }
}

const categoryPut = async (req,res) =>{
    try{
            if(req.body.name){

                req.body.name = req.body.name.toLowerCase();
            }


            let keywords = req.query;
            if(!keywords.id) return res.status(406).json({status:false , message : `failed: id missing`});
            let findData = await CategoryData.findOne({_id:keywords.id });



            if(!findData){
                return res.status(406).json({status:false , message : `failed: data not found`})
            }
            else{
                let file1;
                if(req.file){
                    file1 = process.env.SERVER_FILEUPLOAD_URL+req.file.filename;
                    if(findData.image){deletefile(findData.image);}
                }


                let findName = await CategoryData.findOne( {name:req.body.name} );
                if (findName && findName.id !== keywords.id) {
                    return res.status(406).json({status:false , message : `failed: category name already used.`});
                  }

                    findData.name =  req.body.name ||   findData.name;
                    findData.image =   file1 ||  findData.image;
                    findData.treatments_name =  req.body.treatments_name ||   findData.treatments_name;
                    findData.treatments_info =  req.body.treatments_info ||   findData.treatments_info;
                    findData.status =    req.body.status || findData.status;
                    await findData.save();

                    res.status(200).json({status:true , message:'success' , data: findData});
        
                
            }
    }
    catch(err){
        return err;
    }
}

const categoryPatch = async (req,res) =>{
    try{
        let keywords = req.query;
        if(!keywords.id) return res.status(406).json({status:false , message : `failed: id missing`});
        let findData = await CategoryData.updateOne({_id: keywords.id } , {
            $set : req.body
        });
        res.status(200).json({status:true , message:'success' , data: findData});
}
    catch(err){
        return err;
    }
}

const categoryDelete = async (req,res) =>{
    try{
        let keywords = req.query;
        if(!keywords.id) return res.status(406).json({status:false , message : `failed: id missing`});
        let deleteData = await CategoryData.findByIdAndDelete({_id:keywords.id });
        if(!deleteData){
            return res.status(406).json({status:false , message : `failed: data not found`})
        }
        else{
            res.status(200).json({status:true , message:'success'});
        }
}
    catch(err){
        return err;
    }
}

module.exports = {categoryGet, categoryPost, categoryPut, categoryPatch, categoryDelete};

