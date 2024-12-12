// import productService from '../'
import BadRequestError from "../../utils/bad-request-error.js";
import asyncHandler from "../middleware/async.js";
import { validateSignature } from "../../utils/index.js";
import ProductService from "../../services/product.js";
const product = (app) => {
  const productService = new ProductService();

  app.post(
    "/create",
    asyncHandler(async (req, res, next) => {
      const { name, desc, banner, type, unit, price, available, supplier } =
        req.body;
      const { data } = await productService.createProduct({
        name,
        desc,
        banner,
        type,
        unit,
        price,
        available,
        supplier,
      });
      res.send(data);
    })
  );
  app.get(
    "/:id",
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      if (!id) {
        throw new BadRequestError("Invalid product ID", 400);
      }
      const product = await productService.getProductById(id);
      if (!product) {
        throw new BadRequestError("No product found", 404);
      }
      res.send(product);
    })
  );
};

export default product;
