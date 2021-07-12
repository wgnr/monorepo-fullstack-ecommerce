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

  async getAll() {
    return await CategoriesDAO.getMany()
  }

  async getOneOrAll({ id, name }: { id?: string, name?: string }) {
    let response;

    if (id) {
      response = await this.getById(id)
    } else if (name) {
      response = await this.getOneByName(name)
    } else {
      response = await this.getAll()
    }

    return response

  }

  async getById(id: string) {
    return await CategoriesDAO.getOneById(id)
  }

  async getProducts(categoryName: string): Promise<IProduct[]> {
    return await CategoriesDAO.getProducts(categoryName)
  }

  async getOneByName(name: string) {
    return await CategoriesDAO.getByName(name)
  }

  async getManyByName(names: string[]) {
    return await CategoriesDAO.getManyByNames(names)
  }

  async getIdsFromNames(names: string[] | undefined): Promise<ObjectId[]> {
    if (!names || names?.length === 0) return []

    return (await CategoriesDAO.getManyByNames(names)).map(c => c._id!)
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

  // return the names that doesn't exists
  async validateCategoriesNames(names: string[] | undefined): Promise<string[]> {
    if (!names) return []

    const uniqueNames = Array.from(new Set(names))
    const result = (await this.getManyByName(uniqueNames)).map(c => c.name)
    return uniqueNames.filter(un => !result.includes(un))
  }
}

export default new CategoriesService
