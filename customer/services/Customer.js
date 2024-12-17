import CustomerRepository from "../src/repository/customer-repository.js";
import BadRequestError from "../utils/bad-request-error.js";
import {
  generatePassword,
  generateSalt,
  generateToken,
  validatePassword,
} from "../utils/index.js";
import { formatData } from "../utils/utils.js";
class CustomerService {
  constructor() {
    this.repository = new CustomerRepository();
  }

  async signUp(payload) {
    const { name, email, password, phone } = payload;
    const userEntity = await this.repository.FindCustomerByEmail(email);
    if (userEntity._id) {
      throw new BadRequestError(`user already exists`, 400);
    }
    const salt = await generateSalt();
    let userPassword = await generatePassword(password, salt);
    const user = await this.repository.CreateCustomer({
      email,
      userPassword,
      phone,
      name,
      salt,
    });
    const token = await generateToken({ email: email, id: user._id });
    return formatData({ id: user._id, token: token });
  }

  async login({ email, password }) {
    const userEntity = await this.repository.FindCustomerByEmail(email);
    if (!userEntity) {
      throw new BadRequestError("User doesn't exist", 404);
    }
    const validateUser = await validatePassword(
      password,
      userEntity.password,
      userEntity.salt
    );
    if (validateUser) {
      const token = await generateToken({ id: userEntity._id });
      return formatData({ id: userEntity._id, token: token });
    } else {
      throw new BadRequestError("Invalid credentials", 401);
    }
  }

  async getProfile(id) {
    const customerEntity = await this.repository.FindCustomerById(id);
    if (customerEntity) {
      return formatData(customerEntity);
    } else {
      throw new BadRequestError("Invalid customerId", 400);
    }
  }
  async getWishlist(customerId) {
    let customerEntity = await this.repository.FindCustomerById(customerId);
    if (!customerEntity) {
      throw new BadRequestError("Invalid customerId", 400);
    }
    return formatData(customerEntity.wishlist);
  }

  async createWishlist(customerId, product, isRemove) {
    const { _id, name, desc, price, available, banner } = product;
    const wishlistEntity = await this.repository.AddToWishlist(
      customerId,
      { _id, name, desc, price, available, banner },
      isRemove
    );
    return formatData(wishlistEntity);
  }

  async subscribeEvents(payload) {
    const { event, data } = payload;
    const { userId, product, order, qty } = data;
    switch (event) {
      case "ADD_TO_WISHLIST":
        this.repository.AddToWishlist(userId, product, false);
        break;
      case "REMOVE_TO_WISHLIST":
        this.repository.AddToWishlist(userId, product, true);
      case "ADD_TO_CART":
        this.repository.AddToCart(userId, product, qty, false);
        break;
      case "REMOVE_FROM_CART":
        this.repository.AddToCart(userId, product, qty, true);
      case "CREATE_ORDER":
        this.repository.AddOrderToProfile(userId, order);
        break;
      case "TESTING":
        console.log("*** TESTING ***");
        break;
      default:
        break;
    }
  }
}

export default CustomerService;
