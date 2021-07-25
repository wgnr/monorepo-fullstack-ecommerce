import VariantsService from "@services/variants"
import { CartStatus, ICartAddItem, ICart } from "@models/entities/carts/carts.interface"
import CartsDAO from "@models/entities/carts/carts.dao"
import ValidationException from "@exceptions/ValidationException"

class CartsService {
  async create(userId: string) {
    return await CartsDAO.create({
      variants: [],
      status: CartStatus.OPEN,
      user: userId,
    })
  }

  async getAll() {
    return await CartsDAO.getMany()
  }

  async getById(id: string) {
    return await CartsDAO.getOneById(id)
  }

  async getByStatus(statusName: string) {
    if (!Object.values(CartStatus).includes(statusName as CartStatus)) {
      throw new ValidationException(`Invalid status name: ${statusName}`)
    }

    return await CartsDAO.getManyByStatusName(statusName as CartStatus)
  }

  async upsertProducts(cartId: string, itemsToAdd: ICartAddItem[]) {
    const cart = await this.getById(cartId)
    this.validateCartCanModifyProducts(cart)

    await Promise.all(itemsToAdd.map(
      items => VariantsService.getById(items.variantId)
    ))

    for (const cartItem of itemsToAdd) {
      const itemInCart = cart.variants.find(
        itemInCart => String(itemInCart.variant) === cartItem.variantId
      )
      if (!itemInCart) {
        // Add item if doesn't exist
        cart.variants.push({
          ...cartItem,
          variant: cartItem.variantId
        })
      } else {
        // Update values if already exists
        itemInCart.quantity = cartItem.quantity
        itemInCart.comment = cartItem.comment
      }
    }

    await cart.save()
    return cart
  }

  validateCartCanModifyProducts(cart: ICart) {
    if (cart.status !== CartStatus.OPEN) {
      throw new ValidationException(`Cart must be ${CartStatus.OPEN} and it's ${cart.status}`)
    }
  }

  // async chageStatus(newStatus: CartStatus) {
  //   return await 
  // }

  async removeVariant(cartId: string, variantId: string) {
    const cart = await this.getById(cartId)
    this.validateCartCanModifyProducts(cart)

    cart.variants = cart.variants.filter(
      variant => String(variant.variant) !== variantId
    )
    await cart.save()
    return cart
  }

  async clear(cartId: string) {
    const cart = await this.getById(cartId)
    this.validateCartCanModifyProducts(cart)
    cart.variants = []
    await cart.save()
    return cart
  }
}

export default new CartsService
