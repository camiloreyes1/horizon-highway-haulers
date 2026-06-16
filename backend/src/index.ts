import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import quoteRouter from './routes/quote';

const app = express();
const PORT = process.env.PORT ?? 3000;

const allowedOrigin = process.env.ALLOWED_ORIGIN ?? '*';
app.use(cors({ origin: allowedOrigin === '*' ? true : allowedOrigin }));
app.use(express.json());

app.use('/api/quote', quoteRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
