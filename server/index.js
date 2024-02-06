import express from 'express'
const app = express()
import { Server } from 'socket.io'
import { createServer } from 'http'
import cors from 'cors'
const PORT = process.env.PORT || 8000
const DB_URL = "mongodb+srv://pramod:kLSLvmKRdI0Kc8Mr@cluster0.l54vkg0.mongodb.net/myapp"
// const DB_URL = "mongodb://localhost:27017/myapp"
import connectDb from './config/connectDb.js'
import user from './models/user.js'
import msg from './models/message.js'
const server = createServer(app);

const io = new Server(server, {
    cors: { origin: "*" }
});


io.on('connection', async (socket) => {
    console.log("User Connected", socket.id)
    socket.on('joinroom', async (userName) => {
        socket.join(userName)
        console.log(`Room ${userName} joined by socket Id : ${socket.id}`)
        
        try {
            const doc = await user.findOneAndUpdate({ userName }, { socketId: socket.id, status:true }, {
                returnOriginal: false
            });
            if (doc?.userName) {
                socket.broadcast.emit('status', 1, doc?.userName)
                const allUsers = await user.find();
                socket.emit('allusers', allUsers)
            }
        } catch (err) {
            console.log(err)
        }
    })


    socket.on('sendmessage', async (message, sendTo, from) => {
        try {
            await msg.create({ sender: from, receiver: sendTo, message })
            socket.to(sendTo).emit('sendmessage1', message, from,sendTo);
        } catch (err) {
            console.log(err)
        }

    })

    socket.on('recover', async (userName, sendTo) => {
        try {
            const messages = await msg.find({
                $or: [
                    { sender: userName, receiver: sendTo },
                    { sender: sendTo, receiver: userName },
                ]
            })

            socket.emit("recover", messages)

        } catch (e) {
            console.log(e)
        }
    })

    socket.on('disconnect', async () => {
        console.log("Disconnected from the server")
        try {
            const userDetails = await user.findOne({ socketId: socket?.id })
            if(userDetails?.userName) {
                socket.broadcast.emit('status', 0, userDetails?.userName)

                 await user.findOneAndUpdate({ userName:userDetails?.userName }, { status: false }, {
                    returnOriginal: false
                });
            }
        } catch (err) {
            console.log(err)
        }


    })
})

app.use(cors())
app.use(express.json())


app.post('/createaccount', async (req, res) => {
    try {
        const { userName } = req.body
        const isExist = await user.findOne({ userName })
        if (isExist) {
            res.status(400).send("User Name has taken try another")
        } else {
            const newUser = await user.create({ userName })
            res.send(newUser)
        }

    } catch (err) {
        console.log(err)
    }
})


app.get('/allusers', async (req, res) => {
    try {
        const allUsers = await user.find();
        res.send(allUsers)
    } catch (err) {
        console.log(err)
    }
})

app.post('/login', async (req, res) => {
    try {
        const { userName } = req.body
        const userDetails = await user.findOne({ userName })
        if (!userDetails) {
            res.status(404).send("User Not Found")
        } else {
            res.send(userDetails)
        }
    } catch (err) {
        console.log(err)
    }

})

server.listen(PORT, () => {
    console.log("Server listening at PORT", PORT)
    connectDb(DB_URL)
})

