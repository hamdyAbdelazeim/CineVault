import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';
import movieRoutes from './routes/movie.routes';
import { errorHandler, notFound } from './middleware/error.middleware';

const app = express();
const PORT = process.env.PORT ?? 5000;
const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/cinevault';
const CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:3000';

// ---------------------------------------------------------------------------
// Global Middleware
// ---------------------------------------------------------------------------
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true, // Required so the browser sends the HttpOnly cookie cross-origin
  }),
);
app.use(express.json());
app.use(cookieParser());

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.get('/api/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

// ---------------------------------------------------------------------------
// Error Handling (must be registered after all routes)
// ---------------------------------------------------------------------------
app.use(notFound);
app.use(errorHandler);

// ---------------------------------------------------------------------------
// Database Connection & Server Start
// ---------------------------------------------------------------------------
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`),
    );
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  });
