import createHttpError from "../../helpers/httpError";
import createHttpSuccess from "../../helpers/httpSuccess";

const STATUS = {
  PREPARE_PRODUCT: "Prepare Product",
  FAIL: "Fail",
  SUCCESS: "Success",
};

const QUEUE = {
  PRODUCT: "PRODUCT",
  ORDER: "ORDER",
};

var channel;
export default function createOrdersEndpointHandler({ Order }) {
  return async function handle(httpRequest, amqpChannel) {
    channel = amqpChannel;
    switch (httpRequest.method) {
      case "POST":
        return postOrder(httpRequest);

      case "GET":
        return getOrders(httpRequest);

      default:
        return createHttpError({
          statusCode: 405,
          errorMessage: `${httpRequest.method} method not allowed.`,
        });
    }
  };

  async function getOrders(httpRequest) {
    const { id } = httpRequest.pathParams || {};

    const result = id
      ? await Order.findById(id)
      : await searchOrders(httpRequest);
    return createHttpSuccess({
      result,
    });
  }

  async function searchOrders(httpRequest) {
    const queryParams = httpRequest.queryParams || {};
    const pageSize = 5;
    const page = Number(queryParams.pageNumber) || 1;
    const name = queryParams.name || "";
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
    const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
    const sortOrder =
      order === "lowest"
        ? { price: 1 }
        : order === "highest"
        ? { price: -1 }
        : { _id: -1 };

    return await Order.find({
      ...nameFilter,
      ...priceFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);
  }

  async function postOrder(httpRequest) {
    let orderInfo = httpRequest.body;
    if (!orderInfo) {
      return createHttpError({
        statusCode: 400,
        errorMessage: "Bad request. No POST body.",
      });
    }

    if (typeof httpRequest.body === "string") {
      try {
        orderInfo = JSON.parse(orderInfo);
      } catch (e) {
        return createHttpError({
          statusCode: 400,
          errorMessage: "Bad request. POST body must be valid JSON.",
        });
      }
    }

    try {
      const order = new Order({
        ...orderInfo,
        status: STATUS.PREPARE_PRODUCT,
      });
      const result = await order.save();
      channel.sendToQueue(
        QUEUE.PRODUCT,
        Buffer.from(
          JSON.stringify({
            order
          })
        )
      );
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
