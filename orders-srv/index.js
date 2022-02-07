import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { ordersEndpointHandler, ordersMessageHandler } from "./orders";
import adaptRequest from "../helpers/adaptRequest";
import amqp from "amqplib";

const app = express();
mongoose.connect(
  process.env.MONGODB_URL || "mongodb://localhost/orders-srv",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  () => {
    console.log(`order-src DB connected`);
  }
);
app.use(bodyParser.json());

var amqpChannel, amqpConn;
async function connect() {
  const amqpServer = "amqp://localhost:5672";
  amqpConn = await amqp.connect(amqpServer);
  amqpChannel = await amqpConn.createChannel();
  await amqpChannel.assertQueue("ORDER");
  console.log("ORDER Channel is ready.");
  ordersMessageHandler(amqpChannel);

  app.get("/orders/:id", ordersController);
  app.use("/orders", ordersController);
}
connect();

// app.get("/orders/:id", ordersController);
// app.use("/orders", ordersController);

function ordersController(req, res) {
  const httpRequest = adaptRequest(req);
  ordersEndpointHandler(httpRequest, amqpChannel)
    .then(({ headers, statusCode, data }) =>
      res.set(headers).status(statusCode).send(data)
    )
    .catch((e) => res.status(500).send({ message: e.message }));
}

const port = process.env.PORT || 6161;
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
