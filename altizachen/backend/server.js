import express from 'express';
import data from './data.js';

/* in order to make the server lisen to each change in it we add:
 "scripts": { "start": "nodemon server.js" }
*/

const app = express();
// return lisrt of ads from backend
app.get('/api/ads', (req, res) => {
  res.send(data.ads);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
