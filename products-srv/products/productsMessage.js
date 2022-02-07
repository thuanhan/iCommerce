const QUEUE = {
  PRODUCT: "PRODUCT",
  ORDER: "ORDER",
};

const STATUS = {
  FAIL: "Fail",
  SUCCESS: "Success",
};

var channel;
export default function createProductsMessageHandler({ Product }) {
  return async function handle(amqpChannel) {
    channel = amqpChannel;
    channel.consume(QUEUE.PRODUCT, async (data) => {
      let order = JSON.parse(data.content).order;
      console.log("order", order);
      const product = await Product.findById(order.product);
      console.log("product", product.name);
      if (product) {
        if (product.countInStock < order.qty) {
          channel.sendToQueue(
            QUEUE.ORDER,
            Buffer.from(
              JSON.stringify({
                orderId: order._id,
                status: STATUS.FAIL,
                errorMessage: "This product not enough quantity",
              })
            )
          );
        } else {
          product.countInStock = product.countInStock - order.qty;
          const updatedProduct = await product.save();
          channel.sendToQueue(
            QUEUE.ORDER,
            Buffer.from(
              JSON.stringify({
                orderId: order._id,
                status: STATUS.SUCCESS,
              })
            )
          );
        }
      } else {
        channel.sendToQueue(
          QUEUE.ORDER,
          Buffer.from(
            JSON.stringify({
              orderId: order._id,
              status: STATUS.FAIL,
              errorMessage: "This product not found",
            })
          )
        );
      }
    });
  };
}
