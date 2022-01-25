import createHttpError from "../helpers/httpError";
import createHttpSuccess from "../helpers/httpSuccess";

export default function createProductsEndpointHandler({ productModel }) {
  return async function handle(httpRequest) {
    switch (httpRequest.method) {
      // case 'POST':
      //   return postContact(httpRequest)

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
}
