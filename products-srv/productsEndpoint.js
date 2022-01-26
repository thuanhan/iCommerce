import createHttpError from "../helpers/httpError";
import createHttpSuccess from "../helpers/httpSuccess";
import Product from "./src/models/productModel";

export default function createProductsEndpointHandler({ productModel }) {
  return async function handle(httpRequest) {
    switch (httpRequest.method) {
      case "POST":
        return postProduct(httpRequest);

      case "GET":
        return getProducts(httpRequest);

      default:
        return createHttpError({
          statusCode: 405,
          errorMessage: `${httpRequest.method} method not allowed.`,
        });
    }
  };

  async function getProducts(httpRequest) {
    const { id } = httpRequest.pathParams || {};

    const result = id
      ? await productModel.findById({ productId: id })
      : await productModel.find({});
    return createHttpSuccess({
      result,
    });
  }

  async function postProduct(httpRequest) {
    let productInfo = httpRequest.body;
    if (!productInfo) {
      return createHttpError({
        statusCode: 400,
        errorMessage: "Bad request. No POST body.",
      });
    }

    if (typeof httpRequest.body === "string") {
      try {
        productInfo = JSON.parse(productInfo);
      } catch {
        return createHttpError({
          statusCode: 400,
          errorMessage: "Bad request. POST body must be valid JSON.",
        });
      }
    }

    try {
      const product = new Product({
        ...productInfo,
      });
      const result = await product.save();
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 201,
        data: JSON.stringify(result),
      };
    } catch (e) {
      return createHttpError(e);
    }
  }
}
