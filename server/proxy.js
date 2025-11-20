const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 4000;

// TODO: Implementar middleware de autenticación usando una Key en el header llamada X-API-KEY

// TODO: Instalar en el server api de Firebase (FireStore)

app.get('/api/rae', async (req, res) => {
  try {
    const response = await fetch('https://rae-api.com/api/daily?max_length=5&min_length=5');
    const data = await response.json();
    res.set('Access-Control-Allow-Origin', '*');
    res.json(data);
  } catch (error) {
    console.error('Error al obtener la palabra de la RAE:', error); // <-- agrega esto
    res.status(500).json({ error: 'Error fetching data from RAE API' });
  }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
})