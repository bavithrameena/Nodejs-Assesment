// server.js
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';


import authRoutes from "./src/router/auth.route.js"
import adminRoutes from "./src/router/admin.route.js"
import { rateLimiter } from './src/middleware/rateLimiting.middleware.js';
dotenv.config();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());




app.use(rateLimiter)
// Default route
app.get('/health', (req, res) => {
  res.send('Welcome');
});

app.use("/api/auth",authRoutes)
app.use("/api/admin",adminRoutes)

// MongoDB connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URL

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(' Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(' MongoDB connection error:', error);
  });
