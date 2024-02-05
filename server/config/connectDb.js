import mongoose from "mongoose"

const connectDb = (url) => {
    try {
        mongoose.connect(url)
        //  console.log("Mongodb connected : " )
        mongoose.connection.on('connected', () => {
            console.log("Connected with mongodb")
        })

        mongoose.connection.on('error', () => {
            console.log('Error connecting to the database')
        })
    } catch (err) {
        console.log(err)
    }

}

export default connectDb