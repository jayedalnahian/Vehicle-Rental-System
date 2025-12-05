import express, { Request, Response } from 'express';
import { initDb } from './config/db';
import { userRoutes, } from './modules/users/user.routes';
import { authRoutes } from './modules/auth/auth.routes';
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
initDb()


app.use('/api/v1/users', userRoutes);

app.use('/api/v1/auth', authRoutes)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})




export default app;