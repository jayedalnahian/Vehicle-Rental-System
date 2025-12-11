//app.ts

import express, { Request, Response } from 'express';
import { initDb } from './config/db';
import { userRoutes, } from './modules/users/user.routes';
import { authRoutes } from './modules/auth/auth.routes';
import { vehiclesRouter } from './modules/vehicles/vehicles.routes';
import { bookingsRouter } from './modules/bookings/booking.routes';
import cors from 'cors'
const app = express()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
initDb().then(connected => {
  if (connected) {
    console.log('Database connected successfully');
  } else {
    console.log('Database connection failed, running in offline mode');
  }
});


app.use('/api/v1/users', userRoutes);

app.use('/api/v1/auth', authRoutes)

app.use('/api/v1/vehicles', vehiclesRouter);

app.use('/api/v1/bookings', bookingsRouter)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});


export default app;