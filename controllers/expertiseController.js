const deletefile = require("../helper/deletefile");
const { ExpertiseData } = require("../models/treatmentSchema");


const expertiseGet = async (req,res) =>{
    try{
        let findData = await ExpertiseData.find().select('-__v').populate('category_info' , '-_id name');
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

const expertisePost = async (req,res) =>{
    try{
            let {name,category_name,category_info,status} = req.body;
            if(!name){
                return res.status(406).json({status:false , message : 'some field are required.'})
            }

            name = name.toLowerCase();
            let countCopy = await ExpertiseData.find({name:name}).countDocuments();

            if(countCopy>0) return res.status(406).json({status:false , message : 'failed: expertise name already used.'})
            else{
                let file1;
                if(req.file){
                    file1 = process.env.SERVER_FILEUPLOAD_URL+req.file.filename;
                }

                let newData = new ExpertiseData({
                    name,image:file1,category_name,category_info,status
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

const expertisePut = async (req,res) =>{
    try{
            if(req.body.name){

                req.body.name = req.body.name.toLowerCase();
            }


            let keywords = req.query;
            if(!keywords.id) return res.status(406).json({status:false , message : `failed: id missing`});
            let findData = await ExpertiseData.findOne({_id:keywords.id });



            if(!findData){
                return res.status(406).json({status:false , message : `failed: data not found`})
            }
            else{
                let file1;
                if(req.file){
                    file1 = process.env.SERVER_FILEUPLOAD_URL+req.file.filename;
                    if(findData.image){deletefile(findData.image);}
                }


                let findName = await ExpertiseData.findOne( {name:req.body.name} );
                if (findName && findName.id !== keywords.id) {
                    return res.status(406).json({status:false , message : `failed: expertise name already used.`});
                  }


                    findData.name =  req.body.name ||   findData.name;
                    findData.image =   file1 ||  findData.image;
                    findData.category_name =  req.body.category_name ||   findData.category_name;
                    findData.category_info =  req.body.category_info ||   findData.category_info;
                    findData.status =    req.body.status || findData.status;
                    await findData.save();

                    res.status(200).json({status:true , message:'success' , data: findData});
        
                
            }
    }
    catch(err){
        return err;
    }
}

const expertisePatch = async (req,res) =>{
    try{
        let keywords = req.query;
        if(!keywords.id) return res.status(406).json({status:false , message : `failed: id missing`});
        let findData = await ExpertiseData.updateOne({_id: keywords.id } , {
            $set : req.body
        });
        res.status(200).json({status:true , message:'success' , data: findData});
}
    catch(err){
        return err;
    }
}

const expertiseDelete = async (req,res) =>{
    try{
        let keywords = req.query;
        if(!keywords.id) return res.status(406).json({status:false , message : `failed: id missing`});
        let deleteData = await ExpertiseData.findByIdAndDelete({_id:keywords.id });
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

module.exports = {expertiseGet, expertisePost, expertisePut, expertisePatch, expertiseDelete};

