import cartModel from "../../models/Cart.js";
import orderModel from "../../models/Order.js";
class ShoppingRepository {
  async Orders(customerId) {
    const orders = await orderModel.findOne({ customerId: customerId });
    return orders;
  }
  async manageCart(customerId, item, qty, isRemove) {
    const cart = await cartModel.findOne({ customerId: customerId });
    const { _id } = item;

    if (cart) {
      let isExist = false;
      let cartItems = cart.items;
      if (cartItems.length > 0) {
        cartItems.forEach((cartItem, index) => {
          if (cartItem.product._id.toString() === _id.toString()) {
            if (isRemove) {
              cartItems.splice(cartItems.indexOf(cartItem), 1);
            } else {
              cartItem.quantity = qty;
            }
            isExist = true;
          }
        });
        if (!isExist && !isRemove) {
          cartItems.items.push({ product: { ...item }, unit: qty });
        }
        cart.items = cartItems;
      }
      return await cart.save();
    } else {
      return await cartModel.create({
        customerId: customerId,
        items: [{ product: { ...item }, unit: qty }],
      });
    }
  }

  async getCartItems(customerId) {
    const cartItems = await cartModel.findOne({ customerId: customerId });
    return cartItems;
  }
  async createNewOrder(customerId, txnId) {
    const cart = await cartModel.findOne({ customerId: customerId });
    if (cart) {
      let amount = 0;
      let cartItems = cart.items;
      cartItems.forEach((cartItem) => {
        amount += cartItem.product.price * cartItem.unit;
      });
      const orderId = txnId;
      const order = new orderModel({
        orderId,
        customerId,
        amount,
        items: cartItems,
      });
      const orderResult = await order.save();
      return orderResult;
    }
  }

  async getOrders(customerId) {
    const orders = await orderModel.find({ customerId: customerId });
    return orders;
  }
}

export default ShoppingRepository;
