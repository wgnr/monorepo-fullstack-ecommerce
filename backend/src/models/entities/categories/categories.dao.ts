import CommonDAO from "@models/entities/CommonDAO"
import { ICategory } from "@models/entities/categories/categories.interfaces"
import { categoriesModel } from "@models/entities/categories/categories.model"

class CategoriesDAO extends CommonDAO<ICategory> {
  constructor() {
    super(categoriesModel)
  }

  async getByName(name: string) {
    this.mongoDebug("getByName", { name })

    return await this.model.findOne({ name })
      .orFail(this.throwNotFoundError({ name }))
  }

  async getManyByIds(ids: string[]) {
    this.mongoDebug("getManyByIds", { ids })

    return await this.getMany({ _id: { $in: ids } })
  }

  async getManyByNames(names: string[]) {
    this.mongoDebug("getManyByNames", { names })

    return await this.model.find({ name: { $in: names } })
      .orFail(this.throwNotFoundError({ names }))
  }

  async deleteCategory(id: string) {
    this.mongoDebug("deleteCategory", { id })

    return await this.model.findByIdAndDelete(id)
      .orFail(this.throwNotFoundError({ id }))
  }

  async addProduct(categoryId: string, productId: string | string[]) {
    this.mongoDebug("addProduct", { categoryId, productId })

    const update = {
      $addToSet: {
        products:
          Array.isArray(productId) ? { $each: productId } : productId
      }
    }

    return await this.updateOneById(categoryId, update)
  }

  async removeProduct(categoryId: string, productId: string | string[]) {
    this.mongoDebug("removeProduct", { categoryId, productId })

    const update = {
      $pull: {
        products:
          Array.isArray(productId) ? { $in: productId } : productId
      }
    }

    return await this.updateOneById(categoryId, update)
  }
}

export default new CategoriesDAO
