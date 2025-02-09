import express from 'express';
import { connectDB } from './config/database';
import { config } from './config/env';
import middleware from './middleware/middleware' 
import indexRoutes from './routes/index';
const app = express();

app.use(middleware);
app.use('/api', indexRoutes);

const PORT = config.server.port || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});