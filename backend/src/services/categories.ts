import { ObjectId } from "mongoose"
import CategoriesDAO from "@models/entities/categories/categories.dao"
import CategoriesDTO from "@models/entities/categories/categories.dto"
import { INewCategory } from "@models/entities/categories/categories.interfaces"
import { IProduct } from "@models/entities/products/products.interfaces"
import ProductsService from "@services/products"

class CategoriesService {
  async create(category: INewCategory) {
    const newCategory = CategoriesDTO.createNew(category)
    return await CategoriesDAO.create(newCategory)
  }

  async getProducts(categoryName: string): Promise<IProduct[]> {
    return await CategoriesDAO.getProducts(categoryName)
  }

  async getIdsFromNames(names: string[] | undefined): Promise<ObjectId[]> {
    if (!names || names?.length === 0) return []

    return (await CategoriesDAO.getByNames(names)).map(c => c._id!)
  }

  /**
   * Ensures each category in product is also in the category products array
   */
  async syncProductAndCategory(products: IProduct): Promise<void> {
    const productId = products._id!

    for (const categoryId of products.categories) {
      const category = await CategoriesDAO.getOneById(categoryId)

      if (!category) {
        // Category doesn't exist, remove from product category
        await ProductsService.removeCategory(productId, categoryId)
      } else if (!category.products.includes(productId)) {
        await CategoriesDAO.addProduct(categoryId, productId)
      }
    }
  }
}

export default new CategoriesService
