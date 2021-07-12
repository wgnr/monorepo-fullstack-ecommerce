import { INewCategory, ICategory } from "@models/entities/categories/categories.interfaces"

class CategoriesDTO {
  createNew(category: INewCategory): ICategory {
    return {
      products: [],
      ...category
    }
  }

  returnCategories(categories: ICategory | ICategory[]) {
    return Array.isArray(categories) ?
      categories.map(this.removeFields) :
      this.removeFields(categories)
  }

  private removeFields(category: ICategory): Omit<ICategory, "__v"> {
    const newCategory = { ...category }
    // @ts-ignore // TODO relacionado a usar la interfaz de mongoose
    delete newCategory.__v
    return newCategory
  }
}
export default new CategoriesDTO