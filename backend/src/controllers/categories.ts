import { Request, Response, NextFunction } from "express";
import CategoryService from "@services/categories"
import CategoryDTO from "@models/entities/categories/categories.dto"
import { HttpException } from "@exceptions/index";


class CategoriesControllers {
  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    const { query: { name } } = req
    const { params: { id } } = req

    let result = await CategoryService.getOneOrAll({ id, name: name && String(name) })
    if (!result) return next(new HttpException(404, "Nothing found"))

    // @ts-ignore // TODO extends interfaces from document
    return res.json(CategoryDTO.returnCategories(result.toObject()))
  }
}

export default new CategoriesControllers