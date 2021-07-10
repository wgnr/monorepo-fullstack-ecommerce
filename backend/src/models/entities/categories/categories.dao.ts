import { ObjectId } from "mongoose"
import CommonDAO from "@models/entities/CommonDAO"
import { ICategory } from "@models/entities/categories/categories.interfaces"
import { categoriesModel } from "@models/entities/categories/categories.model"
import { IProduct } from "@models/entities/products/products.interfaces"

class CategoriesDAO extends CommonDAO<ICategory> {
  constructor() {
    super(categoriesModel)
  }

  async getByNames(names: string[]): Promise<ICategory[]> {
    this.mongoDebug("getByNames", arguments)
    return await this.model.find({ name: { $in: names } })
  }

  async addProduct(categoryId: ObjectId, productId: ObjectId): Promise<void> {
    this.mongoDebug("getByNames", arguments)
    await this.updateOneById(categoryId, { $push: { products: productId } })
  }

  async getProducts(categoryName: string): Promise<IProduct[]> {
    this.mongoDebug("getByNames", arguments)
    const augmentedCategory = await this.model.findOne({ name: categoryName }).populate("products")

    if (!augmentedCategory) return []

    // @ts-ignore --> populate fetchs the products
    const products: IProduct[] = augmentedCategory.products
    return products
  }
}

export default new CategoriesDAO