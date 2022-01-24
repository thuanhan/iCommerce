import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routers/userRouter.js';

const app = express();
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/icommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
app.use('/api/users', userRouter);
app.get('/', (req, res) => {
  res.send('Server is ready');
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
