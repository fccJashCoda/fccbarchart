const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.port || 5555;

let cache;
const url =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

app.use(cors());

app.get('/jsondata', async (req, res) => {
  try {
    if (cache) {
      const data = cache;
      console.log('serving cached data');
      return res.json({ data });
    } else {
      const response = await axios(url);
      const data = (cache = response.data);
      console.log('serving fresh data');
      return res.json({ data });
    }
  } catch (error) {
    return res.json({ error });
  }
});

app.listen(port, () => console.log(`App listening on port ${port}...`));
