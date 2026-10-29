import 'dotenv/config';import express from 'express';import cors from 'cors';import helmet from 'helmet';import rateLimit from 'express-rate-limit';import connectDB from './config/db.js';import authRoutes from './routes/auth.js';import movieRoutes from './routes/movies.js';import showRoutes from './routes/shows.js';import bookingRoutes from './routes/bookings.js';
const app=express();app.use(helmet());
app.use(cors({
  origin: [
    'https://imovies-pied.vercel.app',
    'https://imovies-aaijczmql-matrix-1ba2.vercel.app',
    'https://imovies-ou1rcfyui-matrix-1ba2.vercel.app',
    'http://localhost:5173'
  ]
}));

