import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import handleUsersRequest from "./users";
import handleProductsRequest from "./products";
import adaptRequest from "./helpers/adaptRequest";

const app = express();
mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost/icommerce", {
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

app.use("/users", usersController);
app.get("/users/:id", usersController);

function usersController(req, res) {
  const httpRequest = adaptRequest(req);
  handleUsersRequest(httpRequest)
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

const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
