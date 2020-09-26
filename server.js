const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const env = require('dotenv')
const mongoose = require('mongoose')
const router = express.Router()
const cors = require('cors')

//  MONGODB
mongoose.connect('mongodb://localhost/prueba-db', { useNewUrlParser: true, useUnifiedTopology: true } )
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err))

// settings
env.config()
app.use(express.json())
app.use(cors())
app.use('/api', router)


//require('./app/events/socket')(io)

let parametros = {
    t: [],
    h: [],
    date: []
}
// const t = []
// const h = []
// const date = []
let socketLed = false
let USERS = {}

io.on('connection', (socket) => {
    // connect
    console.log(`${socket.id} was connected`)
    USERS[socket.id] = socket

    // escucha

    // disconnect
    socket.on('disconnect', () => {
        console.log(`${socket.id} was disconnected`)
    })
})

setInterval(() => {
    // TOOD SEND PACKAGE
    for (let i in USERS) {
        USERS[i].emit('led', socketLed)
    }
    
}, 1000 / 25)

setInterval(() => {
    // TOOD SEND PACKAGE
    for (let i in USERS) {
        USERS[i].emit('params', parametros)
    }
    
}, 5000)

// ENDPOINTS
//app.use('/api', require('./routes/api'))

const Parametro = require('./app/models/Parametro')
const Led = require('./app/models/Led')

router.get('/parametro', async (req, res) => {
    parametros = {
        t: [],
        h: [],
        date: []
    }
    const params = await Parametro.find().sort({_id:-1}).limit(10)
    params.forEach(dato => {
        parametros.t.push(dato.temperature)
        parametros.h.push(dato.humidity)
        parametros.date.push(dato.createdAt)
    })
    res.json(parametros)
})

router.get('/led', async (req, res) => {
    const ledStatus = await Led.find().sort({_id:-1}).limit(1)
    res.json(ledStatus[0].ledStatus)
})

router.post('/parametro', async (req, res) => {
    const parametro = new Parametro(req.body)
    parametro.createdAt = new Date()
    await parametro.save()
    parametros = {
        t: [],
        h: [],
        date: []
    }
    params = await Parametro.find().sort({_id:-1}).limit(10)
    params.forEach(dato => {
        parametros.t.push(dato.temperature)
        parametros.h.push(dato.humidity)
        parametros.date.push(dato.createdAt)
    })
    res.json({
        status: 'saved'
    })
})

router.post('/led', async (req, res) => {
    const led = new Led(req.body)
    led.createdAt = new Date()
    socketLed = led.ledStatus
    await led.save()
    res.json({
        status: led.ledStatus
    })
})

server.listen(process.env.SOCKET_PORT, () => {
    console.log(`server works in ${process.env.SOCKET_PORT}`)
})

//app.use(express.static(`${__dirname}/dist`))