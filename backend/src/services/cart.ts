import { ClientSession, ObjectId } from "mongoose";
import VariantsService from "@services/variants";
import OptionsService from "@services/options";
import ValidationException from "@exceptions/ValidationException";
import { IVariantsDocument } from "@models/entities/variants/variants.interfaces";
import {
  CartStatus,
  ICartAddItem,
  ICart,
  ICartDocument,
} from "@models/entities/carts/carts.interface";
import CartsDAO from "@models/entities/carts/carts.dao";
import { IProduct } from "@models/entities/products/products.interfaces";
import { IOptionSummary } from "@models/entities/options/options.interface";

class CartsService {
  async create(userId: string) {
    return await CartsDAO.create({
      variants: [],
      status: CartStatus.OPEN,
      user: userId,
    });
  }

  async getAll() {
    return await CartsDAO.getMany();
  }

  async getById(id: string) {
    return await CartsDAO.getOneById(id);
  }

  async getPopulatedById(id: string) {
    return await CartsDAO.getPopulatedById(id);
  }

  async getFullPopulatedById(id: string) {
    const cart = await this.getPopulatedById(id);
    return await this.populateOptions(cart.toJSON());
  }

  async getByStatus(statusName: string) {
    if (!Object.values(CartStatus).includes(statusName as CartStatus)) {
      throw new ValidationException(`Invalid status name: ${statusName}`);
    }

    return await CartsDAO.getManyByStatus(statusName as CartStatus);
  }

  getTotalPrice(cart: ICartDocument) {
    return cart.variants.reduce((total, itemInCart) => {
      const { price } = (itemInCart.variant as IVariantsDocument)
        .product as IProduct;
      const { quantity } = itemInCart;
      return total + price * quantity;
    }, 0);
  }

  async populateOptions(cart: ICart) {
    const optionsArr = cart.variants.flatMap(cartVariant =>
      (cartVariant.variant as IVariantsDocument).options.map(o => String(o))
    );

    const allOptionsIds = [...new Set(optionsArr)];

    const optionsByNameAndValue = await Promise.all(
      allOptionsIds.map(optionId =>
        OptionsService.getOptionNameAndValueByValueId(optionId)
      )
    );

    cart.variants.forEach(variant => {
      variant.variant.options = variant.variant.options.map((optionId: ObjectId) =>
        optionsByNameAndValue.find(
          optionWithNameAndValue =>
            optionWithNameAndValue.value.id === String(optionId)
        )
      );
    });
    return cart;
  }

  async getProductsSummary(cart: ICart) {
    const populatedCart = await this.populateOptions(cart);
    return populatedCart.variants.map(itemInCart => {
      const { quantity } = itemInCart;
      const { name } = (itemInCart.variant as IVariantsDocument).product as IProduct;
      const options = (
        (itemInCart.variant as IVariantsDocument).options as IOptionSummary[]
      ).map(option => `${option.option.name}: ${option.value.name}`);

      return `${quantity}x ${name} ${
        options.length > 0 ? `(${options.join(" | ")})` : ""
      }`;
    });
  }

  async upsertProducts(cartId: string, itemsToAdd: ICartAddItem[]) {
    const cart = await this.getById(cartId);
    this.validateCartCanModifyProducts(cart);

    const variants = await Promise.all(
      itemsToAdd.map(items => VariantsService.getById(items.variantId))
    );

    // Validate if stock is enough
    itemsToAdd.forEach(item => {
      const { quantity, variantId } = item;
      const { availableStock } = variants.filter(
        variant => variant.id === variantId
      )[0] as IVariantsDocument;

      if (availableStock < quantity) {
        throw new ValidationException(
          `Item ${variantId} has available stock ${availableStock} and it was requested ${quantity}`
        );
      }
    });

    for (const cartItem of itemsToAdd) {
      const itemInCart = cart.variants.find(
        itemInCart => String(itemInCart.variant) === cartItem.variantId
      );
      if (!itemInCart) {
        // Add item if doesn't exist
        cart.variants.push({
          ...cartItem,
          variant: cartItem.variantId,
        });
      } else {
        // Update values if already exists
        itemInCart.quantity = cartItem.quantity;
        itemInCart.comment = cartItem.comment;
      }
    }

    await cart.save();
    return cart;
  }

  validateCartCanModifyProducts(cart: ICart) {
    if (cart.status !== CartStatus.OPEN) {
      throw new ValidationException(
        `Cart must be ${CartStatus.OPEN} and it's ${cart.status}`
      );
    }
  }

  validateCartIsNotEmpty(cart: ICart) {
    if (!cart?.variants?.length) {
      throw new ValidationException(
        "Cart must have at least one product. It's empty"
      );
    }
  }

  async chageStatus(
    cart: ICartDocument,
    newStatus: CartStatus,
    session: ClientSession
  ) {
    if (cart.status === CartStatus.PURCHASED)
      throw new ValidationException("Cart is already purchased. Can't be opened.");

    // Manipulate stock
    if (newStatus === CartStatus.OPEN) {
      if (cart.status !== CartStatus.IN_CHECKOUT) {
        throw new ValidationException("Only cart in checkout can be opened.");
      }
      await Promise.all(
        cart.variants.map(itemInCart =>
          VariantsService.unfreezeStock(itemInCart, session)
        )
      );
    } else if (newStatus === CartStatus.IN_CHECKOUT) {
      if (cart.status !== CartStatus.OPEN) {
        throw new ValidationException("Only an open cart can be in checkout");
      }
      await Promise.all(
        cart.variants.map(itemInCart =>
          VariantsService.freezeStock(itemInCart, session)
        )
      );
    } else if (newStatus === CartStatus.PURCHASED) {
      if (cart.status !== CartStatus.IN_CHECKOUT) {
        throw new ValidationException("Only a cart in checkout can be purchased.");
      }
      await Promise.all(
        cart.variants.map(itemInCart =>
          VariantsService.discountStock(itemInCart, session)
        )
      );
    }

    cart.status = newStatus;
    await cart.save({ session });
  }

  async removeVariant(cartId: string, variantId: string) {
    const cart = await this.getById(cartId);
    this.validateCartCanModifyProducts(cart);

    cart.variants = cart.variants.filter(
      variant => String(variant.variant) !== variantId
    );
    await cart.save();
    return cart;
  }

  async clear(cartId: string) {
    const cart = await this.getById(cartId);
    this.validateCartCanModifyProducts(cart);
    cart.variants = [];
    await cart.save();
    return cart;
  }
}

export default new CartsService();
