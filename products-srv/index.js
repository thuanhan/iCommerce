import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { productsEndpointHandler, productsMessageHandler } from "./products";
import adaptRequest from "../helpers/adaptRequest";
import amqp from "amqplib";
// import expressAsyncHandler from 'express-async-handler';

const app = express();
mongoose.connect(
  process.env.MONGODB_URL || "mongodb://localhost/products-srv",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
);
app.use(bodyParser.json());

var amqpChannel, amqpConn;
async function connect() {
  const amqpServer = "amqp://localhost:5672";
  amqpConn = await amqp.connect(amqpServer);
  amqpChannel = await amqpConn.createChannel();
  await amqpChannel.assertQueue("PRODUCT");
  console.log("PRODUCT Channel is ready.");

  productsMessageHandler(amqpChannel);

  app.get("/products/:id", productsController);
  app.use("/products", productsController);
}
connect();
// app.get("/products/:id", expressAsyncHandler(productsController));
// app.use("/products", expressAsyncHandler(productsController));

function productsController(req, res) {
  const httpRequest = adaptRequest(req);
  productsEndpointHandler(httpRequest, amqpChannel)
    .then(({ headers, statusCode, data }) =>
      res.set(headers).status(statusCode).send(data)
    )
    .catch((e) => res.status(500).send({ message: e.message }));
}

// app.get('/', (req, res) => {
//   res.send('Server is ready');
// });

// app.use((err, req, res, next) => {
//   res.status(500).send({ message: err.message });
//   // console.log(err.message);
// });

const port = process.env.PORT || 5151;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});

var gracefulExit = function () {
  mongoose.connection.close(function () {
    console.log(
      "Mongoose default connection is disconnected through app termination"
    );
    process.exit(0);
  });
};

// If the Node process ends, close the Mongoose connection
process.on("SIGINT", gracefulExit).on("SIGTERM", gracefulExit);
