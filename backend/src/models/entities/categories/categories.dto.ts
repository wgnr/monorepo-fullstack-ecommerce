import {
  ICategoryNew,
  ICategory,
} from "@models/entities/categories/categories.interfaces";

class CategoriesDTO {
  createNew(category: ICategoryNew): ICategory {
    return {
      products: [],
      ...category,
    };
  }
}
export default new CategoriesDTO();
