const QUEUE = {
  PRODUCT: "PRODUCT",
  ORDER: "ORDER",
};

const STATUS = {
  FAIL: "Fail",
  SUCCESS: "Success",
};

var channel;
export default function createOrdersMessageHandler({ Order }) {
  return async function handle(amqpChannel) {
    channel = amqpChannel;
    channel.consume(QUEUE.ORDER, async (data) => {
      let order = JSON.parse(data.content);
      try {
        let updatedOrder = await Order.findById(order.orderId);
        console.log("order", updatedOrder);
        updatedOrder.status = order.status;
        updatedOrder.errorMessage = order.errorMessage;
        await updatedOrder.save();
      } catch (err) {
        console.log(err);
      }
      // const order = await Order.findById(order.order);
      // console.log("order", order.name);
      // if (order) {
      //   if (order.countInStock < order.qty) {
      //     channel.sendToQueue(
      //       QUEUE.ORDER,
      //       Buffer.from(
      //         JSON.stringify({
      //           orderId: order.id,
      //           status: STATUS.FAIL,
      //           errorMessage: "This order not enough quantity",
      //         })
      //       )
      //     );
      //   } else {
      //     order.countInStock = order.countInStock - order.qty;
      //     const updatedOrder = await order.save();
      //     channel.sendToQueue(
      //       QUEUE.ORDER,
      //       Buffer.from(
      //         JSON.stringify({
      //           orderId: order.id,
      //           status: STATUS.SUCCESS,
      //         })
      //       )
      //     );
      //   }
      // } else {
      //   channel.sendToQueue(
      //     QUEUE.ORDER,
      //     Buffer.from(
      //       JSON.stringify({
      //         orderId: order.id,
      //         status: STATUS.FAIL,
      //         errorMessage: "This order not found",
      //       })
      //     )
      //   );
      // }
    });
  };
}
