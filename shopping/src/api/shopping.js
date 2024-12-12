import BadRequestError from "../../utils/bad-request-error.js";
import asyncHandler from "../middleware/async.js";
import { validateSignature } from "../../utils/index.js";
import ShoppingService from "../../services/Shopping.js";
const shopping = (app) => {
  const shoppingService = new ShoppingService();

  app.post(
    "/order",
    validateSignature,
    asyncHandler(async (req, res, next) => {
      const { id } = req.user;
      const { txnNumber } = req.body;
      const order = await shoppingService.placeOrder(id, txnNumber);
      res.send(order);
    })
  );

  app.get(
    "/orders",
    validateSignature,
    asyncHandler(async (req, res, next) => {
      const { id } = req.user;
      const orders = await shoppingService.getOrders(id);
      res.send(orders);
    })
  );

  app.post(
    "/cart",
    validateSignature,
    asyncHandler(async (req, res, next) => {
      const { id } = req.user;
      const { product, qty } = req.body;
      const { data } = await shoppingService.AddCartItem(
        id,
        product,
        qty,
        true
      );
      res.send(data);
    })
  );
};

export default shopping;
