import express from 'express';
import commandRoutes from './routes/command.routes.js';
import sessionRoutes from './routes/session.routes.js';
import { authMiddleware } from './middlewares/auth.middleware.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({
    ok: true,
    message: 'Server is running'
  });
});

app.use('/commands', authMiddleware, commandRoutes);
app.use('/sessions', authMiddleware, sessionRoutes);

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    ok: false,
    message: 'Internal server error'
  });
});

export default app;