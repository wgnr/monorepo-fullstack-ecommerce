import { ObjectId } from "mongoose"
import CommonDAO from "@models/entities/CommonDAO"
import { ICategory } from "@models/entities/categories/categories.interfaces"
import { categoriesModel } from "@models/entities/categories/categories.model"
import { IProduct } from "@models/entities/products/products.interfaces"

class CategoriesDAO extends CommonDAO<ICategory> {
  constructor() {
    super(categoriesModel)
  }

  async getByName(name: string) {
    return await this.model.findOne({ name })
  }

  async getManyByNames(names: string[]): Promise<ICategory[]> {
    this.mongoDebug("getManyByNames", { names })
    return await this.model.find({ name: { $in: names } })
  }

  async addProduct(categoryId: ObjectId, productId: ObjectId): Promise<void> {
    this.mongoDebug("addProduct", { categoryId, productId })
    await this.updateOneById(categoryId, { $push: { products: productId } })
  }

  async getProducts(categoryName: string): Promise<IProduct[]> {
    this.mongoDebug("getProducts", { categoryName })
    const augmentedCategory = await this.model.findOne({ name: categoryName }).populate("products")

    if (!augmentedCategory) return []

    const products: IProduct[] = augmentedCategory.products
    return products
  }
}

export default new CategoriesDAO
