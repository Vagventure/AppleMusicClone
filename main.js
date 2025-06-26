const express = require('express')
const serveIndex = require('serve-index')
const path = require('path');
const app = express()
const port = 3000

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views/pages');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/FM', serveIndex(path.join(__dirname, 'public/FM'), { icons: true }));
app.use('/NewReleases', serveIndex(path.join(__dirname, 'public/NewReleases'), { icons: true }));

app.get('/new', (req, res) => {
   res.sendFile('index.html',{root: path.join(__dirname, 'public') })
})

console.log({root:__dirname})

app.get('/Radio/:slug', (req, res) => {
   artistName = req.params.slug;
   routePath = "FM";
   res.render('playlist',{route: routePath,artist: artistName})
})
app.get('/Playlist/:slug', (req, res) => {
   artistName = req.params.slug;
   routePath = "NewReleases";
   res.render('playlist',{route: routePath,artist: artistName})
})

app.get('/home', (req, res) => {
   res.sendFile('new.html',{root: __dirname })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
