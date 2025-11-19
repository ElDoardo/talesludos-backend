require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const routes = require('./src/routes');
const errorHandler = require('./src/middlewares/errorHandler');
const seedAreas = require('./src/scripts/seedAreas');

const app = express();

const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || `
  http://localhost:8080,
  http://127.0.0.1:8080,
  http://localhost:8081,
  http://127.0.0.1:8081
`).split(',').map(s => s.trim()).filter(Boolean);

const corsOptions = {
  origin(origin, cb) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error(`Not allowed by CORS: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use('/storage', express.static(path.join(__dirname, 'storage')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (req.is('multipart/form-data')) {
    const len = Number(req.headers['content-length'] || 0);
    if (len > 5 * 1024 * 1024) return res.status(413).json({ error: 'Arquivo muito grande' });
  }
  next();
});

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api', routes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await seedAreas();
  } catch (e) {
    console.error('Erro ao verificar banco de dados:', e);
  }

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log('CORS whitelist:', ALLOWED_ORIGINS.join(', '));
  });
})();

module.exports = app;
