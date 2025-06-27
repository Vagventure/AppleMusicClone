import express from "express"
import mongoose from "mongoose"
import { Account } from "../models/account.js"
import cors from "cors"
import bodyParser from "body-parser"

let conn = await mongoose.connect("mongodb://localhost:27017/AppleMusic")
const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/', (req,res) =>{
console.log(req.body)
const acc = new Account({username: req.body.username, password: req.body.userpass})
acc.save()
res.send('Hello PostMan')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
