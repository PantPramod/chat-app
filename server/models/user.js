import mongoose from "mongoose"


const userSchema = new mongoose.Schema({

    userName: String,
    socketId: String
})


export default mongoose.model('user', userSchema)

