
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import movieRoutes from './routes/movies.js';
import showRoutes from './routes/shows.js';
import bookingRoutes from './routes/bookings.js';

const app = express();

const allowedOrigins = [
  'https://imovies-pied.vercel.app',
  'https://imovies-aaijczmql-matrix-1ba2.vercel.app',
  'https://imovies-ou1rcfyui-matrix-1ba2.vercel.app',
  'http://localhost:5173'
];

app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header (e.g. health checks).
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    }
  })
);

app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'IMovies API' });
});

app.use(
  '/api/auth',
  rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }),
  authRoutes
);

app.use('/api/movies', movieRoutes);
app.use('/api/shows', showRoutes);

app.use(
  '/api/bookings',
  rateLimit({ windowMs: 15 * 60 * 1000, max: 30 }),
  bookingRoutes
);

app.use((err, req, res, next) => {
  console.error('Server error:', err.message);

  if (err.message?.startsWith('CORS blocked origin:')) {
    return res.status(403).json({ message: err.message });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
});

const port = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    console.log('MongoDB connected');

    app.listen(port, '0.0.0.0', () => {
      console.log(`IMovies API running on port ${port}`);
    });
  } catch (error) {
    console.error('Startup failed:', error.message);
    process.exit(1);
  }
}

startServer();
