import { INewCategory, ICategory } from "@models/entities/categories/categories.interfaces"

class CategoriesDTO {
  createNew(category: INewCategory): ICategory {
    return {
      products: [],
      ...category
    }
  }

  // returnCategories(categories: MICategory | MICategory[]) {
  //   return Array.isArray(categories) ?
  //     categories.map(c => this.removeFields(c.toObject())) :
  //     this.removeFields(categories.toObject())
  // }

  // private removeFields(category: ICategory) {
  //   const newCategory = { ...category }
  //   delete newCategory.__v
  //   return newCategory
  // }
}
export default new CategoriesDTO