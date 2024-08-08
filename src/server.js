const express = require('express');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const port = 3000;

// Configura el API de Twitter
const consumer_key = 'TU_CONSUMER_KEY';
const consumer_secret = 'TU_CONSUMER_SECRET';
const access_token = 'TU_ACCESS_TOKEN';
const access_token_secret = 'TU_ACCESS_TOKEN_SECRET';

// Configurar OAuth
const oauth = OAuth({
  consumer: { key: consumer_key, secret: consumer_secret },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return crypto.createHmac('sha1', key).update(base_string).digest('base64');
  },
});

// Ruta para obtener los últimos tweets
app.get('/api/tweets', async (req, res) => {
  const username = req.query.username;
  const url = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}&count=10`;
  const authHeader = oauth.toHeader(oauth.authorize({ url, method: 'GET' }, { key: access_token, secret: access_token_secret }));

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...authHeader,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  res.json(data);
});

// Sirve los archivos estáticos
app.use(express.static('public'));

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
