import ProductRepository from "../src/repository/product-repository.js";
import { formatData } from "../../customer/utils/utils.js";
class ProductService {
  constructor() {
    this.repository = new ProductRepository();
  }

  async getProductById(productId) {
    const product = await this.repository.getProductById(productId);
    return formatData(product);
  }

  async getProductByCategory(category) {
    const product = await this.repository.findByCategory(category);
    return formatData(product);
  }

  async createProduct(product) {
    const newProduct = await this.repository.createProduct(product);
    return formatData(newProduct);
  }

  async getSelectedProducts(selectedIds) {
    const products = await this.repository.findSelectedProducts(selectedIds);
    return formatData(products);
  }
}

export default ProductService;
