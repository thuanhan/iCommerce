import createHttpError from "../../helpers/httpError";
import createHttpSuccess from "../../helpers/httpSuccess";

const QUEUE = {
  PRODUCT: "PRODUCT",
  ORDER: "ORDER",
};

var channel;
export default function createProductsEndpointHandler({ Product }) {
  return async function handle(httpRequest, amqpChannel) {
    channel = amqpChannel;
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
      ? await Product.findById(id)
      : await searchProducts(httpRequest);
    return createHttpSuccess({
      result,
    });
  }

  async function searchProducts(httpRequest) {
    const queryParams = httpRequest.queryParams || {};
    const pageSize = 5;
    const page = Number(queryParams.pageNumber) || 1;
    const name = queryParams.name || "";
    const category = queryParams.category || "";
    const order = queryParams.order || "";
    const min =
      queryParams.min && Number(queryParams.min) !== 0
        ? Number(queryParams.min)
        : 0;
    const max =
      queryParams.max && Number(queryParams.max) !== 0
        ? Number(queryParams.max)
        : 0;
    const rating =
      queryParams.rating && Number(queryParams.rating) !== 0
        ? Number(queryParams.rating)
        : 0;

    const nameFilter = name ? { name: { $regex: name, $options: "i" } } : {};
    const categoryFilter = category ? { category } : {};
    const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
    const ratingFilter = rating ? { rating: { $gte: rating } } : {};
    const sortOrder =
      order === "lowest"
        ? { price: 1 }
        : order === "highest"
        ? { price: -1 }
        : order === "toprated"
        ? { rating: -1 }
        : { _id: -1 };

    return await Product.find({
      ...nameFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);
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
      } catch (e) {
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
