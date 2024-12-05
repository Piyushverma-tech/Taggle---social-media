import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    chatId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true
    },
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: String,

},  {timestamps: true},   );



export const Messages = mongoose.model('Messages', messageSchema);