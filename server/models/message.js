import mongoose from "mongoose"


const messageSchema = new mongoose.Schema({

    message: String,
    sender: String,
    receiver: String
})


export default mongoose.model('message', messageSchema)

