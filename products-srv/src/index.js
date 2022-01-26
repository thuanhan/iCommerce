import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import handleProductsRequest from "./products";
import adaptRequest from "../../helpers/adaptRequest";

const app = express();
mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost/products-srv", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use(bodyParser.json());

app.use("/products", productsController);
app.get("/products/:id", productsController);

function productsController(req, res) {
  const httpRequest = adaptRequest(req);
  handleProductsRequest(httpRequest)
    .then(({ headers, statusCode, data }) =>
      res.set(headers).status(statusCode).send(data)
    )
    .catch((e) => res.status(500).end());
}

// app.get('/', (req, res) => {
//   res.send('Server is ready');
// });

// app.use((err, req, res, next) => {
//   res.status(500).send({ message: err.message });
// });

const port = process.env.PORT || 5151;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});

var gracefulExit = function() { 
  mongoose.connection.close(function () {
    console.log('Mongoose default connection is disconnected through app termination');
    process.exit(0);
  });
}

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);
