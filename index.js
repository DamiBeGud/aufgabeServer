require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')


const Item = require('./Item')
const app = express()

app.use(cors())
app.use(bodyParser.json())
// make it async
const PORT = process.env.PORT || 3000;
const connectDB = async ()=>{
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI)
    // || 'mongodb://localhost:27017/test'
    console.log(`Mongo DB conneced: ${connect.connection.host}`)
  } catch (error) {
    console.log(`Error: ${error.message}`)
    process.exit(1)
  }
}
app.post('/post', (req, res) => {
  const { input1, input2 } = req.body
    try {
        const item = new Item({item1: input1, item2: input2})
        console.log(item)
        item.save()
        const responseData = {
          message: `Received input1: ${input1}, input2: ${input2}`
        }
        res.json(responseData)
    } catch (error) {
        console.log(error.message)
    }
})
app.get('/get', async (req, res) => {
  try {
    const items = await Item.find()
    console.log(items)
    const responseData = {
      items: items 
    }
    res.json(responseData);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error retrieving items' })
  }
});
app.delete('/delete/:itemId', async (req, res) => {
  const itemId = req.params.itemId;
  try {
    const deleteResult = await Item.deleteOne({ _id: itemId });
    res.json({message:`Items with id: ${itemId} are deleted`})
    if (deleteResult.deletedCount === 1) {
      // res.json({ message: 'Item deleted successfully' });
      console.log("deleted")
    } else {
      // res.status(404).json({ message: 'Item not found' });
      console.log("error")
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

connectDB().then(()=>{
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })

})