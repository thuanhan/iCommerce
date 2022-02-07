import Order from "../models/orderModel";
import createOrdersEndpointHandler from "./ordersEndpoint";
import createOrdersMessageHandler from "./ordersMessage";

const ordersEndpointHandler = createOrdersEndpointHandler({ Order });
const ordersMessageHandler = createOrdersMessageHandler({ Order });

export { ordersEndpointHandler, ordersMessageHandler };
