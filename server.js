const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const env = require('dotenv')
const mongoose = require('mongoose')
const router = express.Router()
const cors = require('cors')

//  MONGODB
mongoose.connect('mongodb://localhost/prueba-db')
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err))

// settings
env.config()
app.use(express.json())
app.use(cors())
app.use('/api', router)


//require('./app/events/socket')(io)

let parametros = []
let USERS = {}

io.on('connection', (socket) => {
    // connect
    console.log(`${socket.id} was connected`)
    USERS[socket.id] = socket

    // send
    socket.on('send', (data) => {
        parametros.push(data)
        console.log(parametros)
    })

    // disconnect
    socket.on('disconnect', () => {
        console.log(`${socket.id} was disconnected`)
    })
})

setInterval(() => {
    // TOOD SEND PACKAGE
    for (let i in USERS) {
        USERS[i].emit('update', parametros)
    }
    
}, 1000 / 25)

// ENDPOINTS
//app.use('/api', require('./routes/api'))

const Parametro = require('./app/models/Parametro')

router.get('/parametro', async (req, res) => {
    const parametros = await Parametro.find()
    res.json(parametros)
})

router.post('/parametro', async (req, res) => {
    console.log(req.body)
    const parametro = new Parametro(req.body)
    parametro.createdAt = new Date()
    await parametro.save()
    parametros.push(parametro.temperature)
    res.json({
        status: 'parametro saved'
    })
})

server.listen(process.env.SOCKET_PORT, () => {
    console.log(`server works in ${process.env.SOCKET_PORT}`)
})

//app.use(express.static(`${__dirname}/dist`))