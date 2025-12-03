const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();
//const crypto = require('crypto'); // no se para que se usa pero lei que es para seguridad jaja

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

// mejor uso la pta libreria de express alv
app.use(cors());

const apiKeyMiddleware = (request, response, next) => {
  const apiKey = request.header('X-API-KEY');
  if(!apiKey) {
    return response.status(401).json({ error: 'Unauthorized'});
  }
  if (apiKey !== process.env.X_API_KEY) {
    return response.status(403).json({ error: 'Forbidden'});
  }
  next();
}

app.use(apiKeyMiddleware); 
// TODO: Instalar en el server api de Firebase (FireStore)

app.get('/api/daily', async (req, res) => {
  try {
    const response = await fetch('https://rae-api.com/api/random?max_length=5&min_length=5');
    const data = await response.json();
    res.set('Access-Control-Allow-Origin', '*');
    res.json(data);
  } catch (error) {
    console.error('Error al obtener la palabra de la RAE:', error);
    res.status(500).json({ error: 'Error fetching data from RAE API' });
  }
});

app.get('/api/words/:word', async (req, res) => {
  const word = req.params.word;
  try {
    const response = await fetch(`https://rae-api.com/api/words/${encodeURIComponent(word)}?max_length=5&min_length=5`);
    const data = await response.json();
    res.set('Access-Control-Allow-Origin', '*');
    res.json(data);
  } catch (error) {
    console.error(`Error al validar la palabra "${word}":`, error);
    res.status(500).json({ error: 'Error fetching data from RAE API' });
  }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
})