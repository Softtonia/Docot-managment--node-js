const BranchData = require("../models/branchSchema");



const branchGet = async (req,res) =>{
    try{
  
            let findData = await BranchData.find().sort({ createdAt: 'desc' });
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


const branchPost = async (req,res) =>{
    try{
            let {name,address} = req.body;
            if(!name|| !address){
                return res.status(406).json({status:false , message : 'some field are required.'})
            }

            name = name.toLowerCase();
            let countCopy = await BranchData.find({name:name}).countDocuments();
            if(countCopy>0) return res.status(406).json({status:false , message : 'failed: branch name already used.'});
            

            else{

                // const lastData = await BranchData.findOne().sort({ createdAt: -1 });
                // const nextId = lastData ? parseInt(lastData.assign_id.substring(3)) + 1 : 1;
                // const newId = `VAB${nextId.toString().padStart(3, '0')}`;


                let newData = new BranchData({
                    name,address})
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

const branchPut = async (req,res) =>{
    try{

            let keywords = req.query;
            if(!keywords.id) return res.status(406).json({status:false , message : `failed: branch id missing`}).sort({ createdAt: 'desc' });
            let findData = await BranchData.findById({_id:keywords.id });
            if(!findData){
                return res.status(406).json({status:false , message : `failed: data not found`})
            }
            else{

                let findName = await BranchData.findOne( {name:req.body.name} );
                if (findName && findName.id !== keywords.id) {
                    return res.status(406).json({status:false , message : `failed: branch name already used.`});
                  }

                findData.name =  req.body.name || findData.name, 
                findData.address =  req.body.address || findData.address,
                await findData.save();
                res.status(200).json({status:true , message:'success: updation successs'});
            }
    }
    catch(err){
        return err;
    }
}
const branchPatch = async (req,res) =>{
    try{
        let keywords = req.query;
        if(!keywords.id) return res.status(406).json({status:false , message : `failed: branch id missing`});

        let findData = await BranchData.updateOne({_id: keywords.id } , {
            $set : req.body
        });
        res.status(200).json({status:true , message:'success' , data: findData});
}
    catch(err){
        return err;
    }
}

const branchDelete = async (req,res) =>{
    try{
        let keywords = req.query;

        if(!keywords.id) return res.status(406).json({status:false , message : `failed: branch id missing`});
        let deleteData = await BranchData.findByIdAndDelete({_id:keywords.id });
        if(!deleteData){
            return res.status(406).json({status:false , message : `failed: data not found`});
        }
        else{
            res.status(200).json({status:true , message:'success'});
        }
}
    catch(err){
        return err;
    }
}


// async function getNextId(props) {
//     const lastData = await props.findOne({}, { sort: { createdDate: -1 } });
//     console.log(lastData , 'lastData')

//     if (!lastData) return 1;

//     // console.log(parseInt(lastData.addressId.slice(3)) , 'lastData')
//     console.log(lastData.assign_id.slice(3) , 'lastData')

//     const lastDataId = +lastData.assign_id.slice(3);
//     console.log(lastDataId , 'lastDataId')
//     return lastDataId + 1;
//   }


async function getNextId(props) {
    const lastData = await props.findOne({}).sort({ createdDate: -1 });
    console.log(lastData , '======== lastData ==========');

    if (!lastData) return "ABC1";
        // const lastDataId = +lastData[0].addressId.slice(3);
        const lastDataId = parseInt(lastData.assign_id.slice(3,4));
        console.log(lastDataId , 'lastDataId <<<>>>');
        console.log(lastDataId , '======== lastDataId ==========');
        return "ABC" + (lastDataId + 1);
  }



module.exports = {branchGet, branchPost,branchPut, branchPatch, branchDelete};

