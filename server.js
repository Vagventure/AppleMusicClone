import express from 'express';
import serveIndex from 'serve-index';
import mongoose from "mongoose"
import { Account } from './models/account.js';
import bcrypt, { hash } from "bcrypt"
import session from "express-session"
import MongoStore from "connect-mongo"
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

let conn = await mongoose.connect("mongodb://localhost:27017/AppleMusic")
const app = express();
const port = 3000;

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
      maxAge: 1000 * 60 * 3,
   }
}))


// Needed to simulate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views/pages'));
app.use(express.static(join(__dirname, 'public')));
app.use('/FM', serveIndex(join(__dirname, 'public/FM'), { icons: true }));
app.use('/NewReleases', serveIndex(join(__dirname, 'public/NewReleases'), { icons: true }));

app.get('/new', (req, res) => {
   res.sendFile('index.html', { root: join(__dirname, 'public') });

});

console.log({ root: __dirname });

app.get('/api/check-session', (req, res) => {
   if (!req.session.user) {
      console.log("Session id: ", req.session.user)
      return res.json({ login: false, message: "User not logged in" })
   }
   res.json({ login: true, message: "User logged in" })
})


app.get('/Radio/:slug', (req, res) => {
   const artistName = req.params.slug;
   const routePath = "FM";
   res.render('playlist', { route: routePath, artist: artistName });
});

app.get('/Playlist/:slug', (req, res) => {
   console.log("Session id: ", req.session.user)
   const artistName = req.params.slug;
   const routePath = "NewReleases";
   res.render('playlist', { route: routePath, artist: artistName });
});

app.get('/home', (req, res) => {
   res.sendFile('new.html', { root: __dirname });
});

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
      console.log("Session id: ", req.session.user)
      res.json({ success: true, message: "Login successfull" })
   }
   catch (err) {
      console.log(err)
      res.status(500).json({ success: false, message: "Server error" })
   }
})

app.listen(port, () => {
   console.log(`Example app listening on port ${port}`);
});

