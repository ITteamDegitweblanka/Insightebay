
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './initDb.js';
import router from './routes.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('eBay Performance API Running');
});

app.use('/api', router);

const PORT = process.env.PORT || 5000;
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
