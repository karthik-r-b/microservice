import CustomerModel from "../../models/Customer.js";
import AddressModel from "../../models/Address.js";

class CustomerRepository {
  async CreateCustomer({ email, userPassword, phone, name, salt }) {
    const customer = new CustomerModel({
      email,
      password: userPassword,
      phone,
      name,
      salt,
    });
    await customer.save();
    return customer;
  }
  async FindCustomerByEmail(email) {
    return CustomerModel.findOne({ email });
  }

  async FindCustomerById(id) {
    return CustomerModel.findById(id).select("-password").select("-salt");
  }
  async WishList(customerId) {
    const profile = await CustomerModel.findById(customerId).populate(
      "wishlist"
    );
    return profile.wishlist;
  }
  async AddToWishlist(
    customerId,
    { _id, name, desc, price, available, banner },
    isRemove
  ) {
    const product = { _id, name, desc, price, available, banner };
    const profile = await CustomerModel.findById(customerId).populate(
      "wishlist"
    );
    if (profile) {
      let isExist = false;
      if (profile.wishlist.length > 0) {
        profile.wishlist.forEach((item) => {
          if (item._id.toString() === _id.toString()) {
            const index = profile.wishlist.indexOf(item);
            profile.wishlist.splice(index, 1);
            isExist = true;
          }
        });
        if (!isExist && !isRemove) {
          profile.wishlist.push(product);
        }
      } else {
        console.log(product);
        if (!isRemove) {
          profile.wishlist.push(product);
        }
      }
    }
    await profile.save();
    return profile.wishlist;
  }
  async AddToCart(
    customerId,
    { _id, name, desc, price, banner },
    qty,
    isRemove
  ) {
    try {
      const profile = await CustomerModel.findById(customerId).populate(
        "cart.product"
      );
      if (profile) {
        const cartItem = {
          product: { _id, name, desc, price, banner },
          unit: qty,
        };
        let cartItems = profile.cart;
        let isExist = false;
        cartItems.forEach((item) => {
          if (item.product.id === id.toString()) {
            const index = cartItems.indexOf(item);
            if (isRemove) {
              cartItems.splice(index, 1);
            } else {
              item.unit += 1;
            }
            isExist = true;
          }
        });
        if (!isExist) {
          cartItems.push(cartItem);
        } else {
          cartItems.push(cartItem);
        }
        profile.cart = cartItems;
        return await profile.save();
      }
      throw new Error("Unable to add to cart");
    } catch (error) {
      console.log(error);
      throw new Error("Unable to find the customer");
    }
  }

  async AddOrderToProfile(customerId, order) {
    try {
      const profile = await this.FindCustomerById(customerId);
      if (profile) {
        if (profile.orders === undefined) {
          profile.orders = [];
        }
        profile.orders.push(order);
        profile.cart = [];
        const profileResult = await profile.save();
        return profileResult;
      }
    } catch (error) {
      throw new Error("Unable to add the order to the profile");
    }
  }
  async CreateAddress({ id, street, city, state, country }) {
    try {
      const customer = await this.FindCustomerById(id);
      if (customer) {
        const newAddress = new AddressModel({
          street: street,
          city: city,
          state: state,
          country: country,
        });
        await newAddress.save();
        customer.address.push(newAddress);
      }
      return await customer.save();
    } catch (error) {
      throw new Error("Unable to create address");
    }
  }
}

export default CustomerRepository;
