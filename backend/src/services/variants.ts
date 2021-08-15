import { ClientSession } from "mongoose";
import ProductsService from "@services/products";
import VariantsDAO from "@models/entities/variants/variants.dao";
import {
  IVariants,
  IVariantsDocument,
  IVariantUpdate,
} from "@models/entities/variants/variants.interfaces";
import OptionsService from "@services/options";
import { ValidationException } from "@exceptions/index";
import { ICartItem } from "@models/entities/carts/carts.interface";

class VariantsService {
  async getById(id: string) {
    return await VariantsDAO.getOneById(id);
  }

  async getPopulatedById(id: string) {
    const variant = await VariantsDAO.getPopullatedById(id);
    const options = await Promise.all(
      variant.options.map(optionValueId =>
        OptionsService.getOptionNameAndValueByValueId(String(optionValueId))
      )
    );

    return { ...variant.toJSON(), options };
  }

  async getManyByOptionValueId(id: string) {
    return await VariantsDAO.getManyByOptionValueId(id);
  }

  // async directCreate(productId: string,)

  async create(
    productId: string,
    validate: boolean,
    stock: number = 0,
    optionsIds: string[] = []
  ) {
    // Check that combination doesnt exists for product
    if (validate) {
      await OptionsService.validateOptionsUsedAreUnique(optionsIds);
      const product = await ProductsService.getById(productId);
      await this.validateOptionsCombinationUniqueness(product.variants, optionsIds);
    }

    const newVariant: IVariants = {
      product: productId,
      stock,
      stockInCheckout: 0,
      options: optionsIds,
    };
    return await VariantsDAO.create(newVariant);
  }

  async validateOptionsCombinationUniqueness(
    variantIds: string[],
    incomingOptionsValueIds: string[]
  ) {
    // optionIds combination must be unique for product
    for (const variantId of variantIds) {
      const { options /* array option values */ } = await VariantsDAO.getOneById(
        variantId
      );
      if (
        incomingOptionsValueIds.length === options.length &&
        incomingOptionsValueIds.every(opVal => options.includes(opVal))
      ) {
        throw new ValidationException(
          "Variant options value has already been defined."
        );
      }
    }
  }

  async update(variantId: string, payload: IVariantUpdate) {
    return await VariantsDAO.updateOneById(variantId, payload);
  }

  async delete(variantId: string) {
    // TODO check if variant is used in any cart
    return await VariantsDAO.deleteById(variantId);
  }

  async freezeStock(itemsInCart: ICartItem, session: ClientSession) {
    const { variant: variantId, quantity } = itemsInCart;
    const variant = (await VariantsDAO.addStockInCheckout(
      variantId,
      quantity,
      session
    )) as IVariantsDocument;
    this.validateStocksAfterUpdate(variant);
  }

  async unfreezeStock(itemsInCart: ICartItem, session: ClientSession) {
    const { variant: variantId, quantity } = itemsInCart;
    const variant = (await VariantsDAO.addStockInCheckout(
      variantId,
      -quantity,
      session
    )) as IVariantsDocument;
    this.validateStocksAfterUpdate(variant);
  }

  async discountStock(itemsInCart: ICartItem, session: ClientSession) {
    const { variant: variantId, quantity } = itemsInCart;
    await this.unfreezeStock(itemsInCart, session);
    const variant = (await VariantsDAO.releaseStockInCheckout(
      variantId,
      quantity,
      session
    )) as IVariantsDocument;
    this.validateStocksAfterUpdate(variant);
  }

  validateStocksAfterUpdate({
    id,
    stockInCheckout,
    availableStock,
  }: IVariantsDocument) {
    if (stockInCheckout < 0) {
      throw new ValidationException(
        `Variant ${id} have stockInCheckout ${stockInCheckout}`
      );
    }
    if (availableStock < 0) {
      throw new ValidationException(
        `Variant ${id} has available stock ${availableStock}`
      );
    }
  }
}

export default new VariantsService();
