const mongoose = require('mongoose')
const { Schema } = mongoose

const Parametro = new Schema({
    temperature: Number,
    humidity: Number,
    createdAt: Date
})

module.exports = mongoose.model('Parametro', Parametro)