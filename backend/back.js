import express from "express"
import mongoose from "mongoose"
import { Account } from "../models/account.js"
import cors from "cors"
import bcrypt, { hash } from "bcrypt"
import session from "express-session"
import MongoStore from "connect-mongo"

let conn = await mongoose.connect("mongodb://localhost:27017/AppleMusic")
const app = express()
const port = 5000

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))
app.use(express.json())
app.use(session({
  secret: "hello12345",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: "mongodb://localhost:27017/AppleMusic",
    collectionName: 'sessions',
    stringify: false
  }),
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 30,
    sameSite: "none",
  }
}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/registor', async (req, res) => {
  console.log(req.body)
  const salt = await bcrypt.genSalt(10)
  const encryptpass = await bcrypt.hash(req.body.userpass, salt)
  const acc = new Account({ username: req.body.username, password: encryptpass })
  acc.save()
  res.json({ success: true, message: "Successfully registored" })
})

app.post('/login', async (req, res) => {
  const { username, userpass } = req.body

  try {
    const user = await Account.findOne({ username })
    if (!user) {
      return res.json({ success: false, message: "User not found" })
    }

    const isMatch = await bcrypt.compare(userpass, user.password)
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password" })
    }
    req.session.user = user._id
    console.log("Session id: ", req.session)
    res.json({ success: true, message: "Login successfull" })
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
