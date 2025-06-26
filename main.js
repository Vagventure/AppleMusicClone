import express from 'express';
import serveIndex from 'serve-index';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const port = 3000;

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

app.get('/Radio/:slug', (req, res) => {
   const artistName = req.params.slug;
   const routePath = "FM";
   res.render('playlist', { route: routePath, artist: artistName });
});

app.get('/Playlist/:slug', (req, res) => {
   const artistName = req.params.slug;
   const routePath = "NewReleases";
   res.render('playlist', { route: routePath, artist: artistName });
});

app.get('/home', (req, res) => {
   res.sendFile('new.html', { root: __dirname });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

