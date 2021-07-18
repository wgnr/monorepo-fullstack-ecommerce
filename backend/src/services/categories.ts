import { ObjectId } from "mongoose"
import CategoriesDAO from "@models/entities/categories/categories.dao"
import CategoriesDTO from "@models/entities/categories/categories.dto"
import { INewCategory } from "@models/entities/categories/categories.interfaces"
import { IProduct } from "@models/entities/products/products.interfaces"
import ProductsService from "@services/products"

class CategoriesService {
  async getAll() {
    return await CategoriesDAO.getMany()
  }

  async getById(id: string) {
    return await CategoriesDAO.getOneById(id)
  }

  async getOneByName(name: string) {
    return await CategoriesDAO.getByName(name)
  }

  async getProducts(categoryName: string): Promise<IProduct[]> {
    return await CategoriesDAO.getProducts(categoryName)
  }

  async getManyByName(names: string[]) {
    return await CategoriesDAO.getManyByNames(names)
  }

  async getIdsFromNames(names: string[] | undefined): Promise<ObjectId[]> {
    if (!names || names?.length === 0) return []

    return (await CategoriesDAO.getManyByNames(names)).map(c => c._id!)
  }

  async create(category: INewCategory) {
    const newCateogryDTO = CategoriesDTO.createNew(category)
    const categoryCreated = await CategoriesDAO.create(newCateogryDTO)

    if (categoryCreated.products.length > 0) {
      await ProductsService.addCategory(categoryCreated.products, categoryCreated._id)
    }

    return categoryCreated
  }

  async delete(categoryId: string) {
    await CategoriesDAO.deleteCategory(categoryId)
    await ProductsService.removeCategory(null, categoryId)
  }

  async addProducts(categoryId: string, productIds: string[]) {
    await CategoriesDAO.getOneById(categoryId)
    await ProductsService.addCategory(productIds, categoryId)
    await CategoriesDAO.addProduct(categoryId, productIds)
  }

  async removeProducts(categoryId: string, productIds: string[]) {
    await CategoriesDAO.getOneById(categoryId)
    await ProductsService.removeCategory(productIds, categoryId)
    await CategoriesDAO.removeProduct(categoryId, productIds)
  }

  /**
   * Ensures each category in product is also in the category products array
   */
  async syncProductAndCategory(product: IProduct): Promise<void> {
    const productId = product._id!

    for (const categoryId of product.categories) {
      try {
        const category = await CategoriesDAO.getOneById(categoryId)
        if (!category.products.includes(productId)) {
          await CategoriesDAO.addProduct(categoryId, <string>productId)
        }
      } catch (e) {
        await ProductsService.removeCategory(<string>productId, categoryId)
      }
    }
  }

  // return the names that doesn't exists
  async validateCategoriesNames(names: string[] | undefined): Promise<string[]> {
    if (!names || !names.length) return []

    const uniqueNames = Array.from(new Set(names))
    const result = (await this.getManyByName(uniqueNames)).map(c => c.name)
    return uniqueNames.filter(un => !result.includes(un))
  }
}

export default new CategoriesService
