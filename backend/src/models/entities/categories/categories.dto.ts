import { INewCategory, ICategory } from "@models/entities/categories/categories.interfaces"

class CategoriesDTO {
  createNew(category: INewCategory): ICategory {
    return {
      products: [],
      ...category
    }
  }
}
export default new CategoriesDTO