
const fs = require('fs');


const deletefile = async (filename) =>{
       if(!filename) return ;

       fs.unlink( filename.replace(process.env.SERVER_FILEUPLOAD_URL , `public/uploads/` ) , (err)=>{
        if(err){
            console.log(`File deletion failed Error : ${err}`);
        }
        else{
            console.log(`File ${filename} deletion success`);
        }
    } )

}

module.exports = deletefile