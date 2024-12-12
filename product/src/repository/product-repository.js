import productModel from "../../models/Product.js";

class ProductRepository {
  constructor(product) {
    this.product = product;
  }

  async getProductById(id) {
    return await productModel.findById(id);
  }
  async findByCategory(category) {
    return await productModel.find({ type: category });
  }

  async products() {
    return await productModel.find();
  }

  async createProduct(product) {
    const { name, desc, banner, type, unit, price, available, supplier } =
      product;
    const newProduct = new productModel({
      name,
      desc,
      banner,
      type,
      unit,
      price,
      available,
      supplier,
    });
    return await newProduct.save();
  }
  async findSelectedProducts(selectedIds) {
    const products = await productModel
      .find()
      .where("_id")
      .in(selectedIds.map((_id) => _id === _id))
      .exec();
    return products;
  }
}

export default ProductRepository;
