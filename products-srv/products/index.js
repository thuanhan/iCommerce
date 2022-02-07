import Product from "../models/productModel";
import createProductsEndpointHandler from "./productsEndpoint";
import createProductsMessageHandler from "./productsMessage";

const productsEndpointHandler = createProductsEndpointHandler({ Product });
const productsMessageHandler = createProductsMessageHandler({Product});

export { productsEndpointHandler, productsMessageHandler };
