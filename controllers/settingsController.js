const deletefile = require("../helper/deletefile");
const SettingsData = require("../models/settingsSchema");

const settingsGet = async (req,res) =>{
    try{
        let keywords = req.query;

        if(keywords.id){
            let findData = await SettingsData.find({_id:keywords.id});
            if(findData){
                res.status(200).json({status:true , message :'success' , data:findData });
            }
            else{
                res.status(404).json({status:false , message :'failed'});
            }
        }

        else{
            let findData = await SettingsData.find();
            if(findData){
                let count = findData.length;
                res.status(200).json({status:true , message :'success', total : count  , data:findData });
            }
            else{
                res.status(404).json({status:false , message :'failed'});
            }
        }
    }
    catch(err){
        return err;
    }
}

const settingsPost = async (req,res) =>{
    try{
            let {    
                hospital_name,
                contact,
                email,
                gst,
                address,
                state,
                district,
                country,
                timezone} = req.body;

                let findData = await SettingsData.findOne();

                if(findData){
                    let file1;
                    if(req.file){
                        file1 = process.env.SERVER_FILEUPLOAD_URL+req.file.filename;
                        if(findData.image){deletefile(findData.image);}
                    }
          

                    findData.hospital_name = hospital_name|| findData.hospital_name,
                    findData.logo = file1 || findData.logo,
                    findData.contact = contact|| findData.contact,
                    findData.email = email|| findData.email,
                    findData.gst = gst|| findData.gst,
                    findData.address = address|| findData.address,
                    findData.state = state|| findData.state,
                    findData.district = district|| findData.district,
                    findData.country = country|| findData.country,
                    findData.timezone = timezone|| findData.timezone
                }

                else{

          
                    let file1;
                    if(req.file){
                        file1 = process.env.SERVER_FILEUPLOAD_URL+req.file.filename;
                    }
                    let newData = new SettingsData({
                        hospital_name,
                        logo : file1,
                        contact,
                        email,
                        gst,
                        address,
                        state,
                        district,
                        country,
                        timezone
                    });
                    let saveData = await newData.save();

                    if(saveData){
                        res.status(200).json({status:true , message:'success' , data:saveData });
                    }
                    else{
                        res.status(406).json({status:false , message:'failed'});
                    }


                }




            
     
    }
    catch(err){
        return err;
    }
}

module.exports = {settingsGet,settingsPost};
