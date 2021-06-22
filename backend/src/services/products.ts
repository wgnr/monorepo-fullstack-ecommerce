import { v4 as uuidv4 } from "uuid"
import { INewProduct, ProductsModel, IProduct } from "@models/products"


export const getAllProducts = async (): Promise<IProduct[]> => {
  return await ProductsModel.find()
};

export const createProduct = async (body: INewProduct): Promise<IProduct> => {
  const newProduct: IProduct = {
    ...body,
    id: uuidv4(),
  };

  return await ProductsModel.create(newProduct)
};