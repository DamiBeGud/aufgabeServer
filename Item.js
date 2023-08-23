const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    item1: String,
    item2: String
})


module.exports = mongoose.model("Item", itemSchema)