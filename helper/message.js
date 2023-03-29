const ChatMessageData = require("../models/chatMessageSchema");
const ChatData = require("../models/chatSchema");

const message = async (props) =>{

    console.log(props , 'message');

    let createMessage = new ChatMessageData(props);
    await createMessage.save();

    await ChatData.updateOne({_id: props.chat} , {
        $set : {
            latest_message : createMessage
        }
    })

    return createMessage;
}
module.exports = message;