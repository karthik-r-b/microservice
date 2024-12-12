import CustomerRepository from "../repository/customer-repository.js";
import CustomerService from "../../services/customer.js";
import BadRequestError from "../../utils/bad-request-error.js";
import asyncHandler from "../middleware/async.js";
import { validateSignature } from "../../utils/index.js";
import { formatData } from "../../utils/utils.js";
const customerRepository = new CustomerRepository();
const customer = (app) => {
  const customerService = new CustomerService();

  app.get(
    "/profile",
    validateSignature,
    asyncHandler(async (req, res, next) => {
      const { id } = req.user;
      const customerEntity = await customerService.getProfile(id);
      res.send(customerEntity);
    })
  );

  app.post(
    "/signup",
    asyncHandler(async (req, res, next) => {
      const { name, email, password, phone } = req.body;
      const result = await customerService.signUp({
        name,
        email,
        password,
        phone,
      });
      res.send(result);
    })
  );

  app.post(
    "/login",
    asyncHandler(async (req, res, next) => {
      const { email, password } = req.body;
      const result = await customerService.login({ email, password });
      res.send(result);
    })
  );

  app.post(
    "/address",
    validateSignature,
    asyncHandler(async (req, res, next) => {
      const { id } = req.user;
      const { street, city, state, country } = req.body;
      //create address for the customer
      if (!id) {
        throw new BadRequestError(`Please enter the customer ID`, 400);
      }
      try {
        const customer = await customerRepository.FindCustomerById(id);
        if (!customer) {
          throw new Error("customer not found");
        }
        const customerResult = await customerRepository.CreateAddress({
          id,
          street,
          city,
          state,
          country,
        });
        res.send(customerResult);
      } catch (error) {
        throw new BadRequestError(error.message);
      }
    })
  );

  app.get(
    "/wishlist",
    validateSignature,
    asyncHandler(async (req, res, next) => {
      const { id } = req.user;
      const customerEntity = await customerService.getWishlist(id);
      res.send(customerEntity);
    })
  );

  app.post(
    "/create-wishlist",
    validateSignature,
    asyncHandler(async (req, res, next) => {
      const { id } = req.user;
      if (!id) {
        throw new BadRequestError(`Please enter the customer ID`, 400);
      }
      const customerEntity = await customerService.getProfile(id);
      if (!customerEntity) {
        throw new BadRequestError(`Customer not found`, 400);
      }
      const { product } = req.body;
      const wishlist = await customerService.createWishlist(id, product, false);
      res.send(wishlist);
    })
  );

  app.get(
    "/shopping-details",
    validateSignature,
    asyncHandler(async (req, res, next) => {
      const { id } = req.user;
      const customerEntity = await customerService.getProfile(id);
      if (!customerEntity) {
        throw new BadRequestError("Customer not found", 400);
      }
      res.send(customerEntity);
    })
  );
};
export default customer;
