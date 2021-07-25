import CategoriesDAO from "@models/entities/categories/categories.dao"
import { ICategoryNew } from "@models/entities/categories/categories.interfaces"
import { IProductDocument } from "@models/entities/products/products.interfaces"
import ProductsService from "@services/products"

class CategoriesService {
  async getAll() {
    return await CategoriesDAO.getMany()
  }

  async getById(id: string) {
    return await CategoriesDAO.getOneById(id)
  }

  async getManyByIds(ids: string[]) {
    return await CategoriesDAO.getManyByIds(ids)
  }

  async getOneByName(name: string) {
    return await CategoriesDAO.getByName(name)
  }

  async getManyByName(names: string[]) {
    return await CategoriesDAO.getManyByNames(names)
  }

  async getIdsFromNames(names: string[] | undefined) {
    if (!names || names?.length === 0) return []

    return (await CategoriesDAO.getManyByNames(names)).map(c => c._id!)
  }

  async create(category: ICategoryNew) {
    const newCategory = {
      ...category,
      products: [...new Set(category.products)]
    }

    if (newCategory.products.length > 0) {
      await ProductsService.validateProductIdsExist(newCategory.products)
    }

    const createdCategory = await CategoriesDAO.create(newCategory)

    if (createdCategory.products.length > 0) {
      await ProductsService.addCategory(createdCategory.products, createdCategory._id)
    }

    return createdCategory
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
  async syncProductAndCategory(product: IProductDocument): Promise<void> {
    const productId = product._id

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
  // async validateCategoriesNames(names: string[] | undefined): Promise<string[]> {
  //   if (!names || !names.length) return []

  //   const uniqueNames = Array.from(new Set(names))
  //   const result = (await this.getManyByName(uniqueNames)).map(c => c.name)
  //   return uniqueNames.filter(un => !result.includes(un))
  // }

  async validateCategoriesExistByIds(categoriesIds: string[] | undefined) {
    if (!categoriesIds) return

    const ids = [...new Set(categoriesIds)]
    await this.getManyByIds(ids)
  }
}

export default new CategoriesService
