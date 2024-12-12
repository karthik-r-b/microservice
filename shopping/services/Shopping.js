import ShoppingRepository from "../src/repository/shopping-repository.js";
import { formatData } from "../utils/utils.js";

class ShoppingService {
  constructor() {
    this.repository = new ShoppingRepository();
  }
  async AddCartItem(customerId, item, qty, isRemove) {
    const cartResult = await this.repository.manageCart(
      customerId,
      item,
      qty,
      isRemove
    );
    return formatData(cartResult);
  }

  async getCartItems(customerId) {
    const cartItems = await this.repository.getCartItems(customerId);
    return formatData(cartItems);
  }

  async getOrders(customerId) {
    const orders = await this.repository.getOrders(customerId);
    return formatData(orders);
  }

  async placeOrder(customerId, orderId) {
    const order = await this.repository.createNewOrder(customerId, orderId);
    return formatData(order);
  }

  async subscribeEvents(payload) {
    payload = JSON.parse(payload);
    const { event, data } = payload;
    const { userId, product, qty } = data;
    switch (event) {
      case "ADD_TO_CART":
        this.repository.manageCart(userId, product, qty, false);
        break;
      case "REMOVE_CART":
        this.repository.manageCart(userId, product, qty, true);
        break;
      default:
        break;
    }
  }
}

export default ShoppingService;
