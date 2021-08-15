import { readdir, unlink } from "fs/promises";
import { ObjectId, Document } from "mongoose";
import CategoriesService from "@services/categories";
import OptionsService from "@services/options";
import VariantsService from "@services/variants";
import ProductsDAO from "@models/entities/products/products.dao";
import {
  IProduct,
  IProductDocument,
  IProductNew,
} from "@models/entities/products/products.interfaces";
import NotFoundException from "@exceptions/NotFoundException";
import { ValidationException } from "@exceptions/index";
import {
  IVariantBase,
  IVariantUpdate,
} from "@models/entities/variants/variants.interfaces";

class ProductService {
  async getAll() {
    return await ProductsDAO.getMany();
  }

  async getById(id: string, useLean: boolean = true) {
    return await ProductsDAO.getOneById(id, useLean);
  }

  async getByIds(ids: string[]) {
    return await ProductsDAO.getMany({ _id: { $in: ids } });
  }

  async getByCategoryName(name: string) {
    const { _id } = await CategoriesService.getOneByName(name);
    return await ProductsDAO.getManyByCategoryId(_id);
  }

  async getVariantPopulatedByVariantId(variantId: string) {
    return await VariantsService.getPopulatedById(variantId);
  }

  async getPopulatedByProductId(productId: string) {
    const product = (await ProductsDAO.getPopulatedById(
      productId
    )) as IProductDocument;

    const optionValuesIds = [
      ...new Set(
        product.variants
          .map(variant => variant.options.map((option: ObjectId) => String(option)))
          .flat()
      ),
    ];

    const optionsResponses = await Promise.all(
      optionValuesIds.map(valueId =>
        OptionsService.getOptionNameAndValueByValueId(valueId)
      )
    );

    product.variants.forEach(variant => {
      // @ts-ignore
      variant.options = variant.options.map((option: ObjectId) =>
        optionsResponses.find(
          optionResponse => String(optionResponse.value.id) === String(option)
        )
      );
    });

    return product;
  }

  async getFileName(productId: string) {
    try {
      const files = await readdir("./public/images/products");
      const nextNumber = String(
        files.filter(f => f.startsWith(productId)).length
      ).padStart(3, "0");
      return `${productId}-${nextNumber}`;
    } catch (err) {
      return `${productId}-000`;
    }
  }

  async addImage(productId: string, fileName: string) {
    return await ProductsDAO.insertImage(productId, fileName);
  }

  async removeImage(productId: string, fileName: string) {
    await unlink(`./public/images/products/${fileName}`);
    return await ProductsDAO.removeImage(productId, fileName);
  }

  async createProducts(products: IProductNew[]) {
    return await Promise.all(products.map(product => this.createProduct(product)));
  }

  async createProduct(product: IProductNew) {
    // Validate categories
    await CategoriesService.validateCategoriesExistByIds(product.categories);

    // Validate variants
    const { variants = [] } = product;
    if (variants.length > 0) {
      // Validate each combiantion isn't repeated in the variant options
      // They are an array of ids.
      const sortedOptions = variants.map(variant =>
        variant.options?.sort().join(",")
      );
      if (new Set(sortedOptions).size !== sortedOptions.length) {
        throw new ValidationException(
          "Repeated option values combination in variants."
        );
      }

      await Promise.all(
        variants.map(({ options }) => {
          OptionsService.validateOptionsUsedAreUnique(options);
        })
      );
    }

    const newProduct = await ProductsDAO.create({
      categories: [],
      ...product,
      variants: [],
    });

    if (variants.length > 0) {
      const newVariants = await Promise.all(
        variants.map(({ options, stock }) =>
          VariantsService.create(newProduct._id, false, stock, options)
        )
      );
      newProduct.variants.push(...newVariants.map(v => v._id));
    } else {
      const newVariant = await VariantsService.create(newProduct._id, false);
      newProduct.variants.push(newVariant._id);
    }
    await newProduct.save();

    // Sync categories and product content
    await CategoriesService.syncProductAndCategory(newProduct as IProductDocument);

    return newProduct;
  }

  async addVariant(productId: string, variant: IVariantBase) {
    const { stock, options } = variant;
    const product = await this.getById(productId, false);

    if (!(product instanceof Document)) {
      throw new Error("Internal error, expected a mongoose document");
    }

    const newVariant = await VariantsService.create(productId, true, stock, options);

    // DEBT: Replace document method for $addorset method
    product.variants.push(newVariant._id);
    await product.save();
    return newVariant;
  }

  async update(id: string, payload: IProduct) {
    return await ProductsDAO.updateProduct(id, payload);
  }

  async updateVariant(variantId: string, payload: IVariantUpdate) {
    return await VariantsService.update(variantId, payload);
  }

  async delete(id: string | ObjectId) {
    // TODO remove product from any open CART
    const contDeleted = await ProductsDAO.deleteById(id as ObjectId);
    return contDeleted;
  }

  async deleteVariant(variantId: string) {
    return await VariantsService.delete(variantId);
  }

  async addCategory(productIds: (string | ObjectId)[], categoryId: string) {
    await ProductsDAO.addCategory(<ObjectId[]>productIds, categoryId);
  }

  async removeCategory(productId: string | string[] | null, categoryId: string) {
    await ProductsDAO.removeCategory(productId, categoryId);
  }

  async validateProductIdsExist(productIds: string[]) {
    const products = await this.getByIds(productIds);
    const idsNotFound = productIds.filter(id => !products.find(p => p.id === id));
    if (idsNotFound.length > 0) {
      throw new NotFoundException("products", idsNotFound);
    }
  }
}

export default new ProductService();
